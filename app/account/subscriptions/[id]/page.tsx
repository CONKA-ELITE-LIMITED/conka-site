"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Navigation from "@/app/components/navigation";
import { AccountSubNav } from "@/app/components/account/AccountSubNav";
import { ContactSupportLink } from "@/app/components/ContactSupportLink";
import { useAuth } from "@/app/context/AuthContext";
import { useSubscriptions, Subscription } from "@/app/hooks/useSubscriptions";
import { usePaymentMethods } from "@/app/hooks/usePaymentMethods";
import { PaymentCardSection } from "@/app/components/subscriptions/PaymentCardSection";
import { CancellationModal } from "@/app/components/subscriptions/CancellationModal";
import { PauseModal } from "@/app/components/subscriptions/PauseModal";
import { RescheduleModal } from "@/app/components/subscriptions/RescheduleModal";
import { ResumeModal } from "@/app/components/subscriptions/ResumeModal";
import { EditSubscriptionModal } from "@/app/components/subscriptions/EditSubscriptionModal";
import { MultiLineEditModal } from "@/app/components/subscriptions/MultiLineEditModal";
import { ReactivateModal } from "@/app/components/subscriptions/ReactivateModal";
import { PlaceOrderModal } from "@/app/components/subscriptions/PlaceOrderModal";
import {
  formatDate,
  getStatusColor,
  getProtocolFromSubscription,
  getCurrentPlan,
  getSubscriptionType,
  getCurrentFormulaId,
  getCurrentPackSizeForFormula,
} from "@/app/account/subscriptions/utils";
import { subscriptionRouteId, toDtcSubscriptionView } from "@/app/account/subscriptions/viewModel";
import { getUpsellOffer } from "@/app/lib/funnelData";

/** Section wrapper: label + rounded surface, consistent across the detail view. */
function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-label={title} className="space-y-3">
      <h2 className="text-sm font-medium text-black/50">{title}</h2>
      {children}
    </section>
  );
}

export default function SubscriptionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const routeId = String(params?.id ?? "");
  const { customer, isAuthenticated, loading: authLoading } = useAuth();
  const {
    subscriptions,
    loading,
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

  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showReactivate, setShowReactivate] = useState(false);
  const [showPlaceOrder, setShowPlaceOrder] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/account/login");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (customer) fetchSubscriptions().then(() => setInitialFetchDone(true));
  }, [customer, fetchSubscriptions]);

  const subscription = useMemo<Subscription | undefined>(
    () => subscriptions.find((s) => subscriptionRouteId(s.id) === routeId),
    [subscriptions, routeId],
  );
  const view = useMemo(
    () => (subscription ? toDtcSubscriptionView(subscription) : null),
    [subscription],
  );
  const upsell = useMemo(
    () =>
      view?.funnelProduct && view.funnelCadence
        ? getUpsellOffer(view.funnelProduct, view.funnelCadence)
        : null,
    [view],
  );

  const flash = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 5000);
  };

  const withAction = async (fn: () => Promise<boolean>, message: string) => {
    setActionLoading(true);
    const ok = await fn();
    if (ok) {
      await fetchSubscriptions();
      flash(message);
    }
    setActionLoading(false);
    return ok;
  };

  if (authLoading || (!initialFetchDone && loading)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border border-black/15 border-t-black/50 rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return null;

  if (!subscription || !view) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Navigation />
        <AccountSubNav />
        <main className="pt-3 pb-24 lg:pt-4">
          <section className="brand-section brand-bg-white">
            <div className="brand-track">
              <p className="text-sm text-black/60 mb-4">
                We could not find that subscription.
              </p>
              <Link
                href="/account/subscriptions"
                className="text-[13px] font-semibold text-[var(--brand-navy)] hover:underline"
              >
                ← Back to subscriptions
              </Link>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const isActive = view.status === "active";
  const isPaused = view.status === "paused";
  const isPast = view.status === "cancelled" || view.status === "expired";
  const statusLabel = view.status.charAt(0).toUpperCase() + view.status.slice(1);
  const lineTotal = view.lines.reduce(
    (sum, l) => sum + parseFloat(String(l.price)) * Math.max(1, l.quantity),
    0,
  );
  const subtotal = lineTotal > 0 ? lineTotal : view.price;

  const btnPrimary =
    "rounded-full bg-[var(--brand-navy)] text-white text-[13px] font-semibold px-5 py-2.5 min-h-[44px] hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-opacity";
  const btnGhost =
    "rounded-full border border-black/10 hover:border-black/40 bg-white text-black text-[13px] font-medium px-5 py-2.5 min-h-[44px] disabled:opacity-50 flex items-center gap-2 transition-colors";
  const btnDanger =
    "rounded-full border border-red-400 bg-transparent text-red-600 text-[13px] font-medium px-5 py-2.5 min-h-[44px] hover:bg-red-50/50 disabled:opacity-50 flex items-center gap-2 transition-colors";

  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />
      <AccountSubNav />

      <main className="pt-3 pb-24 lg:pt-4">
        <section className="brand-section brand-bg-white" aria-labelledby="subscription-detail-heading">
          <div className="brand-track max-w-[720px]">
            <Link
              href="/account/subscriptions"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-black/55 hover:text-black transition-colors mb-6"
            >
              ← Subscriptions
            </Link>

            {/* Header */}
            <div className="flex items-start gap-4 mb-8">
              {view.image ? (
                <span className="relative w-20 h-20 shrink-0 overflow-hidden rounded-md bg-[#f5f5f5] border border-black/8">
                  <Image src={view.image} alt="" fill sizes="80px" className="object-cover" />
                </span>
              ) : null}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1
                    id="subscription-detail-heading"
                    className="text-2xl lg:text-3xl font-semibold text-black"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {view.displayName}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full font-mono text-[9px] uppercase tracking-[0.12em] tabular-nums font-semibold ${getStatusColor(
                      view.status,
                    )}`}
                  >
                    {statusLabel}
                  </span>
                </div>
                <p className="text-sm text-black/60 tabular-nums">
                  {view.cadenceLabel} · £{view.price.toFixed(2)}
                  {isActive && view.nextDate ? ` · renews ${formatDate(view.nextDate)}` : ""}
                  {isPaused ? " · paused" : ""}
                </p>
              </div>
            </div>

            {feedback && (
              <div className="rounded-md border border-green-200 bg-green-50/60 p-4 mb-6">
                <p className="text-sm font-medium text-green-800">{feedback}</p>
              </div>
            )}

            {subscription.hasUnfulfilledOrder && isActive && (
              <div className="rounded-md border border-[var(--brand-navy)]/20 bg-[var(--brand-navy)]/5 p-4 mb-6">
                <p className="text-sm font-medium text-[var(--brand-navy)] mb-1">
                  You have an order being prepared
                </p>
                <p className="text-sm text-[var(--brand-navy)]/70">
                  Any plan changes apply to your next delivery. To change a pending order,{" "}
                  <ContactSupportLink variant="inline" icon={false} />.
                </p>
              </div>
            )}

            <div className="space-y-8">
              {/* Products */}
              <DetailSection title="Products">
                <div className="rounded-md border border-black/10 bg-white divide-y divide-black/8">
                  {view.lines.map((line, idx) => (
                    <div key={line.id ?? idx} className="flex items-center justify-between gap-3 p-4">
                      <span className="text-sm text-black min-w-0">
                        {line.productTitle}
                        {line.variantTitle ? (
                          <span className="text-black/55"> · {line.variantTitle}</span>
                        ) : null}
                      </span>
                      <span className="text-sm text-black/70 tabular-nums shrink-0">
                        £{parseFloat(String(line.price)).toFixed(2)}
                        {line.quantity > 1 ? ` × ${line.quantity}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
                {(isActive || isPaused) && (
                  <button
                    type="button"
                    onClick={() => setShowEdit(true)}
                    className={btnGhost}
                    disabled={actionLoading}
                  >
                    Change plan
                  </button>
                )}
              </DetailSection>

              {/* Upsell (read-only) */}
              {upsell && (isActive || isPaused) && (
                <DetailSection title="Try something new">
                  <div className="rounded-md border border-black/10 bg-[#f5f5f5] p-5">
                    <p className="font-semibold text-black mb-1" style={{ letterSpacing: "-0.02em" }}>
                      {upsell.headline}
                    </p>
                    <p className="text-sm text-black/60 mb-3">{upsell.body}</p>
                    {upsell.savingsLabel && (
                      <p className="inline-flex items-center rounded-full bg-[var(--brand-positive)]/10 text-[var(--brand-positive)] text-[13px] font-semibold px-3 py-1 mb-3">
                        {upsell.savingsLabel}
                      </p>
                    )}
                    <p className="text-sm text-black/60">
                      Want to switch?{" "}
                      <ContactSupportLink variant="inline" icon={false}>
                        Message the team
                      </ContactSupportLink>{" "}
                      and we will sort it. In-account switching is coming soon.
                    </p>
                  </div>
                </DetailSection>
              )}

              {/* Shipping */}
              <DetailSection title="Shipping">
                <div className="rounded-md border border-black/10 bg-white p-4">
                  <p className="text-sm text-black">
                    {customer?.firstName || customer?.lastName
                      ? `${customer?.firstName ?? ""} ${customer?.lastName ?? ""}`.trim()
                      : "Your account address"}
                  </p>
                  <p className="text-sm text-black/55 mt-1">
                    Deliveries go to the address saved on your account.
                  </p>
                  <Link
                    href="/account/details"
                    className="inline-block mt-3 text-[13px] font-semibold text-[var(--brand-navy)] hover:underline"
                  >
                    Update address
                  </Link>
                </div>
              </DetailSection>

              {/* Summary */}
              <DetailSection title="Summary">
                <div className="rounded-md border border-black/10 bg-white p-5 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/60">Subtotal</span>
                    <span className="text-black tabular-nums">£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/60">Shipping</span>
                    <span className="text-black tabular-nums">Free</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold border-t border-black/8 pt-2">
                    <span className="text-black">Total</span>
                    <span className="text-black tabular-nums">£{view.price.toFixed(2)}</span>
                  </div>
                  {view.savingsVsOneTime != null && (
                    <p className="inline-flex items-center rounded-full bg-[var(--brand-positive)]/10 text-[var(--brand-positive)] text-[13px] font-semibold px-3 py-1 mt-1">
                      You save £{view.savingsVsOneTime.toFixed(2)} vs buying one-time
                    </p>
                  )}
                </div>
              </DetailSection>

              {/* Billing */}
              <DetailSection title="Billing">
                {(isActive || isPaused) && primaryMethod ? (
                  <PaymentCardSection
                    primaryMethod={primaryMethod}
                    onTriggerUpdateEmail={triggerUpdateEmail}
                    paymentUpdateLoading={paymentUpdateLoading}
                    paymentUpdateMessage={paymentUpdateMessage}
                    paymentCooldownUntil={paymentCooldownUntil}
                  />
                ) : (
                  <div className="rounded-md border border-black/10 bg-white p-4">
                    <p className="text-sm text-black/55">
                      No payment method on file for this subscription.
                    </p>
                  </div>
                )}
              </DetailSection>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                {isActive && (
                  <button onClick={() => setShowPlaceOrder(true)} disabled={actionLoading || subscription.hasUnfulfilledOrder} className={btnGhost}>
                    Order now
                  </button>
                )}
                {isActive && (
                  <button onClick={() => withAction(() => skipNextOrder(subscription.id), "Next order skipped.")} disabled={actionLoading} className={btnGhost}>
                    Skip next order
                  </button>
                )}
                {isActive && (
                  <button onClick={() => setShowReschedule(true)} disabled={actionLoading} className={btnGhost}>
                    Reschedule delivery
                  </button>
                )}
                {(isActive || isPaused) && (
                  <button onClick={() => (isPaused ? setShowResume(true) : setShowPause(true))} disabled={actionLoading} className={btnGhost}>
                    {isPaused ? "Resume subscription" : "Pause subscription"}
                  </button>
                )}
                {(isActive || isPaused) && (
                  <button onClick={() => setShowCancel(true)} disabled={actionLoading} className={btnDanger}>
                    Cancel subscription
                  </button>
                )}
                {isPast && (
                  <button onClick={() => setShowReactivate(true)} disabled={actionLoading} className={btnPrimary}>
                    Reactivate
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      {showEdit && subscription.isMultiLine ? (
        <MultiLineEditModal
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          subscription={subscription}
          onSave={async (lines, plan) => {
            setActionLoading(true);
            const result = await editMultiLine(subscription.id, lines, plan);
            setActionLoading(false);
            if (result.success) {
              setShowEdit(false);
              await fetchSubscriptions();
              flash("Subscription updated.");
            }
            return result;
          }}
          loading={actionLoading}
        />
      ) : (
        <EditSubscriptionModal
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          onSave={async (protocolId, plan) => {
            setActionLoading(true);
            const result = await changePlan(subscription.id, plan, protocolId);
            setActionLoading(false);
            if (result.success) {
              setShowEdit(false);
              await fetchSubscriptions();
              flash("Plan updated.");
            }
            return result;
          }}
          subscriptionName={view.displayName}
          subscriptionId={subscription.id}
          subscriptionType={getSubscriptionType(subscription)}
          currentProtocolId={getProtocolFromSubscription(subscription) || "1"}
          currentTier={getCurrentPlan(subscription)}
          currentFormulaId={getCurrentFormulaId(subscription)}
          currentPackSize={getCurrentPackSizeForFormula(subscription)}
          nextBillingDate={subscription.nextBillingDate}
          loading={actionLoading}
          hasUnfulfilledFirstOrder={subscription.hasUnfulfilledOrder ?? false}
        />
      )}

      <PauseModal
        isOpen={showPause}
        onClose={() => setShowPause(false)}
        onPause={(weeks) => withAction(() => pauseSubscription(subscription.id, weeks), "Subscription paused. You can resume anytime.")}
        subscriptionName={view.displayName}
        interval={subscription.interval}
      />
      <ResumeModal
        isOpen={showResume}
        onClose={() => setShowResume(false)}
        onResume={(resumeNowEpoch) => withAction(() => resumeSubscription(subscription.id, resumeNowEpoch), "Subscription resumed.")}
        subscriptionName={view.displayName}
        currentNextBillingDate={subscription.nextBillingDate}
        interval={subscription.interval}
      />
      <RescheduleModal
        isOpen={showReschedule}
        onClose={() => setShowReschedule(false)}
        onReschedule={(newDateEpoch) => withAction(() => rescheduleSubscription(subscription.id, newDateEpoch), "Delivery rescheduled.")}
        subscriptionName={view.displayName}
        currentNextBillingDate={subscription.nextBillingDate}
        hasUnfulfilledOrder={subscription.hasUnfulfilledOrder}
        interval={subscription.interval}
      />
      <CancellationModal
        isOpen={showCancel}
        onClose={() => setShowCancel(false)}
        onCancel={async (reason) => {
          const ok = await cancelSubscription(subscription.id, reason);
          if (ok) await fetchSubscriptions();
          return ok;
        }}
        subscriptionName={view.displayName}
        currentPlan={getCurrentPlan(subscription)}
        onPauseInstead={() => { setShowCancel(false); setShowPause(true); }}
        onEditInstead={() => { setShowCancel(false); setShowEdit(true); }}
        onApplyDiscount={(code) => applyDiscount(subscription.id, code)}
      />
      <ReactivateModal
        isOpen={showReactivate}
        onClose={() => setShowReactivate(false)}
        onReactivate={() => withAction(() => reactivateSubscription(subscription.id), "Subscription reactivated.")}
        subscriptionName={view.displayName}
      />
      <PlaceOrderModal
        isOpen={showPlaceOrder}
        onClose={() => setShowPlaceOrder(false)}
        onPlaceOrder={() => withAction(() => placeOrderNow(subscription.id), "Order placed. Your delivery is on the way.")}
        subscriptionName={view.displayName}
      />
    </div>
  );
}
