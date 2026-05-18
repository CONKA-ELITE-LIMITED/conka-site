import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Zod schema for profile update validation
// Frontend sends both display values (country, province) and API codes (territoryCode, zoneCode)
const profileUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  address: z.object({
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    zoneCode: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
    territoryCode: z.string().optional(),
  }).optional(),
});

// Customer Account API: fetch customer to get default address ID
const CUSTOMER_ADDRESSES_QUERY = `
  query CustomerAddresses {
    customer {
      defaultAddress {
        id
      }
    }
  }
`;

// Customer Account API mutation to update customer profile
// CustomerUpdateInput only supports firstName and lastName
const CUSTOMER_UPDATE = `
  mutation customerUpdate($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        firstName
        lastName
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

// Customer Account API mutation to create an address and set as default
// Uses defaultAddress param to set as default in a single call
const CUSTOMER_ADDRESS_CREATE = `
  mutation customerAddressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
      customerAddress {
        id
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

// Customer Account API mutation to update an existing address
const CUSTOMER_ADDRESS_UPDATE = `
  mutation customerAddressUpdate($addressId: ID!, $address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) {
      customerAddress {
        id
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

interface CustomerAccountApiResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface UserError {
  field: string[];
  message: string;
  code: string;
}

interface CustomerUpdateData {
  customerUpdate: {
    customer: { id: string } | null;
    userErrors: UserError[];
  };
}

interface CustomerAddressesData {
  customer: {
    defaultAddress: { id: string } | null;
  } | null;
}

interface AddressMutationData {
  customerAddressCreate?: {
    customerAddress: { id: string } | null;
    userErrors: UserError[];
  };
  customerAddressUpdate?: {
    customerAddress: { id: string } | null;
    userErrors: UserError[];
  };
}

// Per-operation outcome. The route runs two independent Shopify mutations
// (name, address) with no transactional wrapper available; we record what
// each attempt did so partial failures surface honestly rather than masking
// a successful write under a generic 400.
type OpResult = { ok: true } | { ok: false; error: string };
type ResultMap = { name?: OpResult; address?: OpResult };

async function customerAccountFetch<T>(
  accessToken: string,
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const shopId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID;
  if (!shopId) {
    throw new Error('SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID not configured');
  }

  const apiUrl = `https://shopify.com/${shopId}/account/customer/api/2024-10/graphql`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Customer Account API HTTP error:', response.status, text);
    throw new Error(`Customer Account API returned ${response.status}`);
  }

  const result: CustomerAccountApiResponse<T> = await response.json();

  if (result.errors?.length) {
    console.error('Customer Account API GraphQL errors:', result.errors);
    throw new Error(result.errors[0].message);
  }

  if (!result.data) {
    throw new Error('Customer Account API returned no data');
  }

  return result.data;
}

export async function POST(request: NextRequest) {
  try {
    // Get access token from cookie (consistent with other auth routes)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('customer_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = profileUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { firstName, lastName, phone, address } = validationResult.data;

    const results: ResultMap = {};

    // === Name mutation (CustomerUpdateInput only supports firstName/lastName) ===
    const customerInput: Record<string, string> = {};
    if (firstName !== undefined) customerInput.firstName = firstName;
    if (lastName !== undefined) customerInput.lastName = lastName;

    if (Object.keys(customerInput).length > 0) {
      try {
        const result = await customerAccountFetch<CustomerUpdateData>(
          accessToken,
          CUSTOMER_UPDATE,
          { input: customerInput },
        );
        if (result.customerUpdate.userErrors.length > 0) {
          const userError = result.customerUpdate.userErrors[0];
          console.error('Customer update userError:', userError);
          results.name = { ok: false, error: userError.message };
        } else {
          results.name = { ok: true };
        }
      } catch (e) {
        console.error('Customer update threw:', e);
        results.name = { ok: false, error: 'Unable to save your name. Please try again.' };
      }
    }

    // === Address mutation (also covers phone, which lives on CustomerAddressInput) ===
    const hasAddressFields = address && (address.address1 || address.city || address.zip);
    // Only treat phone as a write when there's a non-empty value. The modal
    // always posts a phone field (defaulting to ""), so a looser check would
    // make every firstName-only edit enter the address branch.
    const hasPhoneChange = typeof phone === 'string' && phone.length > 0;

    if (hasAddressFields || hasPhoneChange) {
      try {
        // CustomerAddressInput uses territoryCode (ISO country code) and zoneCode (ISO subdivision code)
        // These are round-tripped from the session query, not mapped from display names
        const addressInput: Record<string, string> = {};
        if (address?.address1) addressInput.address1 = address.address1;
        if (address?.address2) addressInput.address2 = address.address2;
        if (address?.city) addressInput.city = address.city;
        if (address?.zoneCode) addressInput.zoneCode = address.zoneCode;
        if (address?.zip) addressInput.zip = address.zip;
        if (address?.territoryCode) addressInput.territoryCode = address.territoryCode;
        if (phone) addressInput.phoneNumber = phone;

        const customerData = await customerAccountFetch<CustomerAddressesData>(
          accessToken,
          CUSTOMER_ADDRESSES_QUERY,
        );
        const existingAddressId = customerData.customer?.defaultAddress?.id;

        if (existingAddressId) {
          const updateResult = await customerAccountFetch<AddressMutationData>(
            accessToken,
            CUSTOMER_ADDRESS_UPDATE,
            { addressId: existingAddressId, address: addressInput, defaultAddress: true },
          );
          const errors = updateResult.customerAddressUpdate?.userErrors || [];
          if (errors.length > 0) {
            console.error('Address update userError:', errors[0]);
            results.address = { ok: false, error: errors[0].message };
          } else {
            results.address = { ok: true };
          }
        } else if (hasAddressFields) {
          const createResult = await customerAccountFetch<AddressMutationData>(
            accessToken,
            CUSTOMER_ADDRESS_CREATE,
            { address: addressInput, defaultAddress: true },
          );
          const errors = createResult.customerAddressCreate?.userErrors || [];
          if (errors.length > 0) {
            console.error('Address create userError:', errors[0]);
            results.address = { ok: false, error: errors[0].message };
          } else {
            results.address = { ok: true };
          }
        } else {
          // Phone-only with no existing default address. Shopify requires
          // address1/city/country on CustomerAddressInput, so a phone-only
          // record cannot be persisted. Record as an address failure so the
          // user sees a precise message.
          results.address = {
            ok: false,
            error: 'Please add a delivery address before saving a phone number.',
          };
        }
      } catch (e) {
        console.error('Address mutation threw:', e);
        results.address = { ok: false, error: 'Unable to save your address. Please try again.' };
      }
    }

    // === Compose response from per-operation results ===
    const attempted = Object.entries(results) as Array<[keyof ResultMap, OpResult]>;

    if (attempted.length === 0) {
      // Nothing was actually submitted (e.g. an empty body). Treat as a no-op
      // success rather than reporting a confusing error.
      return NextResponse.json({ success: true, message: 'No changes to save.' });
    }

    const succeeded = attempted.filter(([, r]) => r.ok);
    const failed = attempted.filter((entry): entry is [keyof ResultMap, { ok: false; error: string }] => !entry[1].ok);

    if (failed.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
        results,
      });
    }

    const LABELS: Record<keyof ResultMap, string> = { name: 'name', address: 'address' };

    let errorString: string;
    if (succeeded.length === 0) {
      // Every attempted op failed. Surface the first error verbatim; no need
      // to flag partial state.
      errorString = failed[0][1].error;
    } else {
      const okPart = succeeded.map(([k]) => LABELS[k]).join(' and ');
      const failedPart = failed.map(([k]) => LABELS[k]).join(' and ');
      const failedReasons = failed.map(([, r]) => r.error).join(' ');
      errorString = `Your ${okPart} was saved, but the ${failedPart} change failed: ${failedReasons}`;
    }

    return NextResponse.json(
      { error: errorString, results },
      { status: 400 }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
