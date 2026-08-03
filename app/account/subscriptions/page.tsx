"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/app/components/navigation";
import { AccountSubNav } from "@/app/components/account/AccountSubNav";
import { useAuth } from "@/app/context/AuthContext";
import { useSubscriptions, Subscription } from "@/app/hooks/useSubscriptions";
import { SubscriptionsPageHeader } from "@/app/components/subscriptions/SubscriptionsPageHeader";
import { SubscriptionSummaryStats } from "@/app/components/subscriptions/SubscriptionSummaryStats";
import { EmptySubscriptionsState } from "@/app/components/subscriptions/EmptySubscriptionsState";
import { SubscriptionListCard } from "@/app/components/subscriptions/SubscriptionListCard";
import { PastSubscriptionCard } from "@/app/components/subscriptions/PastSubscriptionCard";
import { ReactivateModal } from "@/app/components/subscriptions/ReactivateModal";
import { SubscriptionsHelpCard } from "@/app/components/subscriptions/SubscriptionsHelpCard";

export default function SubscriptionsPage() {
  const router = useRouter();
  const { customer, isAuthenticated, loading: authLoading } = useAuth();
  const { subscriptions, loading, error, fetchSubscriptions, reactivateSubscription } =
    useSubscriptions();

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showReactivateModal, setShowReactivateModal] = useState<Subscription | null>(null);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/account/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (customer) {
      fetchSubscriptions().then(() => setInitialFetchDone(true));
    }
  }, [customer, fetchSubscriptions]);

  const handleReactivateFromModal = async (): Promise<boolean> => {
    if (!showReactivateModal) return false;
    setActionLoading(showReactivateModal.id);
    const success = await reactivateSubscription(showReactivateModal.id);
    if (success) await fetchSubscriptions();
    setActionLoading(null);
    return success;
  };

  if (authLoading || (!initialFetchDone && loading)) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-black/15 border-t-black/50 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-black/60">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active" || s.status === "paused",
  );
  const inactiveSubscriptions = subscriptions.filter(
    (s) => s.status === "cancelled" || s.status === "expired",
  );
  const activeOnly = activeSubscriptions.filter((s) => s.status === "active");
  const pausedOnly = activeSubscriptions.filter((s) => s.status === "paused");
  const nextDeliveryFormatted = (() => {
    if (!activeOnly.length) return null;
    const dates = activeOnly
      .map((s) => new Date(s.nextBillingDate))
      .filter((d) => !isNaN(d.getTime()));
    if (!dates.length) return null;
    return new Date(Math.min(...dates.map((d) => d.getTime()))).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  })();
  const headerSubtitle =
    activeSubscriptions.length === 0
      ? "No active subscriptions"
      : [
          `${activeOnly.length} active`,
          pausedOnly.length > 0 ? `${pausedOnly.length} paused` : null,
          nextDeliveryFormatted ? `next renewal ${nextDeliveryFormatted}` : null,
        ]
          .filter(Boolean)
          .join(" · ");

  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />
      <AccountSubNav />

      <main className="pt-3 pb-24 lg:pt-4">
        <section className="brand-section brand-bg-white" aria-labelledby="subscriptions-heading">
          <div className="brand-track">
            <SubscriptionsPageHeader subtitle={headerSubtitle} />

            {subscriptions.length > 0 && (
              <SubscriptionSummaryStats
                activeCount={activeOnly.length}
                pausedCount={pausedOnly.length}
                pastCount={inactiveSubscriptions.length}
              />
            )}

            {error && (
              <div className="border border-red-200 bg-red-50/50 rounded-md p-6 mb-8">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {subscriptions.length === 0 ? (
              <EmptySubscriptionsState />
            ) : (
              <div className="space-y-6">
                {activeSubscriptions.length > 0 ? (
                  <div>
                    <h2 className="text-sm font-medium text-black/50 tabular-nums mb-6">
                      {activeSubscriptions.length === 1
                        ? "Active & paused"
                        : `Active & paused (${activeSubscriptions.length} subscriptions)`}
                    </h2>
                    <div className="space-y-4">
                      {activeSubscriptions.map((subscription) => (
                        <SubscriptionListCard key={subscription.id} subscription={subscription} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <EmptySubscriptionsState />
                )}

                {inactiveSubscriptions.length > 0 && (
                  <div className="mt-10">
                    <h2 className="text-sm font-medium text-black/50 tabular-nums mb-6">
                      Past subscriptions
                    </h2>
                    <div className="space-y-4">
                      {inactiveSubscriptions.map((subscription) => (
                        <PastSubscriptionCard
                          key={subscription.id}
                          subscription={subscription}
                          onReactivate={() => setShowReactivateModal(subscription)}
                          isActionLoading={actionLoading === subscription.id}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <SubscriptionsHelpCard />
          </div>
        </section>
      </main>

      <ReactivateModal
        isOpen={!!showReactivateModal}
        onClose={() => setShowReactivateModal(null)}
        onReactivate={handleReactivateFromModal}
        subscriptionName={showReactivateModal?.product.title || "Subscription"}
      />
    </div>
  );
}
