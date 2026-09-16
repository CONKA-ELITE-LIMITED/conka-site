import Link from "next/link";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";

/* ============================================================================
 * AppV2Download (SCRUM-1361, Simple DTC)
 *
 * The close. Download is the page's first job, so it gets the last word; the
 * CONKA link underneath is for the visitor who is sold on the loop but has no
 * product yet. Store clicks report as `download`. Content-only; the page owns
 * the section.
 * ========================================================================== */

export default function AppV2Download() {
  return (
    <div className="flex flex-col items-center text-center">
      <h2
        className="brand-h2 mb-3 max-w-[22ch] text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        Start with your baseline.
      </h2>
      <p className="mb-7 text-lg leading-relaxed text-black/75">
        Free on iOS and Android. No subscription needed.
      </p>
      <AppInstallButtons
        variant="dtc"
        trackLocation="download"
        buttonClassName="min-h-[44px]"
        className="justify-center"
      />
      <Link
        href="/conka-both"
        className="mt-4 inline-flex min-h-[44px] items-center text-base font-semibold text-[var(--brand-navy)] underline underline-offset-4"
      >
        New to CONKA? Explore Flow and Clear
      </Link>
    </div>
  );
}
