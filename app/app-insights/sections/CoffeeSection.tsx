import DataReportSection from "@/app/components/insights/DataReportSection";
import DataComparisonChart from "@/app/components/insights/DataComparisonChart";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import { APP_INSIGHTS_BY_ID } from "@/app/lib/appInsightsData";

export default function CoffeeSection() {
  const report = APP_INSIGHTS_BY_ID["coffee"];
  if (report.chart.variant !== "comparison") return null;

  return (
    <DataReportSection
      report={report}
      chartSlot={<DataComparisonChart data={report.chart} />}
      // The one report that bridges to a purchase. `insights_coffee` rides
      // the ?src= attribution (docs/development/CART_ATTRIBUTES.md).
      cta={
        <ConkaCTAButton href="/conka-both?src=insights_coffee">
          Try CONKA
        </ConkaCTAButton>
      }
    />
  );
}
