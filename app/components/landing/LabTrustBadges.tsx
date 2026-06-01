import { GUARANTEE_LABEL } from "@/app/lib/offerConstants";
import {
  TrustIconShipping,
  TrustIconInformedSport,
  TrustIconBatchTested,
  TrustIconCancel,
} from "./icons";

/* Classic trust-badge grid: centred icon, readable title, quiet subtitle.
   Replaces the earlier mono spec-sheet treatment (uppercase 10px labels in
   a divided grid) which read as styling rather than reassurance. Corners
   stay sharp so the row sits comfortably on the clinical pages. */

const BADGES = [
  {
    icon: TrustIconShipping,
    label: "Free UK Shipping",
    sub: "On subscriptions",
  },
  {
    icon: TrustIconInformedSport,
    label: "Informed Sport",
    sub: "Certified",
  },
  {
    icon: TrustIconBatchTested,
    label: "Batch Tested",
    sub: "UK lab verified",
  },
  {
    icon: TrustIconCancel,
    label: "Cancel Anytime",
    sub: GUARANTEE_LABEL,
  },
];

export default function LabTrustBadges() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
      {BADGES.map((badge) => (
        <div
          key={badge.label}
          className="flex flex-col items-center text-center gap-2 px-3 py-4 bg-black/[0.03] border border-black/[0.06]"
        >
          <badge.icon className="w-5 h-5 text-black/70" />
          <div>
            <p className="text-xs font-semibold leading-tight text-black">
              {badge.label}
            </p>
            <p className="text-[11px] leading-tight text-black/50 mt-0.5">
              {badge.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
