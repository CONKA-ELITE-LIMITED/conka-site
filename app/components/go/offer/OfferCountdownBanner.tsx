"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/app/lib/productData";

/**
 * OfferCountdownBanner: the offer page's top bar, in place of the site nav
 * (Grüns pattern, SCRUM-1343). Offer copy on the left, a countdown to the end
 * of the week on the right. Used on the trial pack page only, never site-wide.
 *
 * Performance: the copy and the four fixed-width timer boxes render on the
 * server with "--" placeholders, so the bar has its final size before any JS
 * runs and nothing shifts when the digits fill in. The client work is one
 * 1s interval that recomputes from the clock each tick, so it never drifts.
 *
 * Content only: the page owns the bar's background and gutters.
 */

const LONDON_PARTS = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Seconds until Sunday 23:59:59 UK time, read off the London wall clock so it
 * is right for visitors in any timezone. On the two DST-change weekends it can
 * be an hour out, which is fine for a weekly offer. At zero it rolls straight
 * over to the next week.
 */
function secondsToWeekEnd(now: Date): number {
  const parts = Object.fromEntries(
    LONDON_PARTS.formatToParts(now).map((p) => [p.type, p.value]),
  );
  const weekday = WEEKDAYS.indexOf(parts.weekday);
  const secondOfDay = Number(parts.hour) * 3600 + Number(parts.minute) * 60 + Number(parts.second);
  const daysAfterToday = (7 - weekday) % 7;
  return daysAfterToday * 86400 + (86400 - secondOfDay);
}

export default function OfferCountdownBanner({ fromPrice }: { fromPrice: number }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <p className="min-w-0 text-[12px] font-bold uppercase leading-tight tracking-wide sm:text-[13px]">
        <span className="block">This week only</span>
        <span className="block">CONKA trial pack from {formatPrice(fromPrice)}</span>
      </p>
      <Countdown />
    </div>
  );
}

function Countdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(secondsToWeekEnd(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units =
    remaining === null
      ? null
      : [
          Math.floor(remaining / 86400),
          Math.floor((remaining % 86400) / 3600),
          Math.floor((remaining % 3600) / 60),
          remaining % 60,
        ];

  return (
    <div role="timer" aria-label="Offer ends Sunday at midnight UK time" className="flex shrink-0 gap-1">
      {["Days", "Hrs", "Min", "Sec"].map((label, i) => (
        <span
          key={label}
          aria-hidden
          className="flex w-9 flex-col items-center rounded-md bg-white/10 py-1 leading-none"
        >
          <span className="text-[15px] font-bold tabular-nums">
            {units ? String(units[i]).padStart(2, "0") : "--"}
          </span>
          <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide text-white/70">
            {label}
          </span>
        </span>
      ))}
    </div>
  );
}
