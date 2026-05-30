import { BookOpen, ShieldCheck, User as UserIcon } from "lucide-react";
import { ReactNode } from "react";

import { LogoutButton } from "@/components/logout-button";
import { cn } from "@/lib/cn";

type DashboardShellProps = {
  email: string;
  role: "admin" | "user";
  children: ReactNode;
  title: string;
  subtitle?: string;
  contentClassName?: string;
};

export function DashboardShell({
  email,
  role,
  children,
  title,
  subtitle,
  contentClassName,
}: DashboardShellProps) {
  const isAdmin = role === "admin";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-[0_2px_8px_rgba(212,82,42,0.2)]">
              <BookOpen className="h-5 w-5" />
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">
                Reading Tracker
              </p>
              <p className="text-xs text-slate-500">
                {isAdmin ? "Admin console" : "Theo dõi đọc sách hằng ngày"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className={cn(
                "hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset sm:inline-flex",
                isAdmin
                  ? "bg-violet-50 text-violet-700 ring-violet-200"
                  : "bg-emerald-50 text-emerald-700 ring-emerald-200",
              )}
            >
              {isAdmin ? (
                <ShieldCheck className="h-3.5 w-3.5" />
              ) : (
                <UserIcon className="h-3.5 w-3.5" />
              )}
              {isAdmin ? "Admin" : "User"}
            </span>
            <span className="hidden max-w-[220px] truncate text-sm text-slate-600 md:inline">
              {email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-6 md:py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            ) : null}
          </div>
        </div>
        <div className={cn("min-h-0", contentClassName)}>{children}</div>
      </main>
    </div>
  );
}
