"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// This is a content/commerce site, not a document editor. By default Convex
// installs a beforeunload "Leave site?" warning while any mutation is in-flight,
// which fires on outbound navigation (e.g. the quiz CTA firing a cta_clicked
// event as it links to the PDP). That is poor UX with no upside here, so disable it.
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
