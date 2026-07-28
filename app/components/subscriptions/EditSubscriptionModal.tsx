"use client";

import Image from "next/image";
import { ContactSupportLink } from "@/app/components/ContactSupportLink";
import { getProtocolImage, getFormulaImage } from "@/app/lib/productImageConfig";
import {
  PROTOCOLS,
  FORMULAS,
  getTierInfo,
  type TierType,
  type FormulaId,
  type PackSize,
} from "@/app/lib/subscriptionProduct";
import { useSubscriptionEditor } from "@/app/hooks/useSubscriptionEditor";
import { SubscriptionIcon } from "./SubscriptionIcon";
import { ProductSelectorPanel } from "./ProductSelectorPanel";
import { TierSelectorPanel } from "./TierSelectorPanel";
import { PlanPreviewBar } from "./PlanPreviewBar";
import { SaveErrorBanner } from "./SaveErrorBanner";

interface EditSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when user saves a protocol change (Resilience/Precision/Balance/Ultimate + tier) */
  onSave: (
    protocolId: string,
    tier: TierType,
  ) => Promise<{ success: boolean; message?: string; partial?: boolean; multiLine?: boolean }>;
  /** Called when user saves a formula change (Flow/Clear + pack size). Optional until API supports it. */
  onSaveFormula?: (
    formulaId: FormulaId,
    packSize: PackSize,
  ) => Promise<{ success: boolean; message?: string; partial?: boolean; multiLine?: boolean }>;
  /** "protocol" = bundle subscription (can switch Resilience/Precision/Balance); "flow"|"clear" = single formula (can switch Flow/Clear) */
  subscriptionType: "protocol" | "flow" | "clear";
  currentProtocolId?: string;
  currentTier?: TierType;
  /** For formula subscriptions: "01" = Flow, "02" = Clear */
  currentFormulaId?: FormulaId;
  /** For formula subscriptions: 4, 8, 12, or 28 */
  currentPackSize?: PackSize;
  subscriptionName: string;
  /** Optional: subscription contract ID for contact-support email subject */
  subscriptionId?: string;
  nextBillingDate?: string;
  loading?: boolean;
  hasUnfulfilledFirstOrder?: boolean;
}

export function EditSubscriptionModal({
  isOpen,
  onClose,
  onSave,
  onSaveFormula,
  subscriptionType,
  currentProtocolId = "1",
  currentTier = "pro",
  currentFormulaId = "01",
  currentPackSize = 4,
  subscriptionName,
  subscriptionId,
  nextBillingDate,
  loading = false,
  hasUnfulfilledFirstOrder = false,
}: EditSubscriptionModalProps) {
  const isProtocol = subscriptionType === "protocol";

  const {
    selectedProtocol,
    selectedTier,
    selectedFormulaId,
    selectedPackSize,
    error,
    errorPartial,
    errorMultiLine,
    saving,
    mobileStep,
    setSelectedProtocol,
    setSelectedTier,
    setSelectedFormulaId,
    setSelectedPackSize,
    setMobileStep,
    initialProtocolRef,
    initialTierRef,
    initialFormulaRef,
    initialPackRef,
    hasChanges,
    handleSave,
  } = useSubscriptionEditor({
    isOpen,
    isProtocol,
    currentProtocolId,
    currentTier,
    currentFormulaId,
    currentPackSize,
    onSave,
    onSaveFormula,
  });

  const currentTierInfo = getTierInfo(currentProtocolId, currentTier);
  const currentPlanShots = currentTierInfo?.deliveryShots;
  const currentProtocolName = PROTOCOLS.find((p) => p.id === currentProtocolId)?.name;
  const currentFormulaName = FORMULAS.find((f) => f.id === currentFormulaId)?.name;

  const formattedNextBilling = nextBillingDate
    ? new Date(nextBillingDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const supportSubject = `Subscription support: ${subscriptionName}${subscriptionId ? ` (${subscriptionId})` : ""}`;

  const saveLabel = isProtocol
    ? (() => {
        const t = getTierInfo(selectedProtocol, selectedTier);
        const name = PROTOCOLS.find((p) => p.id === selectedProtocol)?.name;
        return t && name ? `Save: ${name} · ${t.deliveryShots} shots per delivery` : "Save changes";
      })()
    : `Save: ${FORMULAS.find((f) => f.id === selectedFormulaId)?.name} · ${selectedPackSize} shots`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal - Desktop */}
      <div className="relative bg-white border border-black/10 rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] w-full max-w-4xl max-h-[90vh] overflow-hidden hidden md:flex flex-col">
        {/* Header */}
        <div className="border-b border-black/8 px-6 py-4">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-xl font-semibold text-black" style={{ letterSpacing: "-0.02em" }}>
              Edit Plan
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#f5f5f5] transition-colors text-black"
            >
              <SubscriptionIcon name="close" className="w-5 h-5" />
            </button>
          </div>
          {/* Current plan visual summary */}
          <div className="flex items-center gap-3 p-3 bg-[#f5f5f5] border border-black/10 rounded-md">
            {isProtocol ? (
              <>
                {getProtocolImage(currentProtocolId) && (
                  <div className="w-12 h-12 flex-shrink-0 overflow-hidden border border-black/8 rounded-md">
                    <Image
                      src={getProtocolImage(currentProtocolId)}
                      alt={currentProtocolName ?? 'Protocol'}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-black/50">Your current plan</p>
                  <p className="font-semibold text-sm text-black">
                    {currentProtocolName ?? 'Protocol'} · {currentPlanShots ?? '–'} shots · {currentTierInfo?.frequency ?? '–'}
                  </p>
                  <p className="text-sm text-black/60">
                    £{currentTierInfo?.price.toFixed(2) ?? '–'} · {currentTierInfo?.billing ?? '–'}
                  </p>
                </div>
              </>
            ) : (
              <>
                {getFormulaImage(currentFormulaId) && (
                  <div className="w-12 h-12 flex-shrink-0 overflow-hidden border border-black/8 rounded-md">
                    <Image
                      src={getFormulaImage(currentFormulaId)}
                      alt={currentFormulaName ?? 'Formula'}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-black/50">Your current plan</p>
                  <p className="font-semibold text-sm text-black">
                    {currentFormulaName ?? 'Formula'} · {currentPackSize} shots
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Protocol or Formula selector */}
          <div className="w-2/5 border-r border-black/10 p-6 overflow-y-auto bg-[var(--brand-navy)]/5">
            <ProductSelectorPanel
              isProtocol={isProtocol}
              selectedProtocol={selectedProtocol}
              selectedTier={selectedTier}
              currentProtocolId={currentProtocolId}
              selectedFormulaId={selectedFormulaId}
              currentFormulaId={currentFormulaId}
              onSelectProtocol={setSelectedProtocol}
              onSelectFormula={setSelectedFormulaId}
              initialProtocolId={initialProtocolRef.current}
              initialFormulaId={initialFormulaRef.current}
            />
          </div>

          {/* Right: Pack size / tier */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            <TierSelectorPanel
              isProtocol={isProtocol}
              selectedProtocol={selectedProtocol}
              currentProtocolId={currentProtocolId}
              selectedTier={selectedTier}
              currentTier={currentTier}
              selectedPackSize={selectedPackSize}
              currentPackSize={currentPackSize}
              onSelectTier={setSelectedTier}
              onSelectPackSize={setSelectedPackSize}
              formattedNextBilling={formattedNextBilling}
              initialTier={initialTierRef.current}
              initialPackSize={initialPackRef.current}
              initialProtocolId={initialProtocolRef.current}
            />
          </div>
        </div>

        {/* Desktop Footer */}
        <div className="border-t border-black/8 p-6 bg-white">
          <PlanPreviewBar
            isProtocol={isProtocol}
            currentProtocolId={currentProtocolId}
            currentTier={currentTier}
            currentFormulaId={currentFormulaId}
            currentPackSize={currentPackSize}
            selectedProtocol={selectedProtocol}
            selectedTier={selectedTier}
            selectedFormulaId={selectedFormulaId}
            selectedPackSize={selectedPackSize}
            hasChanges={hasChanges}
          />
          {hasUnfulfilledFirstOrder && hasChanges && (
            <div className="mb-4 p-3 bg-[var(--brand-navy)]/5 border border-[var(--brand-navy)]/20 rounded-md">
              <div className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  className="text-[var(--brand-navy)] flex-shrink-0 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <p className="text-sm text-[var(--brand-navy)]">
                  This change will take effect on your{" "}
                  <strong>next delivery</strong>. Your first order is already
                  being prepared. Need to adjust it?{" "}
                  <ContactSupportLink variant="inline" icon={false} />.
                </p>
              </div>
            </div>
          )}
          {error && (
            <SaveErrorBanner
              error={error}
              errorPartial={errorPartial}
              errorMultiLine={errorMultiLine}
              subscriptionName={subscriptionName}
              subscriptionId={subscriptionId}
            />
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              <ContactSupportLink
                subject={supportSubject}
                variant="link-blue"
                icon="envelope-small"
              />
              <span className="text-sm text-black/60">
                {hasChanges ? (
                  <span className="text-black font-medium">
                    {isProtocol
                      ? `→ ${PROTOCOLS.find((p) => p.id === selectedProtocol)?.name} · ${getTierInfo(selectedProtocol, selectedTier)?.deliveryShots} shots per delivery`
                      : `→ ${FORMULAS.find((f) => f.id === selectedFormulaId)?.name} · ${selectedPackSize} shots`}
                  </span>
                ) : (
                  "No changes"
                )}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="rounded-full border border-black/10 hover:border-black/40 px-6 py-2.5 text-[13px] font-medium text-black transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving || loading || (!isProtocol && !onSaveFormula)}
                className="rounded-full bg-[var(--brand-navy)] px-6 py-2.5 text-[13px] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Mobile */}
      <div className="relative bg-white border border-black/10 rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] w-full max-h-[90vh] overflow-hidden flex flex-col md:hidden">
        {/* Header */}
        <div className="border-b border-black/8 px-4 py-3">
          <div className="flex items-start justify-between mb-2">
            <h2 className="font-semibold text-black" style={{ letterSpacing: "-0.02em" }}>Edit Plan</h2>
            <button onClick={onClose} className="p-2 hover:bg-[#f5f5f5] text-black">
              <SubscriptionIcon name="close" className="w-5 h-5" />
            </button>
          </div>
          {/* Current plan visual summary — mobile */}
          <div className="flex items-center gap-2.5 p-2.5 bg-[#f5f5f5] border border-black/10 rounded-md">
            {isProtocol ? (
              <>
                {getProtocolImage(currentProtocolId) && (
                  <div className="w-10 h-10 flex-shrink-0 overflow-hidden border border-black/8 rounded-md">
                    <Image
                      src={getProtocolImage(currentProtocolId)}
                      alt={currentProtocolName ?? 'Protocol'}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-black/50">Current plan</p>
                  <p className="font-semibold text-sm text-black truncate">
                    {currentProtocolName ?? 'Protocol'} · {currentPlanShots ?? '–'} shots · {currentTierInfo?.frequency ?? '–'}
                  </p>
                </div>
              </>
            ) : (
              <>
                {getFormulaImage(currentFormulaId) && (
                  <div className="w-10 h-10 flex-shrink-0 overflow-hidden border border-black/8 rounded-md">
                    <Image
                      src={getFormulaImage(currentFormulaId)}
                      alt={currentFormulaName ?? 'Formula'}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-black/50">Current plan</p>
                  <p className="font-semibold text-sm text-black truncate">
                    {currentFormulaName ?? 'Formula'} · {currentPackSize} shots
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Steps */}
        <div className="flex border-b border-black/8">
          <button
            type="button"
            onClick={() => setMobileStep("product")}
            className={`flex-1 py-3 text-[13px] font-medium tabular-nums transition-colors ${
              mobileStep === "product"
                ? "bg-[var(--brand-navy)] text-white"
                : "text-black bg-white hover:bg-[#f5f5f5]"
            }`}
          >
            1. {isProtocol ? "Protocol" : "Formula"}
          </button>
          <button
            type="button"
            onClick={() => setMobileStep("tier")}
            className={`flex-1 py-3 text-[13px] font-medium tabular-nums border-l border-black/8 transition-colors ${
              mobileStep === "tier"
                ? "bg-[var(--brand-navy)] text-white"
                : "text-black bg-white hover:bg-[#f5f5f5]"
            }`}
          >
            2. Pack size
          </button>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {mobileStep === "product" ? (
            <ProductSelectorPanel
              isProtocol={isProtocol}
              selectedProtocol={selectedProtocol}
              selectedTier={selectedTier}
              currentProtocolId={currentProtocolId}
              selectedFormulaId={selectedFormulaId}
              currentFormulaId={currentFormulaId}
              onSelectProtocol={(id) => { setSelectedProtocol(id); setMobileStep("tier"); }}
              onSelectFormula={(id) => { setSelectedFormulaId(id); setMobileStep("tier"); }}
              compact={true}
              initialProtocolId={initialProtocolRef.current}
              initialFormulaId={initialFormulaRef.current}
            />
          ) : (
            <TierSelectorPanel
              isProtocol={isProtocol}
              selectedProtocol={selectedProtocol}
              currentProtocolId={currentProtocolId}
              selectedTier={selectedTier}
              currentTier={currentTier}
              selectedPackSize={selectedPackSize}
              currentPackSize={currentPackSize}
              onSelectTier={setSelectedTier}
              onSelectPackSize={setSelectedPackSize}
              formattedNextBilling={formattedNextBilling}
              initialTier={initialTierRef.current}
              initialPackSize={initialPackRef.current}
              initialProtocolId={initialProtocolRef.current}
            />
          )}
        </div>

        {/* Mobile Footer */}
        <div className="border-t border-black/8 p-4 bg-white">
          <PlanPreviewBar
            isProtocol={isProtocol}
            currentProtocolId={currentProtocolId}
            currentTier={currentTier}
            currentFormulaId={currentFormulaId}
            currentPackSize={currentPackSize}
            selectedProtocol={selectedProtocol}
            selectedTier={selectedTier}
            selectedFormulaId={selectedFormulaId}
            selectedPackSize={selectedPackSize}
            hasChanges={hasChanges}
            compact={true}
          />
          {hasUnfulfilledFirstOrder && hasChanges && (
            <div className="mb-3 p-2 bg-[var(--brand-navy)]/5 border border-[var(--brand-navy)]/20 rounded-md">
              <div className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  className="text-[var(--brand-navy)] flex-shrink-0 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <p className="text-sm text-[var(--brand-navy)]">
                  Changes apply to your <strong>next delivery</strong>.{" "}
                  <ContactSupportLink variant="inline" icon={false} className="ml-1" />
                  {" "}to adjust your first order.
                </p>
              </div>
            </div>
          )}
          {error && (
            <SaveErrorBanner
              error={error}
              errorPartial={errorPartial}
              errorMultiLine={errorMultiLine}
              subscriptionName={subscriptionName}
              subscriptionId={subscriptionId}
              compact={true}
            />
          )}
          <ContactSupportLink
            subject={supportSubject}
            variant="button-outline-subtle"
            icon="envelope-small"
            className="mb-3 w-full"
          />
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving || loading || (!isProtocol && !onSaveFormula)}
            className="w-full py-3 rounded-full bg-[var(--brand-navy)] text-white text-[13px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {saving
              ? "Updating..."
              : hasChanges
                ? saveLabel
                : "No changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
