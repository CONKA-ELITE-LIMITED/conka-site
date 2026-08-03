'use client';

import { useState, useCallback } from 'react';
import type { Subscription, SubscriptionInterval } from '@/app/types';

// Re-export Subscription type for backwards compatibility
export type { Subscription } from '@/app/types';

interface ChangePlanResult {
  success: boolean;
  requiresConfirmation?: boolean;
  redirectUrl?: string;
  message?: string;
  /** True when swap succeeded but change-frequency failed; show partial-failure banner. */
  partial?: boolean;
  /** True when subscription has multiple lines; show multi-line contact-support banner. */
  multiLine?: boolean;
}

interface UseSubscriptionsReturn {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  fetchSubscriptions: () => Promise<void>;
  pauseSubscription: (subscriptionId: string, weeks?: number) => Promise<boolean>;
  resumeSubscription: (subscriptionId: string, resumeNowEpoch?: number) => Promise<boolean>;
  cancelSubscription: (subscriptionId: string, reason?: string) => Promise<boolean>;
  skipNextOrder: (subscriptionId: string) => Promise<boolean>;
  reactivateSubscription: (subscriptionId: string) => Promise<boolean>;
  placeOrderNow: (subscriptionId: string) => Promise<boolean>;
  applyDiscount: (subscriptionId: string, code: string) => Promise<{ success: boolean; message: string }>;
  changePlan: (subscriptionId: string, plan: 'starter' | 'pro' | 'max', protocolId?: string) => Promise<ChangePlanResult>;
  editMultiLine: (subscriptionId: string, lines: Array<{ lineId: string | number; productKey: string; size: number }>, plan?: 'starter' | 'pro' | 'max') => Promise<ChangePlanResult>;
  swapProduct: (subscriptionId: string, targetProduct: 'flow' | 'clear' | 'both') => Promise<ChangePlanResult>;
  updateFrequency: (subscriptionId: string, interval: SubscriptionInterval) => Promise<boolean>;
  updateQuantity: (subscriptionId: string, quantity: number) => Promise<boolean>;
  rescheduleSubscription: (subscriptionId: string, newDateEpoch: number) => Promise<boolean>;
  sendPaymentUpdateEmail: (subscriptionId: string, paymentMethodId: number) => Promise<{ success: boolean; message: string }>;
}

/**
 * Extract the numeric Shopify ID from various formats
 * Input formats:
 * - "gid://shopify/SubscriptionContract/126077600118"
 * - "126077600118"
 * Output: "126077600118" (just the numeric part)
 */
function extractShopifyId(subscriptionId: string): string {
  // If it's a GID format, extract the numeric part
  if (subscriptionId.includes('gid://shopify/SubscriptionContract/')) {
    return subscriptionId.split('/').pop() || subscriptionId;
  }
  // If it's already numeric, return as-is
  if (/^\d+$/.test(subscriptionId)) {
    return subscriptionId;
  }
  // Fallback: return the last segment after any /
  const parts = subscriptionId.split('/');
  return parts[parts.length - 1];
}

export function useSubscriptions(): UseSubscriptionsReturn {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscriptions from Shopify Customer Account API
  // Shopify OAuth is used for authentication, returns user's subscriptions
  // Mutations go through Loop Admin API using shopify-{id} format
  const fetchSubscriptions = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/subscriptions', {
        credentials: 'include', // Include cookies for auth
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch subscriptions');
        setSubscriptions([]);
      } else {
        // Transform API response to Subscription type — preserve all fields so multiple subscriptions render correctly
        const transformed = (data.subscriptions || []).map((sub: any) => ({
          id: sub.id,
          customerId: sub.customerId ?? '',
          email: sub.email ?? '',
          status: sub.status as 'active' | 'paused' | 'cancelled' | 'expired',
          nextBillingDate: sub.nextBillingDate || '',
          createdAt: sub.createdAt || '',
          updatedAt: sub.updatedAt || '',
          product: sub.product ? {
            id: sub.product.id || '',
            title: sub.product.title || 'Subscription',
            variantTitle: sub.product.variantTitle,
            image: sub.product.image,
          } : {
            id: '',
            title: 'Subscription',
          },
          price: sub.price ? {
            amount: String(sub.price.amount ?? '0'),
            currencyCode: sub.price.currencyCode || 'GBP',
          } : {
            amount: '0',
            currencyCode: 'GBP',
          },
          quantity: sub.product?.quantity ?? sub.quantity ?? 1,
          interval: sub.interval || { value: 1, unit: 'month' as const },
          lines: sub.lines ?? [],
          isMultiLine: sub.isMultiLine ?? (sub.lines?.length ?? 0) > 1,
          paymentMethodId: sub.paymentMethodId ?? null,
          paymentMethod: sub.paymentMethod ?? null,
          completedOrdersCount: sub.completedOrdersCount ?? null,
          totalOrdersPlaced: sub.totalOrdersPlaced ?? null,
          pendingOrdersCount: sub.pendingOrdersCount ?? null,
          hasUnfulfilledOrder: sub.hasUnfulfilledOrder ?? false,
          unfulfilledOrdersCount: sub.unfulfilledOrdersCount ?? undefined,
          originOrderId: sub.originOrderId ?? null,
        }));
        setSubscriptions(transformed);
      }
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
      setError('Failed to fetch subscriptions');
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Pause subscription - uses the consolidated pause route
  // weeks: optional pause duration in weeks (1-12). If omitted, defaults to 12 weeks (3 months) server-side.
  const pauseSubscription = useCallback(
    async (subscriptionId: string, weeks?: number): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const numericId = extractShopifyId(subscriptionId);
        const response = await fetch(`/api/auth/subscriptions/${numericId}/pause`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'pause', ...(weeks ? { pauseWeeks: weeks } : {}) }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to pause subscription');
          return false;
        }

        // Update local state
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === subscriptionId
              ? { ...sub, status: 'paused' as const }
              : sub
          )
        );

        return true;
      } catch (err) {
        console.error('Failed to pause subscription:', err);
        setError('Failed to pause subscription');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Resume subscription - uses the consolidated pause route with action: 'resume' or 'resume-now'
  // If resumeNowEpoch is provided, uses 'resume-now' to resume and reschedule in one call.
  const resumeSubscription = useCallback(
    async (subscriptionId: string, resumeNowEpoch?: number): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const numericId = extractShopifyId(subscriptionId);
        const action = resumeNowEpoch ? 'resume-now' : 'resume';
        const response = await fetch(`/api/auth/subscriptions/${numericId}/pause`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, ...(resumeNowEpoch ? { resumeNowEpoch } : {}) }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to resume subscription');
          return false;
        }

        // Update local state
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === subscriptionId
              ? { ...sub, status: 'active' as const }
              : sub
          )
        );

        return true;
      } catch (err) {
        console.error('Failed to resume subscription:', err);
        setError('Failed to resume subscription');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Cancel subscription - uses the consolidated pause route with action: 'cancel'
  const cancelSubscription = useCallback(
    async (subscriptionId: string, reason?: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const numericId = extractShopifyId(subscriptionId);
        const response = await fetch(`/api/auth/subscriptions/${numericId}/pause`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'cancel', reason }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to cancel subscription');
          return false;
        }

        // Update local state
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === subscriptionId
              ? { ...sub, status: 'cancelled' as const }
              : sub
          )
        );

        return true;
      } catch (err) {
        console.error('Failed to cancel subscription:', err);
        setError('Failed to cancel subscription');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Skip next order - uses the consolidated pause route with action: 'skip'
  const skipNextOrder = useCallback(
    async (subscriptionId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const numericId = extractShopifyId(subscriptionId);
        const response = await fetch(`/api/auth/subscriptions/${numericId}/pause`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'skip' }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to skip order');
          return false;
        }

        return true;
      } catch (err) {
        console.error('Failed to skip order:', err);
        setError('Failed to skip order');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Reactivate a cancelled subscription — calls consolidated pause route with action: 'reactivate'
  const reactivateSubscription = useCallback(
    async (subscriptionId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const numericId = extractShopifyId(subscriptionId);
        const response = await fetch(`/api/auth/subscriptions/${numericId}/pause`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'reactivate' }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to reactivate subscription');
          return false;
        }

        // Refresh subscriptions to get updated state from Loop
        await fetchSubscriptions();
        return true;
      } catch (err) {
        console.error('Failed to reactivate subscription:', err);
        setError('Failed to reactivate subscription');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchSubscriptions]
  );

  // Place an immediate order for an active subscription
  const placeOrderNow = useCallback(
    async (subscriptionId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const numericId = extractShopifyId(subscriptionId);
        const response = await fetch(`/api/auth/subscriptions/${numericId}/pause`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'place-order' }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to place order');
          return false;
        }

        // Refresh subscriptions to get updated next billing date
        await fetchSubscriptions();
        return true;
      } catch (err) {
        console.error('Failed to place order:', err);
        setError('Failed to place order');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchSubscriptions]
  );

  // Apply a discount code to a subscription
  const applyDiscount = useCallback(
    async (subscriptionId: string, code: string): Promise<{ success: boolean; message: string }> => {
      // Don't set hook-level error/loading — the SubscriptionCard manages its own
      // inline feedback for discount operations to avoid a double-error display.
      try {
        const numericId = extractShopifyId(subscriptionId);
        const response = await fetch(`/api/auth/subscriptions/${numericId}/pause`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'apply-discount', discountCode: code }),
        });

        const data = await response.json();

        if (!response.ok) {
          return { success: false, message: data.error || 'Invalid discount code' };
        }

        // Refresh subscriptions to show updated discount
        await fetchSubscriptions();
        return { success: true, message: data.message || 'Discount applied!' };
      } catch (err) {
        console.error('Failed to apply discount:', err);
        return { success: false, message: 'Failed to apply discount code' };
      }
    },
    [fetchSubscriptions]
  );

  const editMultiLine = useCallback(
    async (
      subscriptionId: string,
      lines: Array<{ lineId: string | number; productKey: string; size: number }>,
      plan?: 'starter' | 'pro' | 'max'
    ): Promise<ChangePlanResult> => {
      setLoading(true);
      setError(null);
      try {
        const numericId = extractShopifyId(subscriptionId);
        const response = await fetch(`/api/auth/subscriptions/${numericId}/pause`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'edit-multi-line',
            lines,
            ...(plan ? { plan } : {}),
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to update subscription');
          return { success: false, message: data.error || 'Failed to update subscription', partial: data.partial };
        }
        await fetchSubscriptions();
        return { success: true, message: data.message };
      } catch (err) {
        console.error('Failed to edit multi-line subscription:', err);
        setError('Failed to update subscription');
        return { success: false, message: 'Failed to update subscription' };
      } finally {
        setLoading(false);
      }
    },
    [fetchSubscriptions]
  );

  // Change subscription plan - uses the consolidated pause route with action: 'change-frequency'
  // Can optionally change to a different protocol by passing protocolId
  const changePlan = useCallback(
    async (subscriptionId: string, plan: 'starter' | 'pro' | 'max', protocolId?: string): Promise<ChangePlanResult> => {
      setLoading(true);
      setError(null);

      try {
        const numericId = extractShopifyId(subscriptionId);
        const response = await fetch(`/api/auth/subscriptions/${numericId}/pause`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'change-frequency', 
            plan,
            ...(protocolId ? { protocolId } : {}),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || data.message || 'Failed to change plan');
          return {
            success: false,
            message: data.error || data.message || 'Failed to change plan',
            partial: data.partial === true,
            multiLine: data.multiLine === true,
          };
        }

        // If subscription was updated successfully
        if (data.success) {
          // Refresh subscriptions to get updated data
          await fetchSubscriptions();
          return { 
            success: true, 
            message: data.message,
          };
        }

        return { success: true, message: data.message };
      } catch (err) {
        console.error('Failed to change plan:', err);
        setError('Failed to change plan');
        return { success: false, message: 'Failed to change plan', partial: false, multiLine: false };
      } finally {
        setLoading(false);
      }
    },
    [fetchSubscriptions]
  );

  // Swap to another funnel product at the SAME cadence (Flow / Clear / Both).
  const swapProduct = useCallback(
    async (subscriptionId: string, targetProduct: 'flow' | 'clear' | 'both'): Promise<ChangePlanResult> => {
      setLoading(true);
      setError(null);
      try {
        const numericId = extractShopifyId(subscriptionId);
        const response = await fetch(`/api/auth/subscriptions/${numericId}/pause`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'swap-product', targetProduct }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          setError(data.error || data.message || 'Failed to swap product');
          return {
            success: false,
            message: data.error || data.message || 'Failed to swap product',
            multiLine: data.multiLine === true,
          };
        }
        await fetchSubscriptions();
        return { success: true, message: data.message };
      } catch (err) {
        console.error('Failed to swap product:', err);
        setError('Failed to swap product');
        return { success: false, message: 'Failed to swap product' };
      } finally {
        setLoading(false);
      }
    },
    [fetchSubscriptions]
  );

  // Update subscription frequency - uses change plan
  const updateFrequency = useCallback(
    async (subscriptionId: string, interval: SubscriptionInterval): Promise<boolean> => {
      // Map interval to plan type
      let plan: 'starter' | 'pro' | 'max' = 'pro';
      if (interval.unit === 'week' && interval.value === 1) {
        plan = 'starter';
      } else if (interval.unit === 'week') {
        plan = 'pro';
      } else if (interval.unit === 'month') {
        plan = 'max';
      } else if (interval.unit === 'day') {
        // Normalise day-based intervals (Loop sometimes returns days instead of weeks)
        if (interval.value <= 7) plan = 'starter';
        else if (interval.value <= 20) plan = 'pro';
        else plan = 'max';
      }
      
      const result = await changePlan(subscriptionId, plan);
      return result.success;
    },
    [changePlan]
  );

  // Update subscription quantity - uses change plan
  const updateQuantity = useCallback(
    async (subscriptionId: string, quantity: number): Promise<boolean> => {
      // Map quantity to plan type
      let plan: 'starter' | 'pro' | 'max' = 'pro';
      if (quantity <= 4) {
        plan = 'starter';
      } else if (quantity <= 12) {
        plan = 'pro';
      } else {
        plan = 'max';
      }
      
      const result = await changePlan(subscriptionId, plan);
      return result.success;
    },
    [changePlan]
  );

  // Reschedule next delivery date — calls dedicated /reschedule route
  const rescheduleSubscription = useCallback(
    async (subscriptionId: string, newDateEpoch: number): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const numericId = extractShopifyId(subscriptionId);
        const response = await fetch(`/api/auth/subscriptions/${numericId}/reschedule`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newBillingDateEpoch: newDateEpoch }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to reschedule delivery');
          return false;
        }

        // Update local state with new billing date
        if (data.nextBillingDate) {
          setSubscriptions((prev) =>
            prev.map((sub) =>
              sub.id === subscriptionId
                ? { ...sub, nextBillingDate: data.nextBillingDate }
                : sub
            )
          );
        }

        return true;
      } catch (err) {
        console.error('Failed to reschedule subscription:', err);
        setError('Failed to reschedule delivery');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const sendPaymentUpdateEmail = useCallback(
    async (
      subscriptionId: string,
      paymentMethodId: number
    ): Promise<{ success: boolean; message: string }> => {
      const id = extractShopifyId(subscriptionId);
      const res = await fetch(`/api/auth/subscriptions/${id}/payment-method`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId }),
      });
      const data = await res.json();
      return {
        success: res.ok && !!data.success,
        message: data.message ?? (data.error ?? ''),
      };
    },
    []
  );

  return {
    subscriptions,
    loading,
    error,
    fetchSubscriptions,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    skipNextOrder,
    reactivateSubscription,
    placeOrderNow,
    applyDiscount,
    editMultiLine,
    changePlan,
    swapProduct,
    updateFrequency,
    updateQuantity,
    rescheduleSubscription,
    sendPaymentUpdateEmail,
  };
}
