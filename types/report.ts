export type DailyReportPayload = {
  date: string;
  didRead: boolean;
  booksRead: string;
  learnings: string;
  difficulties: string;
  questions: string;
};

export type DailyReportResponse = DailyReportPayload & {
  id: string;
};

export type HeatmapDay = {
  date: string;
  didRead: boolean;
  hasReport: boolean;
};

export type ReadingStats = {
  totalReports: number;
  readDays: number;
  readingRate: number;
  bestStreak: number;
};

export type AdminUserOption = {
  id: string;
  email: string;
};
