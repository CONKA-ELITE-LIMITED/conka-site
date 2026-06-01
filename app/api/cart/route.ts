import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { shopifyFetch, Cart } from '@/app/lib/shopify';
import {
  CREATE_CART,
  ADD_TO_CART,
  UPDATE_CART_LINES,
  UPDATE_CART_ATTRIBUTES,
  REMOVE_FROM_CART,
  GET_CART,
} from '@/app/lib/shopifyQueries';

const cartLineAttributesSchema = z
  .array(z.object({ key: z.string(), value: z.string() }))
  .optional();

// Cart-level attributes (e.g. Meta _fbp / _fbc) — distinct from per-line attributes.
const cartAttributesSchema = cartLineAttributesSchema;

// Zod schemas for cart operations
const cartActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('create'),
    variantId: z.string().optional(),
    quantity: z.number().int().positive().optional(),
    sellingPlanId: z.string().optional(),
    attributes: cartLineAttributesSchema,
    cartAttributes: cartAttributesSchema,
  }),
  z.object({
    action: z.literal('add'),
    cartId: z.string().min(1, 'Cart ID is required'),
    variantId: z.string().min(1, 'Variant ID is required'),
    quantity: z.number().int().positive().optional(),
    sellingPlanId: z.string().optional(),
    attributes: cartLineAttributesSchema,
    cartAttributes: cartAttributesSchema,
  }),
  z.object({
    action: z.literal('update'),
    cartId: z.string().min(1, 'Cart ID is required'),
    lineId: z.string().min(1, 'Line ID is required'),
    quantity: z.number().int().positive().optional(),
  }),
  z.object({
    action: z.literal('remove'),
    cartId: z.string().min(1, 'Cart ID is required'),
    lineId: z.string().min(1, 'Line ID is required'),
  }),
]);

// Types for API responses
interface CartCreateResponse {
  cartCreate: {
    cart: Cart | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: Cart | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

interface CartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: Cart | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

interface CartLinesRemoveResponse {
  cartLinesRemove: {
    cart: Cart | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

interface CartAttributesUpdateResponse {
  cartAttributesUpdate: {
    cart: Cart | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

interface GetCartResponse {
  cart: Cart | null;
}

/**
 * Apply cart-level attributes (e.g. Meta _fbp / _fbc) to an existing cart.
 * Best-effort: attribution must never fail the add-to-cart, so on any error or
 * when there are no attributes we return the cart we already have.
 */
async function applyCartAttributes(
  cartId: string,
  cartAttrs: Array<{ key: string; value: string }> | undefined,
  fallbackCart: Cart | null
): Promise<Cart | null> {
  if (!cartAttrs || cartAttrs.length === 0) return fallbackCart;
  try {
    const res = await shopifyFetch<CartAttributesUpdateResponse>(UPDATE_CART_ATTRIBUTES, {
      cartId,
      attributes: cartAttrs,
    });
    return res.data?.cartAttributesUpdate?.cart ?? fallbackCart;
  } catch (err) {
    console.error('Cart attributes update error:', err);
    return fallbackCart;
  }
}

// GET - Fetch cart by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get('cartId');

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }

    const response = await shopifyFetch<GetCartResponse>(GET_CART, {
      id: cartId,
    });

    if (!response.data?.cart) {
      return NextResponse.json(
        { error: 'Cart not found or expired' },
        { status: 404 }
      );
    }

    return NextResponse.json({ cart: response.data.cart });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST - Cart operations (create, add, update, remove)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input with Zod
    const validationResult = cartActionSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;
    const action = validatedData.action;

    switch (action) {
      case 'create': {
        // Create a new cart, optionally with initial items
        const { variantId, quantity, sellingPlanId, attributes, cartAttributes } = validatedData;

        interface CartLineInput {
          merchandiseId: string;
          quantity: number;
          sellingPlanId?: string;
          attributes?: Array<{ key: string; value: string }>;
        }

        const cartAttrs = cartAttributes && cartAttributes.length > 0 ? cartAttributes : undefined;
        const input: {
          lines?: CartLineInput[];
          attributes?: Array<{ key: string; value: string }>;
        } = {
          ...(cartAttrs && { attributes: cartAttrs }),
        };
        const lineAttrs = attributes && attributes.length > 0 ? attributes : undefined;

        if (variantId) {
          const line: CartLineInput = {
            merchandiseId: variantId,
            quantity: quantity || 1,
            ...(lineAttrs && { attributes: lineAttrs }),
          };

          // Add selling plan for subscription
          if (sellingPlanId) {
            line.sellingPlanId = sellingPlanId;
          }

          input.lines = [line];
        }

        const response = await shopifyFetch<CartCreateResponse>(CREATE_CART, {
          input,
        });

        // Check for selling plan error and retry without it
        if (response.data?.cartCreate?.userErrors?.length > 0) {
          const userError = response.data.cartCreate.userErrors[0];
          console.error('Cart create user errors:', response.data.cartCreate.userErrors);
          
          // If the error is about selling plan, retry without it
          if (sellingPlanId && userError.message.toLowerCase().includes('selling plan')) {
            console.log('Selling plan not applicable, retrying without subscription...');
            
            // Retry without selling plan (keep same line + cart attributes)
            const retryInput: {
              lines?: CartLineInput[];
              attributes?: Array<{ key: string; value: string }>;
            } = {
              ...(cartAttrs && { attributes: cartAttrs }),
            };
            if (variantId) {
              retryInput.lines = [{
                merchandiseId: variantId,
                quantity: quantity || 1,
                ...(lineAttrs && { attributes: lineAttrs }),
              }];
            }
            
            const retryResponse = await shopifyFetch<CartCreateResponse>(CREATE_CART, {
              input: retryInput,
            });
            
            if (retryResponse.data?.cartCreate?.userErrors?.length > 0) {
              return NextResponse.json(
                { error: retryResponse.data.cartCreate.userErrors[0].message },
                { status: 400 }
              );
            }
            
            if (retryResponse.data?.cartCreate?.cart) {
              return NextResponse.json({ 
                cart: retryResponse.data.cartCreate.cart,
                warning: 'Subscription not available for this product. Added as one-time purchase.'
              });
            }
          }
          
          return NextResponse.json(
            { error: userError.message },
            { status: 400 }
          );
        }

        if (!response.data?.cartCreate?.cart) {
          console.error('Cart create failed - no cart returned. Response:', JSON.stringify(response, null, 2));
          return NextResponse.json(
            { error: 'Failed to create cart - no cart returned from Shopify' },
            { status: 500 }
          );
        }

        return NextResponse.json({ cart: response.data.cartCreate.cart });
      }

      case 'add': {
        // Add item to existing cart
        const { cartId, variantId, quantity, sellingPlanId, attributes, cartAttributes } = validatedData;

        interface CartLineInput {
          merchandiseId: string;
          quantity: number;
          sellingPlanId?: string;
          attributes?: Array<{ key: string; value: string }>;
        }

        const lineAttrs = attributes && attributes.length > 0 ? attributes : undefined;
        const cartAttrs = cartAttributes && cartAttributes.length > 0 ? cartAttributes : undefined;
        const line: CartLineInput = {
          merchandiseId: variantId,
          quantity: quantity || 1,
          ...(lineAttrs && { attributes: lineAttrs }),
        };
        
        // Add selling plan for subscription
        if (sellingPlanId) {
          line.sellingPlanId = sellingPlanId;
        }

        const response = await shopifyFetch<CartLinesAddResponse>(ADD_TO_CART, {
          cartId,
          lines: [line],
        });

        // Check for selling plan error and retry without it
        if (response.data?.cartLinesAdd?.userErrors?.length > 0) {
          const userError = response.data.cartLinesAdd.userErrors[0];
          console.error('Cart add user errors:', response.data.cartLinesAdd.userErrors);
          
          // If the error is about selling plan, retry without it (keep same attributes)
          if (sellingPlanId && userError.message.toLowerCase().includes('selling plan')) {
            console.log('Selling plan not applicable, retrying without subscription...');
            
            const retryResponse = await shopifyFetch<CartLinesAddResponse>(ADD_TO_CART, {
              cartId,
              lines: [{
                merchandiseId: variantId,
                quantity: quantity || 1,
                ...(lineAttrs && { attributes: lineAttrs }),
              }],
            });
            
            if (retryResponse.data?.cartLinesAdd?.userErrors?.length > 0) {
              return NextResponse.json(
                { error: retryResponse.data.cartLinesAdd.userErrors[0].message },
                { status: 400 }
              );
            }
            
            if (retryResponse.data?.cartLinesAdd?.cart) {
              const retriedCart = await applyCartAttributes(
                cartId,
                cartAttrs,
                retryResponse.data.cartLinesAdd.cart
              );
              return NextResponse.json({
                cart: retriedCart,
                warning: 'Subscription not available for this product. Added as one-time purchase.'
              });
            }
          }

          return NextResponse.json(
            { error: userError.message },
            { status: 400 }
          );
        }

        const addedCart = await applyCartAttributes(
          cartId,
          cartAttrs,
          response.data?.cartLinesAdd?.cart ?? null
        );
        return NextResponse.json({ cart: addedCart });
      }

      case 'update': {
        // Update quantity of a line item
        const { cartId, lineId, quantity } = validatedData;

        const response = await shopifyFetch<CartLinesUpdateResponse>(UPDATE_CART_LINES, {
          cartId,
          lines: [
            {
              id: lineId,
              quantity: quantity || 1,
            },
          ],
        });

        if (response.data?.cartLinesUpdate?.userErrors?.length > 0) {
          return NextResponse.json(
            { error: response.data.cartLinesUpdate.userErrors[0].message },
            { status: 400 }
          );
        }

        return NextResponse.json({ cart: response.data?.cartLinesUpdate?.cart });
      }

      case 'remove': {
        // Remove a line item from cart
        const { cartId, lineId } = validatedData;

        const response = await shopifyFetch<CartLinesRemoveResponse>(REMOVE_FROM_CART, {
          cartId,
          lineIds: [lineId],
        });

        if (response.data?.cartLinesRemove?.userErrors?.length > 0) {
          return NextResponse.json(
            { error: response.data.cartLinesRemove.userErrors[0].message },
            { status: 400 }
          );
        }

        return NextResponse.json({ cart: response.data?.cartLinesRemove?.cart });
      }
    }
  } catch (error) {
    console.error('Cart operation error:', error);
    return NextResponse.json(
      { error: 'Failed to perform cart operation' },
      { status: 500 }
    );
  }
}

