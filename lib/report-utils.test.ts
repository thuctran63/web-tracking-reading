import { describe, expect, it } from "vitest";

import { buildHeatmapDays, computeReadingStats } from "./report-utils";
import { DailyReportResponse } from "../types/report";

describe("buildHeatmapDays", () => {
  it("marks missing days as not read and no report", () => {
    const reports: DailyReportResponse[] = [
      {
        id: "1",
        date: "2026-01-02",
        didRead: true,
        booksRead: "Book A",
        learnings: "",
        difficulties: "",
        questions: "",
      },
    ];

    const days = buildHeatmapDays(reports, 2026);
    const janFirst = days.find((day) => day.date === "2026-01-01");
    const janSecond = days.find((day) => day.date === "2026-01-02");

    expect(janFirst).toEqual({
      date: "2026-01-01",
      didRead: false,
      hasReport: false,
    });
    expect(janSecond).toEqual({
      date: "2026-01-02",
      didRead: true,
      hasReport: true,
    });
  });
});

describe("computeReadingStats", () => {
  it("computes read days and streak correctly", () => {
    const reports: DailyReportResponse[] = [
      {
        id: "1",
        date: "2026-01-01",
        didRead: true,
        booksRead: "",
        learnings: "",
        difficulties: "",
        questions: "",
      },
      {
        id: "2",
        date: "2026-01-02",
        didRead: true,
        booksRead: "",
        learnings: "",
        difficulties: "",
        questions: "",
      },
      {
        id: "3",
        date: "2026-01-05",
        didRead: false,
        booksRead: "",
        learnings: "",
        difficulties: "",
        questions: "",
      },
    ];

    const stats = computeReadingStats(reports);

    expect(stats).toEqual({
      totalReports: 3,
      readDays: 2,
      readingRate: 67,
      bestStreak: 2,
    });
  });
});
