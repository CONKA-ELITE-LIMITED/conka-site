import DataReportSection from "@/app/components/insights/DataReportSection";
import DataLineChart from "@/app/components/insights/DataLineChart";
import { APP_INSIGHTS_BY_ID } from "@/app/lib/appInsightsData";

export default function TimeOfDaySection() {
  const report = APP_INSIGHTS_BY_ID["time-of-day"];
  if (report.chart.variant !== "line") return null;

  return (
    <DataReportSection
      report={report}
      chartSlot={<DataLineChart data={report.chart} />}
    />
  );
}
