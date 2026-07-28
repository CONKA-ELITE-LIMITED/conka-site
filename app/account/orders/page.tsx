"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/app/components/navigation";
import { AccountSubNav } from "@/app/components/account/AccountSubNav";
import { useAuth } from "@/app/context/AuthContext";
import type { Order } from "@/app/account/orders/utils";
import { formatDate } from "@/app/account/orders/utils";
import { OrdersPageHeader } from "@/app/components/orders/OrdersPageHeader";
import { OrderSummaryStats } from "@/app/components/orders/OrderSummaryStats";
import { EmptyOrdersState } from "@/app/components/orders/EmptyOrdersState";
import { OrderCard } from "@/app/components/orders/OrderCard";
import { OrdersHelpCard } from "@/app/components/orders/OrdersHelpCard";

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/account/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/auth/orders", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
          setError(null);
        } else {
          const data = await response.json();
          setError(data.error || "Failed to load orders");
          setOrders([]);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-black/15 border-t-black/50 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-black/60">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const deliveredCount = orders.filter(
    (o) => o.fulfillmentStatus?.toLowerCase() === "fulfilled"
  ).length;
  const inProgressCount = orders.filter(
    (o) =>
      o.fulfillmentStatus?.toLowerCase() !== "fulfilled" &&
      o.financialStatus?.toLowerCase() === "paid"
  ).length;
  const mostRecentProcessedAt = orders[0]?.processedAt;
  const lastOrderFormatted = mostRecentProcessedAt ? formatDate(mostRecentProcessedAt) : null;
  const headerSubtitle = orders.length === 0
    ? "No orders yet"
    : [
        `${orders.length} order${orders.length !== 1 ? "s" : ""}`,
        deliveredCount > 0 ? `${deliveredCount} delivered` : null,
        lastOrderFormatted ? `last on ${lastOrderFormatted}` : null,
      ].filter(Boolean).join(" · ");

  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />
      <AccountSubNav />

      <main className="pt-3 pb-24 lg:pt-4">
        <section
          className="brand-section brand-bg-white"
          aria-labelledby="orders-heading"
        >
          <div className="brand-track">
            <OrdersPageHeader subtitle={headerSubtitle} />

            {orders.length > 0 && (
              <OrderSummaryStats
                totalCount={orders.length}
                deliveredCount={deliveredCount}
                inProgressCount={inProgressCount}
              />
            )}

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50/50 p-6 mb-8">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {orders.length === 0 ? (
              <EmptyOrdersState />
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    isExpanded={expandedOrder === order.id}
                    onToggle={() => toggleOrder(order.id)}
                  />
                ))}
              </div>
            )}

            {orders.length > 0 && <OrdersHelpCard />}
          </div>
        </section>
      </main>
    </div>
  );
}
