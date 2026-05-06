"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getSiteTestimonialsProtocol, shuffleTestimonials } from "@/app/lib/testimonialsFilter";
import type { Testimonial } from "@/app/components/testimonials/types";

const Testimonials = dynamic(
  () => import("@/app/components/testimonials/Testimonials"),
  {
    loading: () => <div className="h-[500px]" />,
  },
);

const benefits = [
  {
    title: "Stress resilience",
    stat: "-56%",
    statLabel: "stress scores",
    pmid: "PMID: 23439798",
  },
  {
    title: "Cognitive enhancement",
    stat: "+63%",
    statLabel: "memory",
    pmid: "PMID: 29246725",
  },
  {
    title: "Sustained energy",
    stat: "+17%",
    statLabel: "fitness",
    pmid: "PMID: 10839209",
  },
  {
    title: "Mental clarity & detox",
    stat: "+40%",
    statLabel: "GSH",
    pmid: "PMID: 29559699",
  },
];

export default function BalanceProtocolInfo() {
  const [shuffledTestimonials, setShuffledTestimonials] = useState<Testimonial[]>([]);

  // Shuffle protocol set on client to avoid hydration mismatch
  useEffect(() => {
    setShuffledTestimonials(shuffleTestimonials(getSiteTestimonialsProtocol()));
  }, []);

  return (
    <section className="px-6 md:px-16 lg:px-24 py-12 border-t-2 border-current/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 md:mb-10 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            What to Expect with the Balance Protocol
          </h2>
          <p className="font-clinical text-sm md:text-base opacity-70 max-w-2xl mx-auto">
            For those who want clarity and focus in equal measure
          </p>
        </div>

        {/* Situational Context */}
        <div className="mb-8 md:mb-10 text-center">
          <p className="font-clinical text-xs uppercase tracking-widest opacity-50 md:opacity-100 mb-2">
            <span className="md:hidden">Commonly chosen when</span>
            <span className="hidden md:inline">Perfect For:</span>
          </p>
          <p className="font-primary text-base md:text-lg opacity-80">
            Training hard • thinking hard • recovery matters
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="neo-box p-4 md:p-6 flex flex-col items-center text-center hover:shadow-[4px_4px_0px_0px_var(--foreground)] transition-all"
            >
              {/* Large Stat */}
              <div className="mb-2 md:mb-3">
                <div className="font-clinical text-4xl md:text-5xl lg:text-6xl font-bold text-teal-600 mb-1">
                  {benefit.stat}
                </div>
                <div className="font-clinical text-xs uppercase tracking-widest opacity-70">
                  {benefit.statLabel}
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-sm md:text-base mb-1 md:mb-2 leading-tight">
                {benefit.title}
              </h3>

              {/* PMID */}
              <p className="font-clinical text-xs opacity-60 mt-auto">
                {benefit.pmid}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mb-8 md:mb-12">
          <Link
            href="/conka-both"
            className="neo-button px-8 py-4 font-bold text-base md:text-lg w-full md:w-auto flex md:inline-flex items-center justify-center gap-2"
          >
            View Product
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Testimonials Section - Outside max-w-6xl to allow full width */}
      {shuffledTestimonials.length > 0 && (
        <div className="mt-8 md:mt-12 -mx-6 md:-mx-16 lg:-mx-24">
          <Testimonials testimonials={shuffledTestimonials} autoScrollOnly />
        </div>
      )}
    </section>
  );
}
