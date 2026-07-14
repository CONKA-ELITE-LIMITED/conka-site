/**
 * Product helper functions.
 */

import type { PackSize, PurchaseType } from "./productTypes";
import { formulaPricing } from "./productPricing";

export function formatPrice(price: number): string {
  return `£${price.toFixed(2)}`;
}

export function getFormulaPricing(
  packSize: PackSize,
  purchaseType: PurchaseType,
) {
  return formulaPricing[purchaseType][packSize];
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
