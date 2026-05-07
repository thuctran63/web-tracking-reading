import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isAfter,
  parseISO,
  startOfDay,
  startOfMonth,
} from "date-fns";

import { buildHeatmapDays } from "@/lib/report-utils";
import { DailyReportResponse } from "@/types/report";

type ReadingHeatmapProps = {
  reports: DailyReportResponse[];
  year: number;
  className?: string;
};

function dayClass(didRead: boolean, hasReport: boolean) {
  if (didRead && hasReport) return "bg-emerald-500";
  return "bg-red-400";
}

export function ReadingHeatmap({ reports, year, className = "" }: ReadingHeatmapProps) {
  const days = buildHeatmapDays(reports, year);
  const dayMap = new Map(days.map((day) => [day.date, day]));
  const monthIndexes = Array.from({ length: 12 }, (_, index) => index);
  const today = startOfDay(new Date());

  return (
    <section
      className={`flex min-h-0 flex-col rounded-xl border border-indigo-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${className}`}
    >
      <h2 className="text-lg font-semibold text-zinc-900">Calendar theo dõi đọc sách</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Xanh: đã đọc, đỏ: chưa đọc, xám: ngày tương lai.
      </p>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {monthIndexes.map((month) => {
          const monthStart = startOfMonth(new Date(year, month, 1));
          const monthEnd = endOfMonth(monthStart);
          const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
          const leadingBlanks = getDay(monthStart);

          return (
            <div key={month} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-3">
              <h3 className="mb-1.5 text-sm font-semibold text-zinc-800">
                {format(monthStart, "MMMM")}
              </h3>
              <div className="grid grid-cols-7 gap-1 text-[10px] text-zinc-500">
                <span>CN</span>
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {Array.from({ length: leadingBlanks }).map((_, idx) => (
                  <div key={`blank-${month}-${idx}`} className="h-4 w-4" />
                ))}
                {monthDays.map((day) => {
                  const key = format(day, "yyyy-MM-dd");
                  const entry = dayMap.get(key);
                  return (
                    <div
                      key={key}
                      title={`${key} - ${entry?.hasReport ? (entry.didRead ? "Đã đọc" : "Không đọc") : "Không report"}`}
                      className={`h-4 w-4 rounded-[4px] ${
                        isAfter(day, today)
                          ? "bg-zinc-300"
                          : dayClass(entry?.didRead ?? false, entry?.hasReport ?? false)
                      }`}
                      aria-label={key}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-600">
        <span>{format(parseISO(`${year}-01-01`), "yyyy")}</span>
        <span className="inline-flex items-center gap-1">
          <i className="h-3 w-3 rounded-[3px] bg-emerald-500" />
          Đã đọc
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="h-3 w-3 rounded-[3px] bg-red-400" />
          Chưa đọc / missed
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="h-3 w-3 rounded-[3px] bg-zinc-300" />
          Tương lai
        </span>
      </div>
    </section>
  );
}
