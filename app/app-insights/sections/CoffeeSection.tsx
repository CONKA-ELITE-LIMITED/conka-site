import DataReportSection from "@/app/components/insights/DataReportSection";
import DataComparisonChart from "@/app/components/insights/DataComparisonChart";
import { APP_INSIGHTS_BY_ID } from "@/app/lib/appInsightsData";

export default function CoffeeSection() {
  const report = APP_INSIGHTS_BY_ID["coffee"];
  if (report.chart.variant !== "comparison") return null;

  return (
    <DataReportSection
      report={report}
      chartSlot={<DataComparisonChart data={report.chart} />}
    />
  );
}
