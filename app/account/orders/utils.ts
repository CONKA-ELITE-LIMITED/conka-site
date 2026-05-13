export interface OrderLineItem {
  title: string;
  quantity: number;
  image?: {
    url: string;
    altText?: string;
  };
  price: {
    amount: string;
    currencyCode: string;
  };
}

export interface ShippingAddress {
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderName?: string;
  processedAt: string;
  cancelledAt?: string;
  cancelReason?: string;
  fulfillmentStatus: string;
  financialStatus: string;
  totalPrice: { amount: string; currencyCode: string };
  subtotal?: { amount: string; currencyCode: string };
  totalShipping?: { amount: string; currencyCode: string };
  totalTax?: { amount: string; currencyCode: string };
  shippingAddress?: ShippingAddress | null;
  lineItems: OrderLineItem[];
}

export const ORDER_STEPS = ["Placed", "Paid", "Processing", "Shipped", "Delivered"];

export function formatPrice(amount: string, currencyCode: string = "GBP"): string {
  const num = parseFloat(amount);
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currencyCode,
  }).format(num);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function getOrderProgress(order: Order): {
  current: number;
  completed: number[];
  cancelled: boolean;
} {
  const { financialStatus, fulfillmentStatus, cancelledAt } = order;

  if (cancelledAt) {
    return { current: -1, completed: [], cancelled: true };
  }

  const completed: number[] = [];
  let current = 0;

  completed.push(0);
  current = 0;

  const isPaid = financialStatus?.toLowerCase() === "paid";
  if (isPaid) {
    completed.push(1);
    current = 1;
  }

  const fulfillment = fulfillmentStatus?.toLowerCase() || "unfulfilled";
  if (
    isPaid &&
    (fulfillment === "unfulfilled" || fulfillment === "in_progress")
  ) {
    current = 2;
  }

  if (fulfillment === "partially_fulfilled" || fulfillment === "in_transit") {
    completed.push(2);
    current = 3;
  }

  if (fulfillment === "fulfilled" || fulfillment === "delivered") {
    completed.push(2);
    completed.push(3);
    completed.push(4);
    current = 4;
  }

  return { current, completed, cancelled: false };
}

export function isActiveOrder(
  order: Pick<Order, "financialStatus" | "fulfillmentStatus" | "cancelledAt">
): boolean {
  if (order.cancelledAt) return false;
  const financial = order.financialStatus?.toLowerCase();
  const fulfillment = order.fulfillmentStatus?.toLowerCase() || "unfulfilled";
  if (financial !== "paid") return false;
  return (
    fulfillment === "unfulfilled" ||
    fulfillment === "in_progress" ||
    fulfillment === "partially_fulfilled" ||
    fulfillment === "in_transit"
  );
}

export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case "fulfilled":
      return "bg-green-100 text-green-800";
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "unfulfilled":
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
