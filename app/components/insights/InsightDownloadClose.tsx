import { AppInstallButtons } from "@/app/components/AppInstallButtons";

/* ============================================================================
 * InsightDownloadClose (SCRUM-1522, Simple DTC)
 *
 * The /app close pattern, framed for this page: the reader has just seen
 * 712 people's data, so the ask is to see their own. Store buttons carry no
 * trackLocation on purpose: that would report into the /app funnel
 * (`app:store_clicked`). Content-only.
 * ========================================================================== */

export default function InsightDownloadClose() {
  return (
    <div className="flex flex-col items-center text-center">
      <h2
        className="brand-h1 mb-4 max-w-[20ch] text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        Now see what moves your score.
      </h2>
      <p className="mb-7 max-w-[44ch] text-lg leading-relaxed text-black/80 lg:text-xl">
        Everything above is our users&apos; data. The free CONKA app runs the
        same 90-second test on you, measured against your own baseline from
        day one.
      </p>
      <AppInstallButtons
        variant="dtc"
        buttonClassName="min-h-[44px]"
        className="justify-center"
      />
      <p className="mt-4 text-sm text-black/60">
        Free on iOS and Android. No subscription needed.
      </p>
    </div>
  );
}
