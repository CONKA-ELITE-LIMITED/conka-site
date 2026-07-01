"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * Loads Google Analytics + Triple Whale on the first user engagement
 * (scroll / tap / key / pointer) or a short idle fallback — keeping these two
 * non-critical marketing tags off the initial load window (fewer render-time
 * network requests, better "reduce unused JS / 3rd parties / cache lifetimes"
 * audits, less main-thread contention during load).
 *
 * The Meta Pixel is deliberately NOT here — it stays early in the root layout
 * because attribution (`_fbc` ad-click capture + PageView) depends on it firing
 * before the first cart action. Only the low-time-sensitivity tags are delayed.
 *
 * Trade-off: users who bounce within ~4s and never interact won't hit GA /
 * Triple Whale. That's the standard, accepted cost of deferral.
 */
export default function DelayedAnalytics() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    const load = () => setReady(true);
    const events: (keyof WindowEventMap)[] = [
      "scroll",
      "touchstart",
      "pointerdown",
      "keydown",
      "mousemove",
    ];
    events.forEach((e) =>
      window.addEventListener(e, load, { once: true, passive: true }),
    );
    const timer = setTimeout(load, 4000); // idle fallback
    return () => {
      events.forEach((e) => window.removeEventListener(e, load));
      clearTimeout(timer);
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <>
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

      {/* Triple Pixel */}
      <Script
        id="triple-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: '/* >> TriplePixel :: start*/window.TriplePixelData={TripleName:"conka-6770.myshopify.com",ver:"2.17",plat:"SHOPIFY",isHeadless:true},function(W,H,A,L,E,_,B,N){function O(U,T,P,H,R){void 0===R&&(R=!1),H=new XMLHttpRequest,P?(H.open("POST",U,!0),H.setRequestHeader("Content-Type","text/plain")):H.open("GET",U,!0),H.send(JSON.stringify(P||{})),H.onreadystatechange=function(){4===H.readyState&&200===H.status?(R=H.responseText,U.includes("/first")?eval(R):P||(N[B]=R)):(299<H.status||H.status<200)&&T&&!R&&(R=!0,O(U,T-1,P))}}if(N=window,!N[H+"sn"]){N[H+"sn"]=1,L=function(){return Date.now().toString(36)+"_"+Math.random().toString(36)};try{A.setItem(H,1+(0|A.getItem(H)||0)),(E=JSON.parse(A.getItem(H+"U")||"[]")).push({u:location.href,r:document.referrer,t:Date.now(),id:L()}),A.setItem(H+"U",JSON.stringify(E))}catch(e){}var i,m,p;A.getItem(\'"!nC\\`\')||(_=A,A=N,A[H]||(E=A[H]=function(t,e,a){return void 0===a&&(a=[]),"State"==t?E.s:(W=L(),(E._q=E._q||[]).push([W,t,e].concat(a)),W)},E.s="Installed",E._q=[],E.ch=W,B="configSecurityConfModel",N[B]=1,O("https://conf.config-security.com/model",5),i=L(),m=A[atob("c2NyZWVu")],_.setItem("di_pmt_wt",i),p={id:i,action:"profile",avatar:_.getItem("auth-security_rand_salt_"),time:m[atob("d2lkdGg=")]+":"+m[atob("aGVpZ2h0")],host:A.TriplePixelData.TripleName,plat:A.TriplePixelData.plat,url:window.location.href.slice(0,500),ref:document.referrer,ver:A.TriplePixelData.ver},O("https://api.config-security.com/event",5,p),O("https://api.config-security.com/first?host=conka-6770.myshopify.com&plat=SHOPIFY",5)))}}("","TriplePixel",localStorage);/* << TriplePixel :: end*/',
        }}
      />
    </>
  );
}
