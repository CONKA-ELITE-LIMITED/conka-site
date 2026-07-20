import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";
import { AuthProvider } from "@/app/context/AuthContext";
import CartDrawer from "@/app/components/CartDrawer";
import MetaPageViewTracker from "@/app/components/MetaPageViewTracker";
import AliaIdentityBridge from "@/app/components/AliaIdentityBridge";
import DelayedAnalytics from "@/app/components/DelayedAnalytics";
import { SITE_ORIGIN } from "@/app/lib/site";
import {
  JsonLd,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/app/lib/jsonLd";

/* Brand design system: Neue Haas Grotesk Display (primary) + JetBrains Mono (data) */
const neueHaas = localFont({
  variable: "--font-brand-primary",
  src: [
    {
      path: "./fonts/neue-haas-grotesk-display-pro-cufonfonts/NeueHaasDisplayRoman.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/neue-haas-grotesk-display-pro-cufonfonts/NeueHaasDisplayMediu.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/neue-haas-grotesk-display-pro-cufonfonts/NeueHaasDisplayBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
});

const jetBrainsMono = localFont({
  variable: "--font-jetbrains-mono",
  src: [
    {
      path: "./fonts/JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  display: "swap",
});

/* ABC Favorit: only used on the /lander + /lander-b pages (via --font-abc-favorit).
 * preload:false — the variable + @font-face stay registered globally (so the
 * lander cascade is unchanged), but the 6 OTF weights are no longer force-
 * <link rel=preload>ed on every page. They were ~380 KB of forced downloads on
 * pages that never render this font (start-b, home, etc.). The lander still
 * loads them on demand (display:swap, same as before); non-lander pages drop
 * them entirely. No visual change. */
const abcFavorit = localFont({
  variable: "--font-abc-favorit",
  preload: false,
  src: [
    { path: "./fonts/ABCFavorit/ABCFavorit-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/ABCFavorit/ABCFavorit-RegularItalic.otf", weight: "400", style: "italic" },
    { path: "./fonts/ABCFavorit/ABCFavorit-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/ABCFavorit/ABCFavorit-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "./fonts/ABCFavorit/ABCFavorit-Bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/ABCFavorit/ABCFavorit-BoldItalic.otf", weight: "700", style: "italic" },
  ],
  display: "swap",
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: "CONKA - Daily Nootropic Brain Shot",
  description: "Premium daily nootropic brain shot supplements",
  openGraph: {
    title: "CONKA - Daily Nootropic Brain Shot",
    description: "Premium daily nootropic brain shot supplements",
    url: "https://www.conka.io",
    siteName: "CONKA",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CONKA - Daily Nootropic Brain Shot",
    description: "Premium daily nootropic brain shot supplements",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  // Relative canonical: Next resolves this against metadataBase and the current
  // route, so every page self-canonicalises. An absolute URL here is inherited
  // verbatim by every child route, telling Google they are all duplicates of the
  // homepage. Routes needing a different canonical (e.g. /start-b -> /start)
  // override `alternates` themselves.
  alternates: {
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Meta Pixel — production host only; never loads on preview deploys or localhost.
            afterInteractive so PageView + _fbc (ad-click) capture are not delayed. */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            if (window.location.hostname === 'www.conka.io') {
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
            }
          `}
        </Script>

        {/* Klaviyo Sign-up Forms — disabled 2026-05-26
            All signup forms set to draft in the Klaviyo dashboard, so this
            script was loading klaviyo.js + Brand Library on every page and
            rendering nothing (pure perf overhead: ~17.7 KiB legacy-JS
            polyfills, 16 KiB unused CSS, ~360ms main-thread time on /start).
            Server-side subscribe paths (/api/klaviyo/subscribe,
            /api/klaviyo/track-test) are unaffected and keep powering
            the Footer email signup.
            To restore: publish a form in the Klaviyo dashboard, then
            uncomment the Script tag below. */}
        {/*
        <Script
          src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY}`}
          strategy="afterInteractive"
          async
        />
        */}
        {/* Entity identity for answer engines (SCRUM-1141). Rendered once here so
            every route carries exactly one Organization and one WebSite node. */}
        <JsonLd schema={buildOrganizationSchema()} />
        <JsonLd schema={buildWebSiteSchema()} />
      </head>
      <body
        className={`${neueHaas.variable} ${jetBrainsMono.variable} ${abcFavorit.variable} antialiased`}
      >
        <MetaPageViewTracker />
        <AliaIdentityBridge />
        {/* Convex is NOT provided globally — the only consumer is /go, which is
            wrapped by its own layout. Keeping the ConvexReactClient (~80 KB) off
            every other page is a large TBT win. */}
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
        <DelayedAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
