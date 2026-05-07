import DataReportSection from "@/app/components/insights/DataReportSection";
import DataBarChart from "@/app/components/insights/DataBarChart";
import { APP_INSIGHTS_BY_ID } from "@/app/lib/appInsightsData";

export default function MentalFatigueSection() {
  const report = APP_INSIGHTS_BY_ID["mental-fatigue"];
  if (report.chart.variant !== "bar") return null;

  return (
    <DataReportSection
      report={report}
      chartSlot={<DataBarChart data={report.chart} />}
    />
  );
}
