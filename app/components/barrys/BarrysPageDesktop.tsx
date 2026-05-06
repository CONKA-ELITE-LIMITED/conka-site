"use client";

import Image from "next/image";
import BarrysEmailForm from "./BarrysEmailForm";
import BalanceProtocolInfo from "./BalanceProtocolInfo";
import { getProtocolImage } from "@/app/lib/productImageConfig";

interface BarrysPageDesktopProps {
  contestId: string;
}

export default function BarrysPageDesktop({
  contestId,
}: BarrysPageDesktopProps) {
  const protocolImage = getProtocolImage("3");

  return (
    <div className="min-h-screen pt-8 pb-6">
      <div className="px-6 md:px-16 lg:px-24 py-8">
        <div className="w-full">
          <div className="grid lg:grid-cols-7 gap-12 items-center">
            {/* Left Side - Protocol Image */}
            <div className="w-full lg:col-span-4 aspect-[5/3] relative">
              <Image
                src={protocolImage}
                alt="CONKA Balance Protocol"
                fill
                className="object-cover object-center"
                style={{ objectPosition: "center center" }}
                priority
              />
            </div>

            {/* Right Side - Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Header Copy */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  The perfect balance of clarity and focus
                </h1>
                <p className="text-2xl md:text-3xl font-semibold text-teal-600">
                  40% off anything over £25
                </p>
                <p className="font-mono text-sm uppercase tracking-widest opacity-70">
                  Get your discount code delivered to your inbox
                </p>
              </div>

              {/* Email Form */}
              <div className="neo-box p-6 md:p-8">
                <BarrysEmailForm contestId={contestId} onSuccess={() => {}} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Protocol Info Section */}
      <BalanceProtocolInfo />
    </div>
  );
}
