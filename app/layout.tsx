import type { Metadata, Viewport } from "next";
import { Poppins, Caveat, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";
import { AuthProvider } from "@/app/context/AuthContext";
import CartDrawer from "@/app/components/CartDrawer";
import ConvexClientProvider from "@/app/components/ConvexClientProvider";
import MetaPageViewTracker from "@/app/components/MetaPageViewTracker";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
  display: "swap",
});

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

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.conka.io"),
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
  alternates: {
    canonical: "https://www.conka.io",
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
        {/* CookieYes consent banner — loaded on first user interaction to
             keep it out of LCP (Lighthouse has no interaction, so banner
             never loads in lab tests; real users trigger it immediately).
             Failsafe timeout ensures banner appears even without interaction. */}
        <Script id="cookieyes-loader" strategy="afterInteractive">
          {`(function(){var d=0;function l(){if(d)return;d=1;var s=document.createElement('script');s.src='https://cdn-cookieyes.com/client_data/da22d570927106b57de609d869ecc4f3/script.js';document.head.appendChild(s)}['mousemove','scroll','keydown','touchstart','click'].forEach(function(e){window.addEventListener(e,l,{once:true,passive:true})});setTimeout(l,7000)})()`}
        </Script>

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
          `}
        </Script>

        {/* Triple Pixel */}
        <Script
          id="triple-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: '/* >> TriplePixel :: start*/window.TriplePixelData={TripleName:"conka-6770.myshopify.com",ver:"2.17",plat:"SHOPIFY",isHeadless:true},function(W,H,A,L,E,_,B,N){function O(U,T,P,H,R){void 0===R&&(R=!1),H=new XMLHttpRequest,P?(H.open("POST",U,!0),H.setRequestHeader("Content-Type","text/plain")):H.open("GET",U,!0),H.send(JSON.stringify(P||{})),H.onreadystatechange=function(){4===H.readyState&&200===H.status?(R=H.responseText,U.includes("/first")?eval(R):P||(N[B]=R)):(299<H.status||H.status<200)&&T&&!R&&(R=!0,O(U,T-1,P))}}if(N=window,!N[H+"sn"]){N[H+"sn"]=1,L=function(){return Date.now().toString(36)+"_"+Math.random().toString(36)};try{A.setItem(H,1+(0|A.getItem(H)||0)),(E=JSON.parse(A.getItem(H+"U")||"[]")).push({u:location.href,r:document.referrer,t:Date.now(),id:L()}),A.setItem(H+"U",JSON.stringify(E))}catch(e){}var i,m,p;A.getItem(\'"!nC\\`\')||(_=A,A=N,A[H]||(E=A[H]=function(t,e,a){return void 0===a&&(a=[]),"State"==t?E.s:(W=L(),(E._q=E._q||[]).push([W,t,e].concat(a)),W)},E.s="Installed",E._q=[],E.ch=W,B="configSecurityConfModel",N[B]=1,O("https://conf.config-security.com/model",5),i=L(),m=A[atob("c2NyZWVu")],_.setItem("di_pmt_wt",i),p={id:i,action:"profile",avatar:_.getItem("auth-security_rand_salt_"),time:m[atob("d2lkdGg=")]+":"+m[atob("aGVpZ2h0")],host:A.TriplePixelData.TripleName,plat:A.TriplePixelData.plat,url:window.location.href.slice(0,500),ref:document.referrer,ver:A.TriplePixelData.ver},O("https://api.config-security.com/event",5,p),O("https://api.config-security.com/first?host=conka-6770.myshopify.com&plat=SHOPIFY",5)))}}("","TriplePixel",localStorage);/* << TriplePixel :: end*/',
          }}
        />

        {/* Klaviyo Sign-up Forms */}
        <Script
          src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY}`}
          strategy="afterInteractive"
          async
        />
      </head>
      <body
        className={`${poppins.variable} ${caveat.variable} ${ibmPlexMono.variable} ${neueHaas.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <MetaPageViewTracker />
        <ConvexClientProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <CartDrawer />
            </CartProvider>
          </AuthProvider>
        </ConvexClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
