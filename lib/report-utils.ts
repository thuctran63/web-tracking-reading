import {
  eachDayOfInterval,
  endOfYear,
  format,
  isSameDay,
  parseISO,
  startOfYear,
  subDays,
} from "date-fns";

import { DailyReportResponse, HeatmapDay } from "@/types/report";

function normalizeDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function toDateOnly(dateInput: string) {
  const date = parseISO(dateInput);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date format.");
  }
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function buildHeatmapDays(
  reports: DailyReportResponse[],
  year: number,
): HeatmapDay[] {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(new Date(year, 0, 1));
  const reportMap = new Map(reports.map((report) => [report.date, report]));

  return eachDayOfInterval({ start, end }).map((day) => {
    const date = normalizeDate(day);
    const report = reportMap.get(date);

    return {
      date,
      didRead: report ? report.didRead : false,
      hasReport: Boolean(report),
    };
  });
}

export function computeReadingStats(reports: DailyReportResponse[]) {
  const totalDays = reports.length;
  const readDays = reports.filter((report) => report.didRead).length;
  const rate = totalDays === 0 ? 0 : Math.round((readDays / totalDays) * 100);
  const sortedDates = reports
    .filter((report) => report.didRead)
    .map((report) => parseISO(report.date))
    .sort((a, b) => a.getTime() - b.getTime());

  let bestStreak = 0;
  let current = 0;
  let previous: Date | null = null;

  for (const date of sortedDates) {
    if (!previous || isSameDay(subDays(date, 1), previous)) {
      current += 1;
    } else if (!isSameDay(date, previous)) {
      current = 1;
    }
    previous = date;
    bestStreak = Math.max(bestStreak, current);
  }

  return {
    totalReports: totalDays,
    readDays,
    readingRate: rate,
    bestStreak,
  };
}
