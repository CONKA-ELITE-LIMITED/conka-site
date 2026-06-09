/**
 * Product helper functions and calendar generator.
 */

import type { PackSize, PurchaseType, ProtocolId, ProtocolTier } from "./productTypes";
import {
  formulaPricing,
  protocolPricing,
} from "./productPricing";
import { protocolContent } from "./protocolContent";

export function formatPrice(price: number): string {
  return `£${price.toFixed(2)}`;
}

export function getFormulaPricing(
  packSize: PackSize,
  purchaseType: PurchaseType,
) {
  return formulaPricing[purchaseType][packSize];
}

export function getProtocolPricing(
  protocolId: ProtocolId,
  tier: ProtocolTier,
  purchaseType: PurchaseType,
) {
  const pricingType = protocolId === "4" ? "ultimate" : "standard";
  const tierPricing = protocolPricing[pricingType][purchaseType];

  if (tier in tierPricing) {
    return tierPricing[tier as keyof typeof tierPricing];
  }
  return null;
}

export function getBillingLabel(billing: string): string {
  switch (billing) {
    case "weekly":
      return "billed weekly";
    case "bi-weekly":
      return "billed bi-weekly";
    case "monthly":
      return "billed monthly";
    default:
      return billing;
  }
}

/** Pack-count label for protocol tier (e.g. "4-pack", "12-pack"). Standard protocols 1–3; Ultimate protocol 4. */
export function getProtocolTierPackLabel(
  protocolId: ProtocolId,
  tier: ProtocolTier,
): string {
  if (protocolId === "4") {
    const ultimateLabels: Record<ProtocolTier, string> = {
      starter: "4-pack",
      pro: "28-pack",
      max: "56-pack",
    };
    return ultimateLabels[tier];
  }
  const standardLabels: Record<ProtocolTier, string> = {
    starter: "4-pack",
    pro: "12-pack",
    max: "28-pack",
  };
  return standardLabels[tier];
}

/** Total shots (pack size) for protocol tier – used for per-shot price. Standard 4/12/28; Ultimate 4/24/48. */
export function getProtocolTierTotalShots(
  protocolId: ProtocolId,
  tier: ProtocolTier,
): number {
  if (protocolId === "4") {
    const ultimate: Record<ProtocolTier, number> = {
      starter: 4,
      pro: 28,
      max: 56,
    };
    return ultimate[tier];
  }
  const standard: Record<ProtocolTier, number> = {
    starter: 4,
    pro: 12,
    max: 28,
  };
  return standard[tier];
}

// Generate calendar days for protocol visualization
export function generateProtocolCalendarDays(
  protocolId: ProtocolId,
  tier: ProtocolTier,
): Array<{ day: number; formula: "01" | "02" | "rest" | "both" }> {
  const protocol = protocolContent[protocolId];
  const tierConfig = protocol.tiers[tier];

  if (!tierConfig) return [];

  const days: Array<{ day: number; formula: "01" | "02" | "rest" | "both" }> = [];

  // Generate 4 weeks (28 days)
  for (let week = 0; week < 4; week++) {
    for (let day = 0; day < 7; day++) {
      const dayNum = week * 7 + day + 1;

      if (protocolId === "4") {
        // Ultimate: Pro = 6+6 (6 days both, 1 rest e.g. Sunday); Max = 7+7 (both every day)
        if (tier === "pro") {
          days.push({ day: dayNum, formula: day === 6 ? "rest" : "both" }); // Sunday = rest
        } else {
          days.push({ day: dayNum, formula: "both" });
        }
      } else if (protocolId === "3") {
        // Balanced: Alternating pattern
        if (tier === "starter") {
          // 2+2: Mon=01, Tue=02, Thu=01, Sat=02
          if (day === 0 || day === 3) days.push({ day: dayNum, formula: "01" });
          else if (day === 1 || day === 5)
            days.push({ day: dayNum, formula: "02" });
          else days.push({ day: dayNum, formula: "rest" });
        } else if (tier === "pro") {
          // 3+3: Mon/Wed/Fri=01, Tue/Thu/Sat=02
          if (day === 0 || day === 2 || day === 4)
            days.push({ day: dayNum, formula: "01" });
          else if (day === 1 || day === 3 || day === 5)
            days.push({ day: dayNum, formula: "02" });
          else days.push({ day: dayNum, formula: "rest" });
        } else {
          // 4+3: Mon/Wed/Fri/Sun=01, Tue/Thu/Sat=02
          if (day === 0 || day === 2 || day === 4 || day === 6)
            days.push({ day: dayNum, formula: "01" });
          else days.push({ day: dayNum, formula: "02" });
        }
      } else {
        // Protocol 1 or 2: Primary formula most days, secondary once weekly
        const isPrimaryConkaFlow = protocolId === "1";

        if (tier === "starter") {
          // 3+1: Mon/Wed/Fri primary, Sun secondary
          if (day === 0 || day === 2 || day === 4) {
            days.push({
              day: dayNum,
              formula: isPrimaryConkaFlow ? "01" : "02",
            });
          } else if (day === 6) {
            days.push({
              day: dayNum,
              formula: isPrimaryConkaFlow ? "02" : "01",
            });
          } else {
            days.push({ day: dayNum, formula: "rest" });
          }
        } else if (tier === "pro") {
          // 5+1: Mon-Fri primary, Sun secondary
          if (day >= 0 && day <= 4) {
            days.push({
              day: dayNum,
              formula: isPrimaryConkaFlow ? "01" : "02",
            });
          } else if (day === 6) {
            days.push({
              day: dayNum,
              formula: isPrimaryConkaFlow ? "02" : "01",
            });
          } else {
            days.push({ day: dayNum, formula: "rest" });
          }
        } else {
          // 6+1: Mon-Sat primary, Sun secondary
          if (day >= 0 && day <= 5) {
            days.push({
              day: dayNum,
              formula: isPrimaryConkaFlow ? "01" : "02",
            });
          } else {
            days.push({
              day: dayNum,
              formula: isPrimaryConkaFlow ? "02" : "01",
            });
          }
        }
      }
    }
  }

  return days;
}
