"use client";

import { useEffect, useMemo, useState } from "react";

import { ReadingHeatmap } from "@/components/reading-heatmap";
import { ReportList } from "@/components/report-list";
import { computeReadingStats } from "@/lib/report-utils";
import { AdminUserOption, DailyReportResponse } from "@/types/report";

type AdminDashboardProps = {
  initialUsers: AdminUserOption[];
  year: number;
};

export function AdminDashboard({ initialUsers, year }: AdminDashboardProps) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<AdminUserOption[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<AdminUserOption | null>(
    initialUsers[0] ?? null,
  );
  const [loadedUser, setLoadedUser] = useState<AdminUserOption | null>(null);
  const [reports, setReports] = useState<DailyReportResponse[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoadingUsers(true);
      const response = await fetch(`/api/admin/users?q=${encodeURIComponent(query)}`);
      const data = (await response.json()) as { users?: AdminUserOption[] };
      if (response.ok) {
        const foundUsers = data.users ?? [];
        setUsers(foundUsers);
        if (
          !selectedUser ||
          !foundUsers.some((user) => user.id === selectedUser.id)
        ) {
          setSelectedUser(foundUsers[0] ?? null);
        }
      }
      setIsLoadingUsers(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query, selectedUser]);

  async function handleLoadReports() {
    if (!selectedUser) {
      setReports([]);
      setLoadedUser(null);
      return;
    }

    setIsLoadingReports(true);
    const response = await fetch(
      `/api/admin/reports?userId=${encodeURIComponent(selectedUser.id)}&year=${year}`,
    );
    const data = (await response.json()) as { reports?: DailyReportResponse[] };
    if (response.ok) {
      setReports(data.reports ?? []);
      setLoadedUser(selectedUser);
    } else {
      setReports([]);
      setLoadedUser(null);
    }
    setIsLoadingReports(false);
  }

  const stats = useMemo(() => computeReadingStats(reports), [reports]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden">
      <nav className="mb-4 flex shrink-0 items-center gap-2 rounded-xl border border-indigo-100 bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <span className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white">
          Dashboard
        </span>
        <span className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500">Users</span>
        <span className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500">Reports</span>
      </nav>

      <section className="mb-4 shrink-0 rounded-xl border border-indigo-100 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] md:p-5">
        <p className="mb-2 text-sm font-medium text-zinc-700">Tìm user cần theo dõi</p>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Nhập email để tìm user..."
          className="mb-3 w-full rounded-xl border border-indigo-200 px-4 py-2.5 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2"
        />
        {isLoadingUsers ? (
          <p className="text-sm text-zinc-500">Đang tìm user...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-zinc-500">Không tìm thấy user phù hợp.</p>
        ) : (
          <div className="mb-3 max-h-40 overflow-y-auto rounded-xl border border-indigo-100">
            {users.map((user) => {
              const active = selectedUser?.id === user.id;
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    setSelectedUser(user);
                    setQuery(user.email ?? "");
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
                    active ? "bg-indigo-50 text-indigo-700" : "text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <span>{user.email ?? "unknown-user"}</span>
                  {active ? <span className="text-xs font-medium">Đã chọn</span> : null}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void handleLoadReports()}
            disabled={!selectedUser || isLoadingReports}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {isLoadingReports ? "Đang load..." : "Load thông tin"}
          </button>
          <p className="text-sm text-zinc-500">
            {loadedUser
              ? `Đang hiển thị dữ liệu: ${loadedUser.email ?? "unknown-user"}`
              : "Chọn user rồi bấm Load thông tin để xem dữ liệu."}
          </p>
        </div>
      </section>

      <section className="mb-4 shrink-0 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-zinc-500">Tổng report</p>
            <span>📝</span>
          </div>
          <p className="text-xl font-semibold text-zinc-900">{loadedUser ? stats.totalReports : "-"}</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-zinc-500">Số ngày có đọc</p>
            <span>📗</span>
          </div>
          <p className="text-xl font-semibold text-zinc-900">{loadedUser ? stats.readDays : "-"}</p>
        </div>
        <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-zinc-500">Tỉ lệ đọc</p>
            <span>📊</span>
          </div>
          <p className="text-xl font-semibold text-zinc-900">
            {loadedUser ? `${stats.readingRate}%` : "-"}
          </p>
        </div>
        <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-zinc-500">Best streak</p>
            <span>🔥</span>
          </div>
          <p className="text-xl font-semibold text-zinc-900">{loadedUser ? stats.bestStreak : "-"}</p>
        </div>
      </section>

      {isLoadingReports ? (
        <section className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
          Đang tải dữ liệu đọc sách...
        </section>
      ) : (
        <div className="min-h-0 flex-1 grid gap-4 overflow-hidden lg:grid-cols-[1.6fr_1fr]">
          <ReadingHeatmap
            reports={reports}
            year={year}
            className="h-full min-h-0 overflow-hidden"
          />
          <div className="min-h-[400px] lg:sticky lg:top-4 lg:self-start">
            <ReportList
              reports={reports}
              title={`Report của ${loadedUser?.email ?? "user"}`}
              className="h-full min-h-[400px] overflow-hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
}
