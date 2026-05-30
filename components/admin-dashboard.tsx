"use client";

import {
  AlertCircle,
  BookOpenCheck,
  ChevronRight,
  Flame,
  Loader2,
  RefreshCw,
  ScrollText,
  Search,
  TrendingUp,
  UserSearch,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ReadingHeatmap } from "@/components/reading-heatmap";
import { ReportList } from "@/components/report-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/ui/stat-card";
import {
  avatarGradient,
  avatarGradientSoft,
  avatarInitial,
} from "@/lib/avatar";
import { cn } from "@/lib/cn";
import { computeReadingStats } from "@/lib/report-utils";
import { AdminUserOption, DailyReportResponse } from "@/types/report";

type AdminDashboardProps = {
  initialUsers: AdminUserOption[];
  year: number;
};

type ReportsState =
  | { kind: "idle" }
  | { kind: "loading"; userId: string }
  | { kind: "loaded"; userId: string; reports: DailyReportResponse[] }
  | { kind: "error"; userId: string; message: string };

export function AdminDashboard({ initialUsers, year }: AdminDashboardProps) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<AdminUserOption[]>(initialUsers);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    initialUsers[0]?.id ?? null,
  );
  const [reportsState, setReportsState] = useState<ReportsState>({ kind: "idle" });

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsLoadingUsers(true);
      setUsersError(null);
      try {
        const response = await fetch(
          `/api/admin/users?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          setUsersError(
            response.status === 403
              ? "Bạn không có quyền xem danh sách user."
              : "Không tải được danh sách user.",
          );
          setIsLoadingUsers(false);
          return;
        }
        const data = (await response.json()) as { users?: AdminUserOption[] };
        setUsers(data.users ?? []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setUsersError("Lỗi mạng khi tải danh sách user.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingUsers(false);
        }
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const selectedUser = useMemo(() => {
    if (!selectedUserId) return null;
    return users.find((user) => user.id === selectedUserId) ?? null;
  }, [users, selectedUserId]);

  const loadReports = useCallback(
    async (userId: string, signal?: AbortSignal) => {
      try {
        const response = await fetch(
          `/api/admin/reports?userId=${encodeURIComponent(userId)}&year=${year}`,
          { signal },
        );
        if (signal?.aborted) return;
        if (!response.ok) {
          setReportsState({
            kind: "error",
            userId,
            message:
              response.status === 403
                ? "Không có quyền xem report của user này."
                : "Không tải được report.",
          });
          return;
        }
        const data = (await response.json()) as {
          reports?: DailyReportResponse[];
        };
        if (signal?.aborted) return;
        setReportsState({
          kind: "loaded",
          userId,
          reports: data.reports ?? [],
        });
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setReportsState({
          kind: "error",
          userId,
          message: "Lỗi mạng khi tải report.",
        });
      }
    },
    [year],
  );

  useEffect(() => {
    if (!selectedUserId) return;
    const controller = new AbortController();
    void Promise.resolve().then(() => {
      if (controller.signal.aborted) return;
      void loadReports(selectedUserId, controller.signal);
    });
    return () => controller.abort();
  }, [selectedUserId, loadReports]);

  const currentState: ReportsState = useMemo(() => {
    if (!selectedUserId || reportsState.kind === "idle") {
      return { kind: "idle" };
    }
    if (reportsState.userId === selectedUserId) {
      return reportsState;
    }
    return { kind: "loading", userId: selectedUserId };
  }, [selectedUserId, reportsState]);

  const reports = useMemo(
    () => (currentState.kind === "loaded" ? currentState.reports : []),
    [currentState],
  );
  const stats = useMemo(() => computeReadingStats(reports), [reports]);
  const isLoadingReports = currentState.kind === "loading";
  const hasLoadedReports = currentState.kind === "loaded";
  const reportsError =
    currentState.kind === "error" ? currentState.message : null;

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
      <UsersSidebar
        users={users}
        isLoading={isLoadingUsers}
        error={usersError}
        query={query}
        onQueryChange={setQuery}
        selectedUserId={selectedUserId}
        onSelect={(id) => setSelectedUserId(id)}
      />

      <div className="min-w-0 space-y-5">
        {!selectedUser ? (
          <Card className="flex min-h-[480px] items-center justify-center">
            <EmptyState
              icon={UserSearch}
              title="Chọn 1 user để bắt đầu"
              description="Tìm và click vào 1 user ở danh sách bên trái để xem tiến độ đọc sách."
            />
          </Card>
        ) : (
          <>
            <UserHero
              email={selectedUser.email}
              year={year}
              onRefresh={() => void loadReports(selectedUser.id)}
              isLoading={isLoadingReports}
            />

            {reportsError ? (
              <div className="flex items-start justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{reportsError}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void loadReports(selectedUser.id)}
                  loading={isLoadingReports}
                >
                  Thử lại
                </Button>
              </div>
            ) : null}

            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard
                label="Tổng report"
                value={hasLoadedReports ? stats.totalReports : "—"}
                icon={ScrollText}
                tone="indigo"
              />
              <StatCard
                label="Ngày có đọc"
                value={hasLoadedReports ? stats.readDays : "—"}
                icon={BookOpenCheck}
                tone="emerald"
              />
              <StatCard
                label="Tỉ lệ đọc"
                value={hasLoadedReports ? `${stats.readingRate}%` : "—"}
                icon={TrendingUp}
                tone="sky"
                footer={
                  hasLoadedReports ? (
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-sky-500 transition-[width]"
                        style={{ width: `${stats.readingRate}%` }}
                      />
                    </div>
                  ) : null
                }
              />
              <StatCard
                label="Best streak"
                value={hasLoadedReports ? stats.bestStreak : "—"}
                icon={Flame}
                tone="amber"
              />
            </section>

            {isLoadingReports && !hasLoadedReports ? (
              <Card className="flex min-h-[300px] items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tải report của {selectedUser.email}...
                </div>
              </Card>
            ) : (
              <>
                <ReadingHeatmap reports={reports} year={year} />
                <ReportList
                  reports={reports}
                  title={`Report của ${selectedUser.email}`}
                  description="Bấm vào 1 ngày để xem chi tiết."
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function UserHero({
  email,
  year,
  onRefresh,
  isLoading,
}: {
  email: string;
  year: number;
  onRefresh: () => void;
  isLoading: boolean;
}) {
  const gradient = avatarGradient(email);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="bg-radial-accent pointer-events-none absolute inset-0" />
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-base font-semibold text-white shadow-sm ring-1 ring-black/5",
              gradient,
            )}
            aria-hidden
          >
            {avatarInitial(email)}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-500">
              Đang xem
            </p>
            <h2 className="mt-0.5 truncate text-lg font-bold text-slate-900">
              {email}
            </h2>
            <p className="text-xs text-slate-500">Tiến độ năm {year}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          loading={isLoading}
          title="Tải lại dữ liệu"
          aria-label="Tải lại"
        >
          {!isLoading ? <RefreshCw className="h-4 w-4" /> : null}
        </Button>
      </div>
    </div>
  );
}

function UsersSidebar({
  users,
  isLoading,
  error,
  query,
  onQueryChange,
  selectedUserId,
  onSelect,
}: {
  users: AdminUserOption[];
  isLoading: boolean;
  error: string | null;
  query: string;
  onQueryChange: (value: string) => void;
  selectedUserId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="flex h-fit flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-20 lg:max-h-[calc(100vh-104px)]">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 ring-1 ring-indigo-200">
            <Users className="h-3.5 w-3.5" />
          </span>
          <h3 className="text-sm font-semibold text-slate-900">Người dùng</h3>
        </div>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 tabular-nums">
          {users.length}
        </span>
      </div>

      <div className="px-3 pb-2 pt-3">
        <Input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Tìm theo email..."
          leftIcon={<Search className="h-4 w-4" />}
          rightSlot={
            isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            ) : query ? (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                aria-label="Xoá tìm kiếm"
                className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 sm:inline-flex">
                {query.length === 0 ? "↵" : ""}
              </kbd>
            )
          }
        />
      </div>

      <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {query.trim() ? "Kết quả" : "Tất cả"}{users.length > 0 ? ` (${users.length})` : ""}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {error ? (
          <div className="mx-1 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : isLoading && users.length === 0 ? (
          <UserItemSkeleton count={3} />
        ) : users.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-slate-500">
            Không tìm thấy user phù hợp.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {users.map((user) => (
              <UserItem
                key={user.id}
                user={user}
                active={selectedUserId === user.id}
                onClick={() => onSelect(user.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

function UserItem({
  user,
  active,
  onClick,
}: {
  user: AdminUserOption;
  active: boolean;
  onClick: () => void;
}) {
  const email = user.email ?? "unknown-user";
  const gradientStrong = avatarGradient(email);
  const gradientSoft = avatarGradientSoft(email);
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          "group relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2 pl-3 text-left transition-all",
          active
            ? "bg-indigo-50/80 ring-1 ring-indigo-200 shadow-sm"
            : "hover:bg-slate-50",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-indigo-500 transition-opacity",
            active ? "opacity-100" : "opacity-0",
          )}
        />
        <span
          aria-hidden
          className={cn(
            "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold text-white shadow-sm",
            "bg-gradient-to-br",
            active ? gradientStrong : gradientSoft,
            active ? "" : "text-slate-700",
          )}
        >
          {avatarInitial(email)}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm",
              active
                ? "font-semibold text-indigo-900"
                : "font-medium text-slate-800",
            )}
          >
            {email}
          </p>
          <p className="truncate text-[11px] text-slate-500">
            {active ? "Đang xem tiến độ" : "Bấm để xem tiến độ"}
          </p>
        </div>
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 transition-all",
            active
              ? "text-indigo-500 opacity-100"
              : "text-slate-300 opacity-0 group-hover:opacity-100",
          )}
        />
      </button>
    </li>
  );
}

function UserItemSkeleton({ count }: { count: number }) {
  return (
    <ul className="space-y-0.5">
      {Array.from({ length: count }).map((_, idx) => (
        <li
          key={idx}
          className="flex items-center gap-3 rounded-xl px-2.5 py-2"
        >
          <span className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-slate-200" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <span className="block h-3 w-3/4 animate-pulse rounded bg-slate-200" />
            <span className="block h-2.5 w-1/2 animate-pulse rounded bg-slate-100" />
          </div>
        </li>
      ))}
    </ul>
  );
}
