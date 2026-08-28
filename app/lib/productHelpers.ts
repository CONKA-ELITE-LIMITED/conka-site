/**
 * Product helper functions.
 */

export function formatPrice(price: number): string {
  return `£${price.toFixed(2)}`;
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
