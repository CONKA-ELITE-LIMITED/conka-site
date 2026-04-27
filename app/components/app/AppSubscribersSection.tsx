"use client";

import Image from "next/image";

const REWARDS = [
  { label: "Token", value: "+10", note: "per completed test" },
  { label: "Tier up", value: "30", note: "tests in 30 days" },
  { label: "Redeem", value: "Free", note: "CONKA merch" },
];

export function AppSubscribersSection() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
      {/* Copy */}
      <div className="order-2 lg:order-1 lg:flex-1 mt-10 lg:mt-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3 tabular-nums">
          {"// Subscriber rewards · APP-01"}
        </p>
        <h2
          className="brand-h2 text-black mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          Exclusive rewards for CONKA subscribers.
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-6">
          Test daily · Earn tokens · Redeem merch
        </p>
        <div className="space-y-4 max-w-xl mb-8">
          <p className="text-sm md:text-base text-black/75 leading-relaxed">
            Subscribers earn tokens every time they complete a cognitive test.
            Use them to unlock exclusive merch and rewards. The more
            consistently you test, the more you earn.
          </p>
        </div>

        {/* Reward spec strip */}
        <div className="grid grid-cols-3 gap-0 border border-black/12 bg-white max-w-lg">
          {REWARDS.map((r, idx) => (
            <div
              key={r.label}
              className={`p-4 ${idx < REWARDS.length - 1 ? "border-r border-black/8" : ""}`}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
                {r.label}
              </p>
              <p className="font-mono text-2xl font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
                {r.value}
              </p>
              <p className="font-mono text-[9px] text-black/50 mt-2 leading-tight tabular-nums">
                {r.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Phone mockup with figure plate */}
      <div className="order-1 lg:order-2 lg:flex-[1.05] w-full">
        <div className="relative aspect-[4/5] lg:aspect-[5/6] border border-black/12 bg-[#f5f5f5] overflow-hidden flex items-center justify-center">
          <div className="relative h-[80%] w-auto">
            <Image
              src="/app/AppRewards.png"
              alt="CONKA app rewards screen showing token balance and exclusive merch"
              width={360}
              height={720}
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
            Fig. 06 · Rewards interface
          </div>
          <div className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
            Subscribers only
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppSubscribersSection;
