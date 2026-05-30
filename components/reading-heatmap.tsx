import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isAfter,
  startOfDay,
  startOfMonth,
} from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buildHeatmapDays } from "@/lib/report-utils";
import { cn } from "@/lib/cn";
import { DailyReportResponse } from "@/types/report";

type ReadingHeatmapProps = {
  reports: DailyReportResponse[];
  year: number;
  className?: string;
};

const MONTH_LABELS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const WEEKDAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function dayClass(
  isFuture: boolean,
  hasReport: boolean,
  didRead: boolean,
): string {
  if (isFuture) {
    return "bg-white border border-dashed border-slate-300";
  }
  if (!hasReport) {
    return "bg-slate-200";
  }
  if (didRead) {
    return "bg-emerald-500";
  }
  return "bg-rose-300";
}

function tooltipFor(
  date: string,
  isFuture: boolean,
  hasReport: boolean,
  didRead: boolean,
  booksRead?: string,
) {
  if (isFuture) return `${date} • Ngày tương lai`;
  if (!hasReport) return `${date} • Chưa có report`;
  if (didRead) {
    const books = booksRead?.trim();
    return books ? `${date} • Đã đọc: ${books}` : `${date} • Đã đọc`;
  }
  return `${date} • Hôm này nghỉ`;
}

export function ReadingHeatmap({
  reports,
  year,
  className = "",
}: ReadingHeatmapProps) {
  const days = buildHeatmapDays(reports, year);
  const reportMap = new Map(reports.map((report) => [report.date, report]));
  const dayMap = new Map(days.map((day) => [day.date, day]));
  const monthIndexes = Array.from({ length: 12 }, (_, index) => index);
  const today = startOfDay(new Date());

  const totalReports = reports.length;
  const readDays = reports.filter((report) => report.didRead).length;

  return (
    <Card className={cn("flex min-h-[420px] flex-col", className)} as="section">
      <CardHeader
        action={
          <span className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 sm:inline-flex">
            <span className="tabular-nums">{readDays}</span>
            <span className="text-slate-400">/</span>
            <span className="tabular-nums">{totalReports}</span>
            <span>đã đọc</span>
          </span>
        }
      >
        <CardTitle>Calendar đọc sách năm {year}</CardTitle>
        <CardDescription>
          Mỗi ô là 1 ngày — hover để xem chi tiết.
        </CardDescription>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {monthIndexes.map((month) => {
            const monthStart = startOfMonth(new Date(year, month, 1));
            const monthEnd = endOfMonth(monthStart);
            const monthDays = eachDayOfInterval({
              start: monthStart,
              end: monthEnd,
            });
            const leadingBlanks = getDay(monthStart);
            const monthRead = monthDays.reduce((acc, day) => {
              const entry = dayMap.get(format(day, "yyyy-MM-dd"));
              return acc + (entry?.didRead ? 1 : 0);
            }, 0);

            return (
              <div
                key={month}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-3"
              >
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">
                    {MONTH_LABELS[month]}
                  </h3>
                  <span className="text-[11px] font-medium text-slate-500">
                    {monthRead}/{monthDays.length}
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  {WEEKDAY_LABELS.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-[3px]">
                  {Array.from({ length: leadingBlanks }).map((_, idx) => (
                    <div key={`blank-${month}-${idx}`} className="aspect-square w-full" />
                  ))}
                  {monthDays.map((day) => {
                    const key = format(day, "yyyy-MM-dd");
                    const entry = dayMap.get(key);
                    const isFuture = isAfter(day, today);
                    const hasReport = entry?.hasReport ?? false;
                    const didRead = entry?.didRead ?? false;
                    const report = reportMap.get(key);
                    return (
                      <div
                        key={key}
                        title={tooltipFor(
                          key,
                          isFuture,
                          hasReport,
                          didRead,
                          report?.booksRead,
                        )}
                        className={cn(
                          "heatmap-cell aspect-square w-full",
                          dayClass(isFuture, hasReport, didRead),
                        )}
                        aria-label={key}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 px-5 py-3 text-xs text-slate-600">
        <LegendItem className="bg-emerald-500" label="Đã đọc" />
        <LegendItem className="bg-rose-300" label="Nghỉ" />
        <LegendItem className="bg-slate-200" label="Không report" />
        <LegendItem
          className="bg-white border border-dashed border-slate-300"
          label="Tương lai"
        />
      </div>
    </Card>
  );
}

function LegendItem({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <i className={cn("h-3 w-3 rounded-[3px]", className)} />
      {label}
    </span>
  );
}
