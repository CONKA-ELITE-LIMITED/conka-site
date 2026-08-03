/**
 * Subscription Actions API Route
 *
 * Uses Loop Admin API. Most endpoints accept shopify-{id} format, but some
 * (skipNext, frequency) require Loop's internal numeric ID — those cases
 * GET the subscription first to resolve the ID.
 *
 * Loop API docs: https://developer.loopwork.co/reference/api-reference
 *
 * This route is named "pause" for historical reasons but handles all actions
 * via the `action` parameter in the request body.
 *
 * @route POST /api/auth/subscriptions/[id]/pause
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/app/lib/env';
import { sizeToTierKey } from '@/app/lib/productSizeUtils';
import { SUPPORT_EMAIL } from '@/app/lib/supportEmail';
import { getFunnelSwapGroupId, getFunnelVariantNumericId } from '@/app/lib/funnelData';

const LOOP_API_BASE = 'https://api.loopsubscriptions.com/admin/2023-10';

// Plan configurations with Shopify Selling Plan IDs and Variant IDs
// These must match the selling plans and variants configured in Shopify
// From shopifyProductMapping.ts

// Variant IDs by protocol/formula and tier — verified against Shopify
const PROTOCOL_VARIANTS: Record<string, Record<string, number>> = {
  // Protocol 1: Protocol: CONKA Resilience (Product: 15528618951030)
  '1': {
    starter: 56999240597878,  // RESILIANCE_STARTER_4 - Starter - 4
    pro:     56999240630646,  // RESILIANCE_PRO_12 - Pro - 12
    max:     56999240663414,  // RESILIANCE_MAX_28 - Max - 28
  },
  // Protocol 2: Protocol: CONKA Precision (Product: 15528617804150)
  '2': {
    starter: 56999234503030,  // PRECISION_STARTER_4 - Starter - 4
    pro:     56999234535798,  // PRECISION_PRO_12 - Pro - 12
    max:     56999234568566,  // PRECISION_MAX_28 - Max - 28
  },
  // Protocol 3: Protocol: Conka Balance (Product: 15528510423414)
  '3': {
    starter: 56998884573558,  // BALANCED_STARTER_4 - Starter - 4
    pro:     56998884606326,  // BALANCED_PRO_12 - Pro - 12
    max:     56998884639094,  // BALANCED_MAX_28 - Max - 28
  },
  // Protocol 4: Protocol: CONKA Ultimate (Product: 15528620589430)
  '4': {
    pro: 56999249478006,      // ULTAMATE_PRO_28 - Pro - 28
    max: 56999249510774,      // ULTAMATE_MAX_56 - Max - 56
  },
  // Formula: CONKA Flow (Product: 15528722170230)
  'flow': {
    starter: 57000187363702,  // FLOW_TRIAL_4 - Flow - 4 Shots
    pro_8:   56999967785334,  // FLOW_TRIAL_8 - Flow - 8 Shots
    pro:     56999967752566,  // FLOW_TRIAL_12 - Flow - 12 Shots
    max:     56999967818102,  // FLOW_TRIAL_28 - Flow - 28 Shots
  },
  // Formula: CONKA Clear (Product: 15528796291446)
  'clear': {
    starter: 57000418607478,  // CLEATR_TRIAL_4 - Clear - 4 Shots
    pro_8:   57000418640246,  // CLEAR_TRIAL_8 - Clear - 8 Shots
    pro:     57000418673014,  // CLEAR_TRIAL_12 - Clear - 12 Shots
    max:     57000418705782,  // CLEAR_TRIAL_28 - Clear - 28 Shots
  },
};

// Reverse lookup: variant ID -> protocol/formula ID
const VARIANT_TO_PROTOCOL: Record<number, string> = {};
for (const [protocolId, variants] of Object.entries(PROTOCOL_VARIANTS)) {
  for (const variantId of Object.values(variants)) {
    VARIANT_TO_PROTOCOL[variantId] = protocolId;
  }
}

// Selling plan group IDs and billing intervals verified against Shopify
// SellingPlanGroup numeric IDs extracted from GIDs
const PLAN_CONFIGURATIONS = {
  starter: {
    name: 'Starter (Weekly)',
    interval: 'WEEK',       // Verified: WEEK x 1
    intervalCount: 1,
    sellingPlanId: '711429882230',        // SellingPlan: 711429882230
    sellingPlanGroupId: '98722480502',    // SellingPlanGroup: 98722480502
    quantity: 1,
  },
  pro: {
    name: 'Pro (Bi-Weekly)',
    interval: 'WEEK',       // Verified: WEEK x 2 (NOT DAY x 14 — this was the bug)
    intervalCount: 2,
    sellingPlanId: '711429947766',        // SellingPlan: 711429947766
    sellingPlanGroupId: '98722546038',    // SellingPlanGroup: 98722546038
    quantity: 1,
  },
  max: {
    name: 'Max (Monthly)',
    interval: 'MONTH',      // Verified: MONTH x 1
    intervalCount: 1,
    sellingPlanId: '711429980534',        // SellingPlan: 711429980534
    sellingPlanGroupId: '98722578806',    // SellingPlanGroup: 98722578806
    quantity: 1,
  },
};

type ActionType = 'pause' | 'resume' | 'resume-now' | 'cancel' | 'skip' | 'change-frequency' | 'edit-multi-line' | 'reactivate' | 'place-order' | 'apply-discount' | 'swap-product';
type PlanType = 'starter' | 'pro' | 'max';
type ProtocolIdType = '1' | '2' | '3' | '4';
type FunnelProductKey = 'flow' | 'clear' | 'both';

interface ActionRequest {
  action?: ActionType;
  plan?: PlanType;
  protocolId?: ProtocolIdType; // Optional: if provided, swap to this protocol
  reason?: string;
  pauseWeeks?: number; // Pause duration in weeks (1-12). Defaults to 12 (3 months).
  resumeNowEpoch?: number; // For resume-now: epoch timestamp for the new next billing date
  lines?: Array<{ lineId: string | number; productKey: string; size: number }>;
  discountCode?: string; // For apply-discount: Shopify discount code to apply
  targetProduct?: FunnelProductKey; // For swap-product: the funnel product to swap to (same cadence)
}

/**
 * Convert a Shopify GID or numeric ID to Loop's shopify-{id} format
 * Input: "gid://shopify/SubscriptionContract/126077600118" or "126077600118"
 * Output: "shopify-126077600118"
 */
function toLoopShopifyId(subscriptionId: string): string {
  // If it's already in Loop format, return as-is
  if (subscriptionId.startsWith('shopify-') || subscriptionId.startsWith('loop-')) {
    return subscriptionId;
  }
  
  // Extract numeric ID from Shopify GID format
  if (subscriptionId.includes('gid://shopify/SubscriptionContract/')) {
    const numericId = subscriptionId.split('/').pop();
    return `shopify-${numericId}`;
  }
  
  // If it's a plain numeric ID, prefix with shopify-
  if (/^\d+$/.test(subscriptionId)) {
    return `shopify-${subscriptionId}`;
  }
  
  // If it's a URL-encoded GID, decode and extract
  if (subscriptionId.includes('%2F')) {
    const decoded = decodeURIComponent(subscriptionId);
    const numericId = decoded.split('/').pop();
    return `shopify-${numericId}`;
  }
  
  // Fallback: return as-is and let Loop handle it
  return subscriptionId;
}

/**
 * Make a request to Loop API
 * @param endpoint - API endpoint path
 * @param loopToken - Loop API token
 * @param method - HTTP method (default: POST)
 * @param body - Request body (optional)
 */
async function loopRequest(
  endpoint: string, 
  loopToken: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
  body?: object
) {
  const url = `${LOOP_API_BASE}${endpoint}`;
  console.log(`[Loop API] ${method} ${url}`, body ? JSON.stringify(body) : '');
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Loop-Token': loopToken,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const responseText = await response.text();
  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    data = { rawResponse: responseText };
  }

  console.log(`[Loop API] Response ${response.status}:`, JSON.stringify(data).substring(0, 500));
  return { response, data };
}


export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: subscriptionId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('customer_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  if (!subscriptionId) {
    return NextResponse.json(
      { error: 'Subscription ID is required' },
      { status: 400 }
    );
  }

  const loopToken = env.loopApiKey;
  if (!loopToken) {
    return NextResponse.json(
      { error: 'Loop API not configured' },
      { status: 500 }
    );
  }

  // Parse request body - action defaults to 'pause' for backwards compatibility
  let body: ActionRequest = { action: 'pause' };
  try {
    const requestBody = await request.json();
    if (requestBody && typeof requestBody === 'object') {
      body = { ...body, ...requestBody };
    }
  } catch {
    // No body or invalid JSON - use default action 'pause'
  }

  const { action = 'pause', plan, protocolId, reason, pauseWeeks, resumeNowEpoch } = body;

  // Convert to Loop's shopify-{id} format
  const loopSubscriptionId = toLoopShopifyId(subscriptionId);

  console.log(`[${action.toUpperCase()}] Input: ${subscriptionId} -> Loop format: ${loopSubscriptionId}`);

  try {
    let result: { response: Response; data: any };
    let successMessage = '';

    switch (action) {
      case 'pause': {
        // Loop API: POST /subscription/{id}/pause
        // pauseWeeks comes from the PauseModal (1-12 weeks). Cap at 12 weeks (3 months).
        const MAX_PAUSE_WEEKS = 12;
        const weeks = Math.min(Math.max(pauseWeeks || MAX_PAUSE_WEEKS, 1), MAX_PAUSE_WEEKS);

        // Convert weeks to Loop's pauseDuration format
        // Loop's valid intervalType enum: DAY, MONTH, YEAR, CUSTOM (NOT WEEK)
        // Use MONTH for durations that are exact multiples of 4 weeks, DAY otherwise
        let pauseDuration: { intervalCount: number; intervalType: string };
        if (weeks >= 4 && weeks % 4 === 0) {
          pauseDuration = { intervalCount: weeks / 4, intervalType: 'MONTH' };
        } else {
          pauseDuration = { intervalCount: weeks * 7, intervalType: 'DAY' };
        }

        result = await loopRequest(`/subscription/${loopSubscriptionId}/pause`, loopToken, 'POST', {
          pauseDuration,
        });

        // Build a human-readable duration label for the success message
        const durationLabel = (weeks >= 4 && weeks % 4 === 0)
          ? `${weeks / 4} month${weeks / 4 > 1 ? 's' : ''}`
          : `${weeks} week${weeks > 1 ? 's' : ''}`;
        successMessage = `Subscription paused for ${durationLabel}. You can resume anytime.`;
        break;
      }

      case 'resume':
        result = await loopRequest(`/subscription/${loopSubscriptionId}/resume`, loopToken, 'POST');
        successMessage = 'Subscription resumed successfully';
        break;

      case 'resume-now': {
        // Step 1: Resume the subscription
        result = await loopRequest(`/subscription/${loopSubscriptionId}/resume`, loopToken, 'POST');
        if (!result.response.ok) {
          // Resume failed — bail out before rescheduling
          break;
        }

        // Step 2: GET the subscription to resolve the Loop internal ID (needed for reschedule)
        const resumeSubResult = await loopRequest(
          `/subscription/${loopSubscriptionId}`,
          loopToken,
          'GET'
        );
        if (!resumeSubResult.response.ok) {
          console.error('[RESUME-NOW] Resume succeeded but failed to fetch subscription for reschedule:', JSON.stringify(resumeSubResult.data));
          // Resume worked — return success with a note that reschedule didn't happen
          return NextResponse.json({
            success: true,
            message: 'Subscription resumed. You can reschedule your next delivery from your subscriptions page.',
          });
        }

        const resumeLoopInternalId = resumeSubResult.data?.data?.id;
        if (resumeLoopInternalId == null || !resumeNowEpoch) {
          // Can't reschedule without internal ID or target date — still a successful resume
          return NextResponse.json({
            success: true,
            message: 'Subscription resumed. You can reschedule your next delivery from your subscriptions page.',
          });
        }

        // Step 3: Reschedule to the requested date
        console.log(`[RESUME-NOW] Rescheduling to epoch ${resumeNowEpoch} using Loop internal ID: ${resumeLoopInternalId}`);
        const rescheduleResult = await loopRequest(
          `/subscription/${resumeLoopInternalId}/reschedule`,
          loopToken,
          'POST',
          {
            newBillingDateEpoch: resumeNowEpoch,
            rescheduleFutureOrders: true,
            notifyCustomer: true,
          }
        );

        if (!rescheduleResult.response.ok) {
          console.error('[RESUME-NOW] Resume succeeded but reschedule failed:', JSON.stringify(rescheduleResult.data));
          return NextResponse.json({
            success: true,
            message: 'Subscription resumed. We couldn\'t adjust the delivery date automatically — you can reschedule from your subscriptions page.',
          });
        }

        console.log('[RESUME-NOW] Resume + reschedule success');
        successMessage = 'Subscription resumed — your next delivery is on the way!';
        break;
      }

      case 'cancel':
        // Loop API: POST /subscription/{id}/cancel
        // Loop accepts `comment` (not cancellationReason) for the customer's reason
        result = await loopRequest(`/subscription/${loopSubscriptionId}/cancel`, loopToken, 'POST', {
          comment: reason || undefined,
          notifyCustomer: true,
        });
        successMessage = 'Subscription cancelled successfully';
        break;

      case 'skip': {
        // Loop API: POST /subscription/{loopInternalId}/skipNext
        // https://developer.loopwork.co/reference/skip-next-order
        // skipNext requires Loop's internal numeric ID, not shopify-{id}
        const skipSubResult = await loopRequest(
          `/subscription/${loopSubscriptionId}`,
          loopToken,
          'GET'
        );
        if (!skipSubResult.response.ok) {
          console.error('[SKIP] Failed to fetch subscription:', JSON.stringify(skipSubResult.data));
          return NextResponse.json({
            success: false,
            error: 'Unable to skip this order right now. Please try again or contact support.',
          }, { status: 502 });
        }
        const skipLoopInternalId = skipSubResult.data?.data?.id;
        if (skipLoopInternalId == null) {
          return NextResponse.json({
            success: false,
            error: 'Could not resolve Loop subscription ID',
          }, { status: 500 });
        }
        console.log(`[SKIP] Using Loop internal ID: ${skipLoopInternalId}`);
        result = await loopRequest(
          `/subscription/${skipLoopInternalId}/skipNext`,
          loopToken,
          'POST'
        );
        successMessage = 'Next delivery skipped successfully';
        break;
      }

      case 'change-frequency':
        if (!plan || !PLAN_CONFIGURATIONS[plan]) {
          return NextResponse.json({
            success: false,
            error: 'Invalid plan. Must be one of: starter, pro, max',
          }, { status: 400 });
        }

        const planConfig = PLAN_CONFIGURATIONS[plan];
        
        // Log prefix for Vercel log tracing (Fix 4)
        const logPrefix = `[Loop plan-update][${loopSubscriptionId}]`;
        
        // Step 1: Fetch subscription details from Loop to get lineId and current variant
        console.log(`${logPrefix} Step 1: GET subscription`);
        const subDetailsResult = await loopRequest(
          `/subscription/${loopSubscriptionId}`,
          loopToken,
          'GET'
        );
        
        if (!subDetailsResult.response.ok) {
          console.error(`${logPrefix} Failed to fetch subscription:`, JSON.stringify(subDetailsResult.data));
          return NextResponse.json({
            success: false,
            error: 'Unable to update your plan right now. Please try again or contact support.',
          }, { status: 502 });
        }

        const subscriptionData = subDetailsResult.data.data;
        const lines = subscriptionData?.lines || [];

        // Loop's internal numeric ID — required for PUT /frequency (not the shopify-{id} format)
        const loopInternalId = subscriptionData?.id;
        
        if (lines.length > 1) {
          // Multi-line subscriptions have one shared billing frequency at contract level.
          // Swapping one line and then changing frequency can fail if the other line's
          // selling plan group doesn't support the target interval.
          // For now, return a clear error rather than partially updating.
          return NextResponse.json({
            success: false,
            multiLine: true,
            error: `This subscription contains multiple products. Please contact support at ${SUPPORT_EMAIL} to change your plan — we'll make sure both items are updated correctly.`,
          }, { status: 422 });
        }
        
        if (lines.length === 0) {
          return NextResponse.json({
            success: false,
            error: 'No lines found in subscription',
          }, { status: 400 });
        }
        
        // Get the first line (main subscription item)
        const line = lines[0];
        const lineId = line.id;
        const currentVariantId = line.variantShopifyId || line.variant?.shopifyId;
        
        console.log(`${logPrefix} Current line:`, { lineId, currentVariantId });
        
        // Step 2: Determine target protocol
        // If protocolId is provided, use it (user may be switching protocol or tier)
        // Otherwise, infer from current variant (tier-only change)
        const currentProtocolFromVariant = VARIANT_TO_PROTOCOL[currentVariantId] as ProtocolIdType | undefined;
        const targetProtocolId = protocolId ?? currentProtocolFromVariant;
        if (!targetProtocolId) {
          console.log(`${logPrefix} Unknown variant, fallback: POST change-plan`, { sellingPlanId: planConfig.sellingPlanId });
          // If we can't identify the protocol, try the change-plan endpoint as fallback
          result = await loopRequest(
            `/subscription/${loopSubscriptionId}/change-plan`, 
            loopToken, 
            'POST',
            { sellingPlanId: planConfig.sellingPlanId }
          );
        } else {
          // Step 3: Get the target variant for the new tier of this protocol
          const protocolVariants = PROTOCOL_VARIANTS[targetProtocolId];
          
          if (!protocolVariants) {
            return NextResponse.json({
              success: false,
              error: `Invalid protocol: ${targetProtocolId}`,
            }, { status: 400 });
          }
          
          const targetVariantId = protocolVariants[plan];
          
          if (!targetVariantId) {
            return NextResponse.json({
              success: false,
              error: `Protocol ${targetProtocolId} doesn't support ${plan} tier`,
            }, { status: 400 });
          }
          
          // Use sellingPlanGroupId (not sellingPlanId) — Loop swap expects the group ID
          const sellingPlanGroupIdSent = parseInt(planConfig.sellingPlanGroupId, 10);
          console.log(`${logPrefix} sellingPlanGroupId sent:`, sellingPlanGroupIdSent);
          
          console.log(`${logPrefix} Step 2: PUT swap line`, { targetVariantId, plan });
          // Step 4: Call swap-line endpoint to change the variant AND selling plan
          result = await loopRequest(
            `/subscription/${loopSubscriptionId}/line/${lineId}/swap`,
            loopToken,
            'PUT',
            {
              variantShopifyId: targetVariantId,
              quantity: planConfig.quantity,
              pricingType: 'OLD', // Keep existing discount
              sellingPlanGroupId: sellingPlanGroupIdSent,
            }
          );
          // Step 5: If swap succeeded, update billing/delivery interval (required for correct billing).
          // Uses PUT /subscription/{loopInternalId}/frequency with Loop's internal ID (not shopify-{id}).
          // If this fails, we do NOT return success — subscription may be in a partial state.
          if (result.response.ok && loopInternalId != null) {
            const intervalUnit = planConfig.interval;
            const intervalCount = planConfig.intervalCount;
            const nextBillingDateRaw = subscriptionData?.nextBillingDate;
            const nextBillingDateEpoch = nextBillingDateRaw
              ? Math.floor(new Date(nextBillingDateRaw).getTime() / 1000)
              : Math.floor(Date.now() / 1000) + 86400; // fallback: tomorrow
            
            console.log(`${logPrefix} Step 3: PUT frequency using Loop internal ID:`, loopInternalId);
            const freqResult = await loopRequest(
              `/subscription/${loopInternalId}/frequency`,
              loopToken,
              'PUT',
              {
                billingPolicy: { interval: intervalUnit, intervalCount },
                deliveryPolicy: { interval: intervalUnit, intervalCount },
                nextBillingDateEpoch,
                discountType: 'OLD',
              }
            );
            if (!freqResult.response.ok) {
              console.error(`${logPrefix} Swap succeeded but PUT frequency failed. Full error:`, JSON.stringify(freqResult.data));
              return NextResponse.json(
                {
                  success: false,
                  partial: true,
                  error: 'Your product was updated but we could not update your billing schedule. Please contact support so we can fix this for you.',
                },
                { status: 503 }
              );
            }
            console.log(`${logPrefix} PUT frequency OK`);
          } else if (result.response.ok && loopInternalId == null) {
            console.error(`${logPrefix} Swap succeeded but Loop internal ID missing from GET response; cannot call PUT frequency`);
            return NextResponse.json(
              {
                success: false,
                partial: true,
                error: 'Your product was updated but we could not update your billing schedule. Please contact support so we can fix this for you.',
              },
              { status: 503 }
            );
          }
        }
        
        successMessage = `Plan updated to ${planConfig.name} successfully`;
        break;

      case 'edit-multi-line': {
        const lineEdits = body.lines || [];
        const newPlan = body.plan;

        if (!lineEdits.length && !newPlan) {
          return NextResponse.json({ success: false, error: 'No changes provided' }, { status: 400 });
        }

        // Step 1: GET subscription to get Loop internal ID and current billing policy
        const subDetailsResult = await loopRequest(`/subscription/${loopSubscriptionId}`, loopToken, 'GET');
        if (!subDetailsResult.response.ok) {
          console.error(`[Loop edit-multi-line][${loopSubscriptionId}] Failed to fetch subscription:`, JSON.stringify(subDetailsResult.data));
          return NextResponse.json({ success: false, error: 'Unable to update your subscription right now. Please try again or contact support.' }, { status: 502 });
        }

        const subscriptionData = subDetailsResult.data.data;
        const loopInternalId = subscriptionData?.id;

        // Step 2: Determine target plan (requested or inferred from current billing policy)
        let targetPlan: PlanType;
        if (newPlan && PLAN_CONFIGURATIONS[newPlan]) {
          targetPlan = newPlan;
        } else {
          const bi = subscriptionData?.billingPolicy?.interval;
          const bc = subscriptionData?.billingPolicy?.intervalCount;
          if (bi === 'MONTH') targetPlan = 'max';
          else if (bi === 'WEEK' && bc === 1) targetPlan = 'starter';
          else if (bi === 'DAY' && bc <= 7) targetPlan = 'starter';
          else targetPlan = 'pro';
        }

        const planConfig = PLAN_CONFIGURATIONS[targetPlan];
        const sellingPlanGroupIdSent = parseInt(planConfig.sellingPlanGroupId, 10);
        const logPrefix = `[Loop edit-multi-line][${loopSubscriptionId}]`;

        // Step 3: Swap each line
        for (const lineEdit of lineEdits) {
          const { lineId, productKey, size } = lineEdit;
          const tierKey = sizeToTierKey(String(productKey), Number(size));
          const productVariants = PROTOCOL_VARIANTS[String(productKey)];

          if (!productVariants) {
            return NextResponse.json({
              success: false,
              error: `Unknown product: ${productKey}`,
            }, { status: 400 });
          }

          const variantShopifyId = productVariants[tierKey];
          if (!variantShopifyId) {
            return NextResponse.json({
              success: false,
              error: `No variant found for product ${productKey} size ${size}`,
            }, { status: 400 });
          }

          console.log(`${logPrefix} Swapping line ${lineId}: product=${productKey} size=${size} variant=${variantShopifyId}`);

          const swapResult = await loopRequest(
            `/subscription/${loopSubscriptionId}/line/${lineId}/swap`,
            loopToken,
            'PUT',
            {
              variantShopifyId,
              quantity: 1,
              pricingType: 'OLD',
              sellingPlanGroupId: sellingPlanGroupIdSent,
            }
          );

          if (!swapResult.response.ok) {
            console.error(`${logPrefix} Swap failed for line ${lineId}:`, JSON.stringify(swapResult.data));
            return NextResponse.json({
              success: false,
              error: 'We couldn\'t update one of your products. Please try again or contact support.',
            }, { status: 502 });
          }
        }

        // Step 4: Only update frequency if the interval is actually changing.
        // If the subscription already has the target interval, skip the PUT frequency call —
        // Loop rejects redundant frequency updates on multi-line contracts.
        const currentInterval = subscriptionData?.billingPolicy?.interval;
        const currentIntervalCount = subscriptionData?.billingPolicy?.intervalCount;
        const intervalNeedsUpdate =
          currentInterval !== planConfig.interval ||
          currentIntervalCount !== planConfig.intervalCount;

        if (intervalNeedsUpdate && loopInternalId != null) {
          const nextBillingDateRaw = subscriptionData?.nextBillingDate;
          const nextBillingDateEpoch = nextBillingDateRaw
            ? Math.floor(new Date(nextBillingDateRaw).getTime() / 1000)
            : Math.floor(Date.now() / 1000) + 86400;

          console.log(`${logPrefix} PUT frequency using Loop internal ID:`, loopInternalId);
          const freqResult = await loopRequest(
            `/subscription/${loopInternalId}/frequency`,
            loopToken,
            'PUT',
            {
              billingPolicy: { interval: planConfig.interval, intervalCount: planConfig.intervalCount },
              deliveryPolicy: { interval: planConfig.interval, intervalCount: planConfig.intervalCount },
              nextBillingDateEpoch,
              discountType: 'OLD',
            }
          );

          if (!freqResult.response.ok) {
            console.error(`${logPrefix} PUT frequency failed:`, JSON.stringify(freqResult.data));
            return NextResponse.json({
              success: false,
              partial: true,
              error: 'Products updated but billing schedule could not be updated. Please contact support.',
            }, { status: 503 });
          }
          console.log(`${logPrefix} PUT frequency OK`);
        } else {
          console.log(`${logPrefix} Skipping PUT frequency — interval unchanged (${currentInterval} × ${currentIntervalCount})`);
        }

        return NextResponse.json({
          success: true,
          message: `Subscription updated successfully`,
        });
      }

      case 'reactivate': {
        // Loop API: POST /subscription/{loopInternalId}/reactivate
        // Reactivates a cancelled subscription. Requires Loop's internal numeric ID.
        const reactivateSubResult = await loopRequest(
          `/subscription/${loopSubscriptionId}`,
          loopToken,
          'GET'
        );
        if (!reactivateSubResult.response.ok) {
          console.error('[REACTIVATE] Failed to fetch subscription:', JSON.stringify(reactivateSubResult.data));
          return NextResponse.json({
            success: false,
            error: 'Unable to reactivate this subscription right now. Please try again or contact support.',
          }, { status: 502 });
        }
        const reactivateLoopInternalId = reactivateSubResult.data?.data?.id;
        if (reactivateLoopInternalId == null) {
          return NextResponse.json({
            success: false,
            error: 'Could not resolve subscription ID. Please contact support.',
          }, { status: 500 });
        }
        console.log(`[REACTIVATE] Using Loop internal ID: ${reactivateLoopInternalId}`);
        result = await loopRequest(
          `/subscription/${reactivateLoopInternalId}/reactivate`,
          loopToken,
          'POST'
        );
        successMessage = 'Subscription reactivated! Your deliveries will resume on their original schedule.';
        break;
      }

      case 'apply-discount': {
        // Loop Admin API: POST /subscription/{loopInternalId}/discount
        // Applies a Shopify discount code to the subscription.
        const code = body.discountCode?.trim();
        if (!code) {
          return NextResponse.json({
            success: false,
            error: 'Please enter a discount code.',
          }, { status: 400 });
        }

        const discountSubResult = await loopRequest(
          `/subscription/${loopSubscriptionId}`,
          loopToken,
          'GET'
        );
        if (!discountSubResult.response.ok) {
          console.error('[APPLY-DISCOUNT] Failed to fetch subscription:', JSON.stringify(discountSubResult.data));
          return NextResponse.json({
            success: false,
            error: 'Unable to apply discount right now. Please try again or contact support.',
          }, { status: 502 });
        }
        const discountLoopInternalId = discountSubResult.data?.data?.id;
        if (discountLoopInternalId == null) {
          return NextResponse.json({
            success: false,
            error: 'Could not resolve subscription ID. Please contact support.',
          }, { status: 500 });
        }
        console.log(`[APPLY-DISCOUNT] Using Loop internal ID: ${discountLoopInternalId}, code: ${code}`);
        result = await loopRequest(
          `/subscription/${discountLoopInternalId}/discount`,
          loopToken,
          'POST',
          { code }
        );
        successMessage = 'Discount code applied!';
        break;
      }

      case 'place-order': {
        // Loop API: POST /subscription/{loopInternalId}/placeOrder
        // Places an immediate order. Requires Loop's internal numeric ID.
        const placeOrderSubResult = await loopRequest(
          `/subscription/${loopSubscriptionId}`,
          loopToken,
          'GET'
        );
        if (!placeOrderSubResult.response.ok) {
          console.error('[PLACE-ORDER] Failed to fetch subscription:', JSON.stringify(placeOrderSubResult.data));
          return NextResponse.json({
            success: false,
            error: 'Unable to place an order right now. Please try again or contact support.',
          }, { status: 502 });
        }
        const placeOrderLoopInternalId = placeOrderSubResult.data?.data?.id;
        if (placeOrderLoopInternalId == null) {
          return NextResponse.json({
            success: false,
            error: 'Could not resolve subscription ID. Please contact support.',
          }, { status: 500 });
        }
        console.log(`[PLACE-ORDER] Using Loop internal ID: ${placeOrderLoopInternalId}`);
        result = await loopRequest(
          `/subscription/${placeOrderLoopInternalId}/placeOrder`,
          loopToken,
          'POST',
          { preponeFutureOrder: true }
        );
        successMessage = 'Order placed! Your delivery is on the way.';
        break;
      }

      case 'swap-product': {
        // Same-cadence funnel product swap (Flow / Clear / Both). Every funnel
        // product is a SINGLE variant (Both = BOTH-FUNNEL-56/140, not two lines),
        // so this is a single-line variant swap. Cadence never changes, so there
        // is no /frequency call. Legacy PROTOCOL_VARIANTS path is untouched.
        const target = body.targetProduct;
        if (!target || !['flow', 'clear', 'both'].includes(target)) {
          return NextResponse.json({
            success: false,
            error: 'Invalid swap target.',
          }, { status: 400 });
        }

        // Dev mock: no Loop call — echo success so the flow is testable locally.
        const isDevMock =
          process.env.NODE_ENV === 'development' &&
          process.env.DEV_MOCK_AUTH === 'true' &&
          cookieStore.get('dev_mock_auth')?.value === '1';
        if (isDevMock) {
          return NextResponse.json({ success: true, message: `Swapped to ${target}.` });
        }

        // Step 1: GET the subscription to resolve the line id + billing cadence.
        const swapSubResult = await loopRequest(`/subscription/${loopSubscriptionId}`, loopToken, 'GET');
        if (!swapSubResult.response.ok) {
          console.error('[SWAP-PRODUCT] Failed to fetch subscription:', JSON.stringify(swapSubResult.data));
          return NextResponse.json({
            success: false,
            error: 'Unable to swap your product right now. Please try again or contact support.',
          }, { status: 502 });
        }
        const swapData = swapSubResult.data?.data;
        const swapLines = swapData?.lines || [];
        if (swapLines.length !== 1) {
          // Funnel products are single-line; a multi-line contract is legacy.
          return NextResponse.json({
            success: false,
            multiLine: true,
            error: `This subscription can't be swapped in-account. Please contact support at ${SUPPORT_EMAIL}.`,
          }, { status: 422 });
        }
        const swapLineId = swapLines[0].id;

        // Cadence from the billing policy (funnel subs are monthly or quarterly).
        const billing = swapData?.billingPolicy || {};
        const bInterval = String(billing.interval || '').toUpperCase();
        const bCount = billing.intervalCount ?? 1;
        const cadence =
          bInterval === 'MONTH' && bCount === 1
            ? 'monthly-sub'
            : bInterval === 'MONTH' && bCount === 3
              ? 'quarterly-sub'
              : null;
        if (!cadence) {
          return NextResponse.json({
            success: false,
            error: `This subscription's billing cycle isn't eligible for in-account swaps. Please contact support at ${SUPPORT_EMAIL}.`,
          }, { status: 422 });
        }

        const targetVariantId = getFunnelVariantNumericId(target, cadence);
        const targetGroupId = getFunnelSwapGroupId(target, cadence);
        if (!targetVariantId) {
          return NextResponse.json({
            success: false,
            error: 'That product is not available on your current plan.',
          }, { status: 400 });
        }
        if (!targetGroupId) {
          // Selling-plan group ids not configured yet (SCRUM-1200 data dependency).
          console.error(`[SWAP-PRODUCT] Missing selling-plan group id for ${target}/${cadence}`);
          return NextResponse.json({
            success: false,
            error: 'Product swaps are not available yet. Please contact support.',
          }, { status: 503 });
        }

        console.log(`[SWAP-PRODUCT] ${loopSubscriptionId} line ${swapLineId} -> ${target}/${cadence} variant ${targetVariantId} group ${targetGroupId}`);
        // Single swap call: change the line's variant + selling-plan group. No
        // frequency update — the cadence is unchanged. pricingType 'OLD' preserves
        // any active discount; the base price follows the new variant.
        result = await loopRequest(
          `/subscription/${loopSubscriptionId}/line/${swapLineId}/swap`,
          loopToken,
          'PUT',
          {
            variantShopifyId: parseInt(targetVariantId, 10),
            quantity: 1,
            pricingType: 'OLD',
            sellingPlanGroupId: parseInt(targetGroupId, 10),
          },
        );
        successMessage = 'Product swapped. Your next delivery reflects the change.';
        break;
      }

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
        }, { status: 400 });
    }

    console.log(`[${action.toUpperCase()}] Loop API response:`, { 
      status: result.response.status, 
      data: result.data 
    });

    if (!result.response.ok) {
      // Log full Loop response server-side for debugging, but don't expose to client
      console.error(`[${action.toUpperCase()}] Loop API error:`, JSON.stringify(result.data));

      // Map action to user-friendly error messages
      const userErrors: Record<string, string> = {
        pause: 'Unable to pause your subscription right now. Please try again or contact support.',
        resume: 'Unable to resume your subscription right now. Please try again or contact support.',
        'resume-now': 'Unable to resume your subscription right now. Please try again or contact support.',
        cancel: 'Unable to cancel your subscription right now. Please try again or contact support.',
        skip: 'Unable to skip your next order right now. Please try again or contact support.',
        'change-frequency': 'Unable to update your plan right now. Please try again or contact support.',
        'reactivate': 'Unable to reactivate your subscription right now. The product may no longer be available — please contact support or start a new subscription.',
        'place-order': 'Unable to place an order right now. Please try again or contact support.',
        'apply-discount': 'This discount code is invalid or cannot be applied to this subscription.',
      };

      return NextResponse.json({
        success: false,
        error: userErrors[action] || 'Something went wrong. Please try again or contact support.',
      }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      message: successMessage,
    });

  } catch (error) {
    console.error(`[${action.toUpperCase()}] Unexpected error:`, error);
    return NextResponse.json({
      success: false,
      error: 'Something went wrong. Please try again or contact support.',
    }, { status: 500 });
  }
}
