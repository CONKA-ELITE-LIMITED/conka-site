"use client";

import { useState, useEffect } from "react";
import { sciencePillars } from "@/app/lib/scienceData";
import useIsMobile from "@/app/hooks/useIsMobile";
import PillarCard from "./PillarCard";

export default function SciencePillars() {
  const isMobile = !!useIsMobile();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isMobile && sciencePillars[0]?.id) {
      setExpandedId(sciencePillars[0].id);
    }
  }, [isMobile]);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <div className="mb-8 lg:mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3 tabular-nums">
          {"// The five pillars · SCI-01"}
        </p>
        <h2
          className="brand-h2 text-black mb-2"
          style={{ letterSpacing: "-0.02em" }}
        >
          How our formulas work
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          Five systems · Mechanism-first · PubMed-linked
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {sciencePillars.map((pillar, idx) => (
          <PillarCard
            key={pillar.id}
            pillar={pillar}
            index={idx}
            total={sciencePillars.length}
            isExpanded={expandedId === pillar.id}
            onToggle={() => handleToggle(pillar.id)}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
}
