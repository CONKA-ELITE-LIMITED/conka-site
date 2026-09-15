"use client";

import { useEffect, useState } from "react";

/**
 * OfferCountdown: the ticking timer inside OfferCountdownBanner, the banner's
 * only client island. Days / Hrs / Min / Sec boxes are fixed width and render
 * "--" on the server, so filling in the digits causes no layout shift. One 1s
 * interval recomputes from the clock each tick, so it never drifts.
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
const UNIT_LABELS = ["Days", "Hrs", "Min", "Sec"];

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

export default function OfferCountdown() {
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
      {UNIT_LABELS.map((label, i) => (
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
