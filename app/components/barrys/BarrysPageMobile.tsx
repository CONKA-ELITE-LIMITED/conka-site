"use client";

import Image from "next/image";
import BarrysEmailForm from "./BarrysEmailForm";
import BalanceProtocolInfo from "./BalanceProtocolInfo";
import { getProtocolImage } from "@/app/lib/productImageConfig";

interface BarrysPageMobileProps {
  contestId: string;
}

export default function BarrysPageMobile({
  contestId,
}: BarrysPageMobileProps) {
  const protocolImage = getProtocolImage("3");

  return (
    <div className="min-h-screen pt-8 pb-6">
      {/* Protocol Image */}
      <div className="w-full h-64 md:h-80 relative">
        <Image
          src={protocolImage}
          alt="CONKA Balance Protocol"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="px-6 py-8 space-y-6">
        {/* Header Copy */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            The perfect balance of clarity and focus
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-teal-600">
            40% off anything over £25
          </p>
          <p className="font-mono text-sm uppercase tracking-widest opacity-70">
            Get your discount code delivered to your inbox
          </p>
        </div>

        {/* Email Form */}
        <div className="neo-box p-6">
          <BarrysEmailForm contestId={contestId} onSuccess={() => {}} />
        </div>
      </div>

      {/* Balance Protocol Info Section */}
      <BalanceProtocolInfo />
    </div>
  );
}
