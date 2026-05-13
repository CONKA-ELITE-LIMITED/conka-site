"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/app/components/navigation";
import { AccountSubNav } from "@/app/components/account/AccountSubNav";
import { useAuth } from "@/app/context/AuthContext";
import { useSubscriptions, Subscription } from "@/app/hooks/useSubscriptions";
import { usePaymentMethods } from "@/app/hooks/usePaymentMethods";
import { CancellationModal } from "@/app/components/subscriptions/CancellationModal";
import { PauseModal } from "@/app/components/subscriptions/PauseModal";
import { RescheduleModal } from "@/app/components/subscriptions/RescheduleModal";
import { ResumeModal } from "@/app/components/subscriptions/ResumeModal";
import { EditSubscriptionModal } from "@/app/components/subscriptions/EditSubscriptionModal";
import { MultiLineEditModal } from "@/app/components/subscriptions/MultiLineEditModal";
import { SubscriptionsPageHeader } from "@/app/components/subscriptions/SubscriptionsPageHeader";
import { SubscriptionSummaryStats } from "@/app/components/subscriptions/SubscriptionSummaryStats";
import { EmptySubscriptionsState } from "@/app/components/subscriptions/EmptySubscriptionsState";
import { SubscriptionCard } from "@/app/components/subscriptions/SubscriptionCard";
import { PastSubscriptionCard } from "@/app/components/subscriptions/PastSubscriptionCard";
import { ReactivateModal } from "@/app/components/subscriptions/ReactivateModal";
import { PlaceOrderModal } from "@/app/components/subscriptions/PlaceOrderModal";
import { SubscriptionsHelpCard } from "@/app/components/subscriptions/SubscriptionsHelpCard";
import {
  getProtocolFromSubscription,
  getCurrentPlan,
  getTierDisplayInfo,
  getSubscriptionType,
  getCurrentFormulaId,
  getCurrentPackSizeForFormula,
} from "@/app/account/subscriptions/utils";

type SubscriptionTier = "starter" | "pro" | "max";

/** Build a display name for modals — lists all product names for multi-line subscriptions */
function getSubscriptionDisplayName(subscription: Subscription): string {
  if (subscription.isMultiLine && subscription.lines && subscription.lines.length > 1) {
    return subscription.lines.map((line) => line.productTitle).join(' + ');
  }
  return subscription.product.title || "Subscription";
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const { customer, isAuthenticated, loading: authLoading } = useAuth();
  const {
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
    changePlan,
    editMultiLine,
    rescheduleSubscription,
  } = useSubscriptions();

  const {
    primaryMethod,
    triggerUpdateEmail,
    updateLoading: paymentUpdateLoading,
    updateMessage: paymentUpdateMessage,
    cooldownUntil: paymentCooldownUntil,
  } = usePaymentMethods(!!customer);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [showPauseModal, setShowPauseModal] = useState<Subscription | null>(null);
  const [showResumeModal, setShowResumeModal] = useState<Subscription | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState<Subscription | null>(null);
  const [showEditModal, setShowEditModal] = useState<Subscription | null>(null);
  const [showReactivateModal, setShowReactivateModal] = useState<Subscription | null>(null);
  const [showPlaceOrderModal, setShowPlaceOrderModal] = useState<Subscription | null>(null);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [successMessage, setSuccessMessage] = useState<{
    subscriptionId: string;
    message: string;
  } | null>(null);

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

  const handleSkipNext = async (subscription: Subscription) => {
    setActionLoading(subscription.id);
    const success = await skipNextOrder(subscription.id);
    if (success) {
      setSuccessMessage({ subscriptionId: subscription.id, message: "Next order skipped." });
      await fetchSubscriptions();
      setTimeout(() => setSuccessMessage(null), 5000);
    }
    setActionLoading(null);
  };

  const handleTogglePause = async (subscription: Subscription) => {
    if (subscription.status === "paused") {
      // Show resume modal so the user can choose when to restart deliveries
      setShowResumeModal(subscription);
    } else {
      // Show pause duration modal for active subscriptions
      setShowPauseModal(subscription);
    }
  };

  const handleResumeFromModal = async (resumeNowEpoch?: number): Promise<boolean> => {
    if (!showResumeModal) return false;
    setActionLoading(showResumeModal.id);
    const success = await resumeSubscription(showResumeModal.id, resumeNowEpoch);
    if (success) {
      await fetchSubscriptions();
      setSuccessMessage({
        subscriptionId: showResumeModal.id,
        message: resumeNowEpoch
          ? "Subscription resumed — your next delivery is on the way!"
          : "Subscription resumed successfully.",
      });
      setTimeout(() => setSuccessMessage(null), 5000);
    }
    setActionLoading(null);
    return success;
  };

  const handlePauseFromModal = async (weeks: number): Promise<boolean> => {
    if (!showPauseModal) return false;
    setActionLoading(showPauseModal.id);
    const success = await pauseSubscription(showPauseModal.id, weeks);
    if (success) {
      await fetchSubscriptions();
      setSuccessMessage({
        subscriptionId: showPauseModal.id,
        message: "Subscription paused. You can resume anytime.",
      });
      setTimeout(() => setSuccessMessage(null), 5000);
    }
    setActionLoading(null);
    return success;
  };

  const handleRescheduleFromModal = async (newDateEpoch: number): Promise<boolean> => {
    if (!showRescheduleModal) return false;
    setActionLoading(showRescheduleModal.id);
    const success = await rescheduleSubscription(showRescheduleModal.id, newDateEpoch);
    if (success) {
      await fetchSubscriptions();
      setSuccessMessage({
        subscriptionId: showRescheduleModal.id,
        message: "Delivery rescheduled successfully.",
      });
      setTimeout(() => setSuccessMessage(null), 5000);
    }
    setActionLoading(null);
    return success;
  };

  const handleReactivateFromModal = async (): Promise<boolean> => {
    if (!showReactivateModal) return false;
    setActionLoading(showReactivateModal.id);
    const success = await reactivateSubscription(showReactivateModal.id);
    if (success) {
      setSuccessMessage({
        subscriptionId: showReactivateModal.id,
        message: "Subscription reactivated! Your deliveries will resume.",
      });
      setTimeout(() => setSuccessMessage(null), 5000);
    }
    setActionLoading(null);
    return success;
  };

  const handlePlaceOrderFromModal = async (): Promise<boolean> => {
    if (!showPlaceOrderModal) return false;
    setActionLoading(showPlaceOrderModal.id);
    const success = await placeOrderNow(showPlaceOrderModal.id);
    if (success) {
      setSuccessMessage({
        subscriptionId: showPlaceOrderModal.id,
        message: "Order placed! Your delivery is on the way.",
      });
      setTimeout(() => setSuccessMessage(null), 5000);
    }
    setActionLoading(null);
    return success;
  };

  const getTierFromQuantity = (quantity: number): SubscriptionTier => {
    if (quantity >= 28) return "max";
    if (quantity >= 12) return "pro";
    return "starter";
  };

  const handleCancelFromModal = async (
    reason: string,
    _comment?: string
  ): Promise<boolean> => {
    if (!showCancelModal) return false;
    const success = await cancelSubscription(showCancelModal, reason);
    if (success) {
      await fetchSubscriptions();
    }
    return success;
  };

  const handleChangePlan = async (
    protocolId: string,
    plan: "starter" | "pro" | "max"
  ): Promise<{ success: boolean; message?: string }> => {
    if (!showEditModal)
      return { success: false, message: "No subscription selected" };
    const subscriptionId = showEditModal.id;
    setActionLoading(subscriptionId);
    const result = await changePlan(subscriptionId, plan, protocolId);
    setActionLoading(null);

    if (result.success) {
      setShowEditModal(null);
      setSuccessMessage({
        subscriptionId,
        message: "Plan updated successfully!",
      });
      await fetchSubscriptions();
      setTimeout(() => setSuccessMessage(null), 5000);
    }

    return result;
  };

  const handleEditMultiLine = async (
    lines: Array<{ lineId: string | number; productKey: string; size: number }>,
    plan: "starter" | "pro" | "max"
  ): Promise<{ success: boolean; message?: string }> => {
    if (!showEditModal) return { success: false, message: "No subscription selected" };
    const subscriptionId = showEditModal.id;
    setActionLoading(subscriptionId);
    const result = await editMultiLine(subscriptionId, lines, plan);
    setActionLoading(null);
    if (result.success) {
      setShowEditModal(null);
      setSuccessMessage({ subscriptionId, message: "Subscription updated successfully!" });
      setTimeout(() => setSuccessMessage(null), 5000);
    }
    return result;
  };

  if (authLoading || (!initialFetchDone && loading)) {
    return (
      <div className="brand-clinical min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-black/15 border-t-black/50 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-black/60">
            Loading subscriptions...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active" || s.status === "paused"
  );
  const inactiveSubscriptions = subscriptions.filter(
    (s) => s.status === "cancelled" || s.status === "expired"
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
  const headerSubtitle = activeSubscriptions.length === 0
    ? "No active subscriptions"
    : [
        `${activeOnly.length} active`,
        pausedOnly.length > 0 ? `${pausedOnly.length} paused` : null,
        nextDeliveryFormatted ? `next renewal ${nextDeliveryFormatted}` : null,
      ].filter(Boolean).join(" · ");

  return (
    <div className="brand-clinical min-h-screen bg-white text-black">
      <Navigation />
      <AccountSubNav />

      <main className="pt-3 pb-24 lg:pt-4">
        <section
          className="brand-section brand-bg-white"
          aria-labelledby="subscriptions-heading"
        >
          <div className="brand-track">
            <SubscriptionsPageHeader subtitle={headerSubtitle} />

            {subscriptions.length > 0 && (
              <SubscriptionSummaryStats
                activeCount={activeSubscriptions.filter((s) => s.status === "active").length}
                pausedCount={activeSubscriptions.filter((s) => s.status === "paused").length}
                pastCount={inactiveSubscriptions.length}
              />
            )}

            {error && (
              <div className="border border-red-200 bg-red-50/50 p-6 mb-8">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {subscriptions.length === 0 ? (
              <EmptySubscriptionsState />
            ) : (
              <div className="space-y-6">
                {activeSubscriptions.length > 0 ? (
                  <div>
                    <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-6">
                      {activeSubscriptions.length === 1
                        ? "Active & paused"
                        : `Active & paused (${activeSubscriptions.length} subscriptions)`}
                    </h2>
                    <div className="space-y-6">
                      {activeSubscriptions.map((subscription) => (
                        <SubscriptionCard
                          key={subscription.id}
                          subscription={subscription}
                          tierInfo={getTierDisplayInfo(subscription)}
                          successMessage={
                            successMessage?.subscriptionId === subscription.id
                              ? successMessage.message
                              : null
                          }
                          isActionLoading={actionLoading === subscription.id}
                          onEdit={() => setShowEditModal(subscription)}
                          onTogglePause={() => handleTogglePause(subscription)}
                          onSkipNext={() => handleSkipNext(subscription)}
                          onReschedule={() => setShowRescheduleModal(subscription)}
                          onPlaceOrder={() => setShowPlaceOrderModal(subscription)}
                          onApplyDiscount={(code) => applyDiscount(subscription.id, code)}
                          onCancel={() => setShowCancelModal(subscription.id)}
                          onDismissSuccess={() => setSuccessMessage(null)}
                          primaryMethod={primaryMethod}
                          onTriggerUpdateEmail={(id) => triggerUpdateEmail(id)}
                          paymentUpdateLoading={paymentUpdateLoading}
                          paymentUpdateMessage={paymentUpdateMessage}
                          paymentCooldownUntil={paymentCooldownUntil}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <EmptySubscriptionsState />
                )}

                {inactiveSubscriptions.length > 0 && (
                  <div className="mt-10">
                    <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-6">
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

      <PauseModal
        isOpen={!!showPauseModal}
        onClose={() => setShowPauseModal(null)}
        onPause={handlePauseFromModal}
        subscriptionName={showPauseModal ? getSubscriptionDisplayName(showPauseModal) : "Subscription"}
        interval={showPauseModal?.interval}
      />

      <ResumeModal
        isOpen={!!showResumeModal}
        onClose={() => setShowResumeModal(null)}
        onResume={handleResumeFromModal}
        subscriptionName={showResumeModal ? getSubscriptionDisplayName(showResumeModal) : "Subscription"}
        currentNextBillingDate={showResumeModal?.nextBillingDate}
        interval={showResumeModal?.interval}
      />

      <RescheduleModal
        isOpen={!!showRescheduleModal}
        onClose={() => setShowRescheduleModal(null)}
        onReschedule={handleRescheduleFromModal}
        subscriptionName={showRescheduleModal ? getSubscriptionDisplayName(showRescheduleModal) : "Subscription"}
        currentNextBillingDate={showRescheduleModal?.nextBillingDate}
        hasUnfulfilledOrder={showRescheduleModal?.hasUnfulfilledOrder}
        interval={showRescheduleModal?.interval}
      />

      <CancellationModal
        isOpen={!!showCancelModal}
        onClose={() => setShowCancelModal(null)}
        onCancel={handleCancelFromModal}
        subscriptionName={
          (() => {
            const sub = subscriptions.find((s) => s.id === showCancelModal);
            return sub ? getSubscriptionDisplayName(sub) : "Subscription";
          })()
        }
        currentPlan={
          showCancelModal
            ? getTierFromQuantity(
                subscriptions.find((s) => s.id === showCancelModal)?.quantity ??
                  12
              )
            : undefined
        }
        onPauseInstead={() => {
          const sub = subscriptions.find((s) => s.id === showCancelModal);
          if (sub) setShowPauseModal(sub);
        }}
        onEditInstead={() => {
          const sub = subscriptions.find((s) => s.id === showCancelModal);
          if (sub) setShowEditModal(sub);
        }}
        onApplyDiscount={showCancelModal
          ? (code) => applyDiscount(showCancelModal, code)
          : undefined
        }
      />

      <ReactivateModal
        isOpen={!!showReactivateModal}
        onClose={() => setShowReactivateModal(null)}
        onReactivate={handleReactivateFromModal}
        subscriptionName={showReactivateModal ? getSubscriptionDisplayName(showReactivateModal) : "Subscription"}
      />

      <PlaceOrderModal
        isOpen={!!showPlaceOrderModal}
        onClose={() => setShowPlaceOrderModal(null)}
        onPlaceOrder={handlePlaceOrderFromModal}
        subscriptionName={showPlaceOrderModal ? getSubscriptionDisplayName(showPlaceOrderModal) : "Subscription"}
      />

      {showEditModal && showEditModal.isMultiLine ? (
        <MultiLineEditModal
          isOpen={!!showEditModal}
          onClose={() => setShowEditModal(null)}
          subscription={showEditModal}
          onSave={handleEditMultiLine}
          loading={actionLoading === showEditModal?.id}
        />
      ) : (
        <EditSubscriptionModal
          isOpen={!!showEditModal}
          onClose={() => setShowEditModal(null)}
          onSave={handleChangePlan}
          subscriptionName={showEditModal ? getSubscriptionDisplayName(showEditModal) : "Subscription"}
          subscriptionId={showEditModal?.id}
          subscriptionType={showEditModal ? getSubscriptionType(showEditModal) : "protocol"}
          currentProtocolId={showEditModal ? getProtocolFromSubscription(showEditModal) : "1"}
          currentTier={showEditModal ? getCurrentPlan(showEditModal) : "pro"}
          currentFormulaId={showEditModal ? getCurrentFormulaId(showEditModal) : undefined}
          currentPackSize={showEditModal ? getCurrentPackSizeForFormula(showEditModal) : undefined}
          nextBillingDate={showEditModal?.nextBillingDate}
          loading={actionLoading === showEditModal?.id}
          hasUnfulfilledFirstOrder={showEditModal?.hasUnfulfilledOrder ?? false}
        />
      )}
    </div>
  );
}
