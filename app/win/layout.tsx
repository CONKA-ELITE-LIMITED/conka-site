import ConvexClientProvider from "@/app/components/ConvexClientProvider";

// Scoped Convex — only the routes that actually use the realtime client are
// wrapped, so the ~80 KB ConvexReactClient no longer loads on every page.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
