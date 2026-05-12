import { format } from "date-fns";
import { BookOpenCheck, Flame, ScrollText, TrendingUp } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/admin-dashboard";
import { DashboardShell } from "@/components/dashboard-shell";
import { ReadingHeatmap } from "@/components/reading-heatmap";
import { ReportForm } from "@/components/report-form";
import { ReportList } from "@/components/report-list";
import { StatCard } from "@/components/ui/stat-card";
import { connectToDatabase } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import { computeReadingStats } from "@/lib/report-utils";
import { DailyReport } from "@/models/DailyReport";
import { User } from "@/models/User";
import { DailyReportResponse } from "@/types/report";

function mapReport(report: {
  _id: unknown;
  date: Date;
  didRead: boolean;
  booksRead: string;
  learnings: string;
  difficulties: string;
  questions: string;
}): DailyReportResponse {
  return {
    id: String(report._id),
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
      <DashboardShell
        email={session.user.email ?? "admin"}
        role="admin"
        title="Admin Dashboard"
        subtitle="Xem tiến độ đọc sách của từng user trong năm."
      >
        <AdminDashboard
          year={year}
          initialUsers={users.map((user) => ({
            id: String(user._id),
            email: user.email,
          }))}
        />
      </DashboardShell>
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
    <DashboardShell
      email={targetUserLabel}
      role="user"
      title={`Chào, ${targetUserLabel}`}
      subtitle={`Tiến độ đọc sách năm ${year}. Hôm nay là ${format(new Date(), "EEEE, dd/MM/yyyy")}.`}
    >
      <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng report"
          value={stats.totalReports}
          icon={ScrollText}
          tone="indigo"
          hint="Số ngày đã có entry"
        />
        <StatCard
          label="Số ngày có đọc"
          value={stats.readDays}
          icon={BookOpenCheck}
          tone="emerald"
          hint="Tính trong các ngày có report"
        />
        <StatCard
          label="Tỉ lệ đọc"
          value={`${stats.readingRate}%`}
          icon={TrendingUp}
          tone="sky"
          footer={
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-sky-500 transition-[width]"
                style={{ width: `${stats.readingRate}%` }}
              />
            </div>
          }
        />
        <StatCard
          label="Best streak"
          value={stats.bestStreak}
          icon={Flame}
          tone="amber"
          hint="Chuỗi ngày đọc dài nhất"
        />
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <ReportForm initialReport={todayReport} />
        <ReadingHeatmap reports={reports} year={year} />
      </div>
      <div className="mt-5">
        <ReportList reports={reports} />
      </div>
    </DashboardShell>
  );
}
