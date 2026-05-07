import { format } from "date-fns";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/admin-dashboard";
import { LogoutButton } from "@/components/logout-button";
import { ReadingHeatmap } from "@/components/reading-heatmap";
import { ReportForm } from "@/components/report-form";
import { ReportList } from "@/components/report-list";
import { connectToDatabase } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import { computeReadingStats } from "@/lib/report-utils";
import { DailyReport } from "@/models/DailyReport";
import { User } from "@/models/User";
import { DailyReportResponse } from "@/types/report";

function mapReport(report: {
  _id: string;
  date: Date;
  didRead: boolean;
  booksRead: string;
  learnings: string;
  difficulties: string;
  questions: string;
}): DailyReportResponse {
  return {
    id: report._id.toString(),
    date: report.date.toISOString().slice(0, 10),
    didRead: report.didRead,
    booksRead: report.booksRead,
    learnings: report.learnings,
    difficulties: report.difficulties,
    questions: report.questions,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const year = new Date().getFullYear();
  const from = new Date(Date.UTC(year, 0, 1));
  const to = new Date(Date.UTC(year + 1, 0, 1));
  const today = format(new Date(), "yyyy-MM-dd");

  await connectToDatabase();

  if (session.user.role === "admin") {
    const users = await User.find({ role: { $ne: "admin" } }, { email: 1 })
      .sort({ email: 1 })
      .lean();

    return (
      <main className="min-h-screen overflow-x-hidden bg-slate-50 px-3 py-4 md:px-6 md:py-5">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col">
          <header className="mb-4 shrink-0 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-900">Admin Dashboard</h1>
              <p className="text-sm text-zinc-600">Xem tiến độ đọc theo từng user</p>
            </div>
            <LogoutButton />
          </header>
          <div className="min-h-0 flex-1 overflow-x-hidden">
            <AdminDashboard
              year={year}
              initialUsers={users.map((user) => ({
                id: user._id.toString(),
                email: user.email,
              }))}
            />
          </div>
        </div>
      </main>
    );
  }

  const targetUserId = session.user.id;
  const targetUserLabel = session.user.email ?? session.user.id;
  const reportsRaw = await DailyReport.find({
    userId: targetUserId,
    date: { $gte: from, $lt: to },
  })
    .sort({ date: 1 })
    .lean();
  const reports = reportsRaw.map(mapReport);
  const todayReport = reports.find((report) => report.date === today);
  const stats = computeReadingStats(reports);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 px-3 py-4 md:px-6 md:py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Reading Progress Dashboard</h1>
            <p className="text-sm text-zinc-600">{targetUserLabel}</p>
          </div>
          <LogoutButton />
        </header>

        <section className="mb-6 grid gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">Tổng report</p>
            <p className="text-xl font-semibold text-zinc-900">{stats.totalReports}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">Số ngày có đọc</p>
            <p className="text-xl font-semibold text-zinc-900">{stats.readDays}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">Tỉ lệ đọc</p>
            <p className="text-xl font-semibold text-zinc-900">{stats.readingRate}%</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">Best streak</p>
            <p className="text-xl font-semibold text-zinc-900">{stats.bestStreak}</p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <ReportForm initialReport={todayReport} />
          <ReadingHeatmap reports={reports} year={year} />
        </div>
        <div className="mt-6">
          <ReportList reports={reports} />
        </div>
      </div>
    </main>
  );
}
