import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { env } from '@/app/lib/env';

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

// Customer Account API: the canonical state the Loop sync mirrors — the
// customer's name, default address, and subscription contracts in one round
// trip. Read after the Shopify writes so Loop reflects what Shopify now holds.
const CANONICAL_SYNC_QUERY = `
  query CanonicalCustomerForLoopSync {
    customer {
      firstName
      lastName
      defaultAddress {
        address1
        address2
        city
        zoneCode
        zip
        territoryCode
        phoneNumber
      }
      subscriptionContracts(first: 50) {
        nodes {
          id
          status
        }
      }
    }
  }
`;

// Loop Admin API base. Loop keeps a shipping address per subscription contract,
// independent of Shopify's customer default address — see syncLoopSubscriptionAddresses.
const LOOP_ADMIN_BASE = 'https://api.loopsubscriptions.com/admin/2023-10';

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

interface CanonicalSyncData {
  customer: {
    firstName: string | null;
    lastName: string | null;
    defaultAddress: {
      address1: string | null;
      address2: string | null;
      city: string | null;
      zoneCode: string | null;
      zip: string | null;
      territoryCode: string | null;
      phoneNumber: string | null;
    } | null;
    subscriptionContracts: {
      nodes: Array<{ id: string; status: string }>;
    };
  } | null;
}

// Per-operation outcome. The route runs two independent Shopify mutations
// (name, address) with no transactional wrapper available; we record what
// each attempt did so partial failures surface honestly rather than masking
// a successful write under a generic 400.
type OpResult = { ok: true } | { ok: false; error: string };
type ResultMap = { name?: OpResult; address?: OpResult; subscriptions?: OpResult };

async function customerAccountFetch<T>(
  accessToken: string,
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  // Use the app-wide Customer Account API URL (env.customerAccountApiUrl) so
  // this route tracks the same, supported API version as the rest of the app
  // rather than pinning its own.
  const response = await fetch(env.customerAccountApiUrl, {
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

// Outcome of pushing the address to a single Loop subscription.
type LoopContractOutcome = 'updated' | 'skipped' | 'failed';

// Update one subscription's Loop shipping address. The address endpoint needs
// Loop's internal numeric ID, so resolve it via GET first (the shopify-{id}
// alias works for the lookup). A 404 means the contract is not Loop-managed,
// so there is nothing to update — that is 'skipped', not a failure.
async function pushAddressToLoopSubscription(
  numericId: string,
  body: string,
  loopToken: string,
): Promise<LoopContractOutcome> {
  const getRes = await fetch(`${LOOP_ADMIN_BASE}/subscription/shopify-${numericId}`, {
    headers: { 'X-Loop-Token': loopToken },
  });
  if (getRes.status === 404) {
    console.log(`[CUSTOMER-UPDATE][loop] shopify-${numericId} not in Loop, skipping`);
    return 'skipped';
  }
  if (!getRes.ok) {
    console.error(`[CUSTOMER-UPDATE][loop] GET shopify-${numericId} failed: ${getRes.status}`);
    return 'failed';
  }

  const getJson = await getRes.json();
  const loopInternalId = getJson?.data?.id ?? getJson?.id;
  if (!loopInternalId) {
    console.error(`[CUSTOMER-UPDATE][loop] No internal id for shopify-${numericId}`);
    return 'failed';
  }

  const putRes = await fetch(`${LOOP_ADMIN_BASE}/subscription/${loopInternalId}/address`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Loop-Token': loopToken },
    body,
  });
  if (!putRes.ok) {
    const text = await putRes.text();
    console.error(
      `[CUSTOMER-UPDATE][loop] PUT address for ${loopInternalId} failed: ${putRes.status} ${text}`,
    );
    return 'failed';
  }

  console.log(`[CUSTOMER-UPDATE][loop] Address updated on subscription ${loopInternalId}`);
  return 'updated';
}

// Mirror the customer's current address onto their Loop subscription contracts.
//
// Why this is needed: Shopify's customerAddressUpdate only changes the
// customer's default-address record. Loop stores the shipping address
// separately on each subscription contract (captured when the subscription
// was created) and never re-reads Shopify's default address. Without this
// call, a customer who updates their address in the portal still has every
// future subscription delivery shipped to the OLD address.
//
// The address pushed to Loop is read straight from Shopify's canonical
// post-write state, not from the request body, so a name-only or phone-only
// edit syncs just as reliably as a full address edit.
//
// Best-effort: the Shopify write is the source of truth for identity, so a
// Loop failure here is reported as a partial success rather than failing the
// whole request. Returns undefined when there is nothing to sync.
async function syncLoopSubscriptionAddresses(
  accessToken: string,
): Promise<OpResult | undefined> {
  const loopToken = process.env.LOOP_API_KEY;
  if (!loopToken) {
    console.error('[CUSTOMER-UPDATE][loop] LOOP_API_KEY not configured');
    return { ok: false, error: 'the subscription service is not configured' };
  }

  // Read the canonical post-write state — name, address, and contracts — in one
  // round trip. The recipient name lives on the customer; the delivery address
  // on defaultAddress.
  let data: CanonicalSyncData;
  try {
    data = await customerAccountFetch<CanonicalSyncData>(accessToken, CANONICAL_SYNC_QUERY);
  } catch (e) {
    console.error('[CUSTOMER-UPDATE][loop] Failed to read canonical account state:', e);
    return { ok: false, error: 'we could not load your account details' };
  }

  const addr = data.customer?.defaultAddress;
  if (!addr) {
    // No default address on file — there is nothing to mirror to Loop.
    console.log('[CUSTOMER-UPDATE][loop] No default address, nothing to sync');
    return undefined;
  }

  const firstName = data.customer?.firstName ?? '';
  const lastName = data.customer?.lastName ?? '';

  // Loop rejects a subscription address missing any of these four fields.
  if (!lastName || !addr.address1 || !addr.city || !addr.territoryCode) {
    console.error('[CUSTOMER-UPDATE][loop] Missing required address field, skipping Loop sync', {
      hasLastName: !!lastName,
      hasAddress1: !!addr.address1,
      hasCity: !!addr.city,
      hasCountryCode: !!addr.territoryCode,
    });
    return { ok: false, error: 'a required address field was missing' };
  }

  // Only ACTIVE and PAUSED contracts have future deliveries to redirect.
  const contracts = data.customer?.subscriptionContracts?.nodes ?? [];
  const updatable = contracts.filter((c) => {
    const s = (c.status || '').toUpperCase();
    return s === 'ACTIVE' || s === 'PAUSED';
  });

  if (updatable.length === 0) {
    console.log('[CUSTOMER-UPDATE][loop] No active/paused subscriptions to update');
    return undefined;
  }

  const body = JSON.stringify({
    firstName,
    lastName,
    phone: addr.phoneNumber ?? '',
    address1: addr.address1,
    address2: addr.address2 ?? '',
    city: addr.city,
    countryCode: addr.territoryCode,
    provinceCode: addr.zoneCode ?? '',
    zip: addr.zip ?? '',
  });

  let updated = 0;
  let failed = 0;

  // Sequential, not parallel: Loop's address endpoint is rate limited (5/s)
  // and a typical customer has only one or two subscriptions.
  for (const contract of updatable) {
    const numericId = contract.id.split('/').pop();
    if (!numericId) {
      failed++;
      continue;
    }
    try {
      const outcome = await pushAddressToLoopSubscription(numericId, body, loopToken);
      if (outcome === 'updated') updated++;
      else if (outcome === 'failed') failed++;
      // 'skipped' (not a Loop-managed contract) counts as neither.
    } catch (e) {
      console.error(`[CUSTOMER-UPDATE][loop] Error updating shopify-${numericId}:`, e);
      failed++;
    }
  }

  if (updated === 0 && failed === 0) return undefined; // none Loop-managed
  if (failed === 0) return { ok: true };
  if (updated === 0) return { ok: false, error: 'we could not reach your subscription provider' };
  return {
    ok: false,
    error: `${failed} of ${updated + failed} subscriptions could not be updated`,
  };
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

    // === Loop subscription address sync ===
    // Loop keeps a shipping address per subscription contract, separate from
    // Shopify's customer record, and never re-reads it. Re-mirror it whenever a
    // Shopify write landed: name, phone, and address all feed the Loop delivery
    // address. Skip it when the address write itself failed — Shopify still
    // holds the old address, so a sync would push stale data and the
    // partial-success message would be misleading. The helper reads canonical
    // state from Shopify, so the request's field shape does not matter.
    const nameSaved = results.name?.ok === true;
    const addressSaved = results.address?.ok === true;
    const addressFailed = results.address?.ok === false;
    if ((nameSaved || addressSaved) && !addressFailed) {
      const loopResult = await syncLoopSubscriptionAddresses(accessToken);
      if (loopResult) results.subscriptions = loopResult;
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

    const LABELS: Record<keyof ResultMap, string> = {
      name: 'name',
      address: 'address',
      subscriptions: 'subscription delivery address',
    };

    let errorString: string;
    if (succeeded.length === 0) {
      // Every attempted op failed. Surface the first error verbatim; no need
      // to flag partial state.
      errorString = failed[0][1].error;
    } else {
      const okPart = succeeded.map(([k]) => LABELS[k]).join(' and ');
      const failedPart = failed.map(([k]) => LABELS[k]).join(' and ');
      const failedReasons = failed.map(([, r]) => r.error).join(' ');
      const okVerb = succeeded.length > 1 ? 'were' : 'was';
      const changeNoun = failed.length > 1 ? 'changes' : 'change';
      errorString = `Your ${okPart} ${okVerb} saved, but the ${failedPart} ${changeNoun} failed: ${failedReasons}`;
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
