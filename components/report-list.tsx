"use client";

import { format, parseISO } from "date-fns";
import {
  AlertTriangle,
  BookOpenCheck,
  CalendarDays,
  ChevronRight,
  HelpCircle,
  Layers,
  Lightbulb,
  Library,
  Search,
  XCircle,
} from "lucide-react";
import { ReactNode, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/cn";
import { DailyReportResponse } from "@/types/report";

type ReportListProps = {
  reports: DailyReportResponse[];
  title?: string;
  description?: string;
  className?: string;
};

type Filter = "all" | "read" | "skipped";

export function ReportList({
  reports,
  title = "Danh sách report",
  description = "Bấm vào report để xem chi tiết.",
  className = "",
}: ReportListProps) {
  const [selectedReport, setSelectedReport] = useState<DailyReportResponse | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const sortedReports = useMemo(
    () =>
      [...reports].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    [reports],
  );

  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return sortedReports.filter((report) => {
      if (filter === "read" && !report.didRead) return false;
      if (filter === "skipped" && report.didRead) return false;
      if (!normalizedQuery) return true;
      const haystack = [
        report.date,
        report.booksRead,
        report.learnings,
        report.difficulties,
        report.questions,
      ]
        .join("\n")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [sortedReports, filter, query]);

  return (
    <Card className={cn("flex min-h-[420px] flex-col", className)} as="section">
      <CardHeader
        action={
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {filteredReports.length}/{reports.length} report
          </span>
        }
      >
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <div className="border-b border-slate-100 px-5 py-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo ngày, sách, nội dung..."
            leftIcon={<Search className="h-4 w-4" />}
            className="min-w-[200px] flex-1"
          />
          <div className="inline-flex shrink-0 items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
            <FilterChip
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label="Tất cả"
              icon={<Layers className="h-3.5 w-3.5" />}
            />
            <FilterChip
              active={filter === "read"}
              onClick={() => setFilter("read")}
              label="Đã đọc"
              icon={<BookOpenCheck className="h-3.5 w-3.5" />}
            />
            <FilterChip
              active={filter === "skipped"}
              onClick={() => setFilter("skipped")}
              label="Nghỉ"
              icon={<XCircle className="h-3.5 w-3.5" />}
            />
          </div>
        </div>
      </div>

      <CardContent className="min-h-0 flex-1 overflow-y-auto p-0">
        {filteredReports.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={CalendarDays}
              title={
                reports.length === 0
                  ? "Chưa có report nào"
                  : "Không tìm thấy report phù hợp"
              }
              description={
                reports.length === 0
                  ? "Tạo report đầu tiên ở form bên cạnh để bắt đầu theo dõi."
                  : "Thử đổi filter hoặc xoá từ khoá tìm kiếm."
              }
            />
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredReports.map((report) => (
              <li key={report.id}>
                <button
                  type="button"
                  onClick={() => setSelectedReport(report)}
                  className="group flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-slate-50"
                >
                  <DatePill date={report.date} didRead={report.didRead} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {report.booksRead?.trim() ||
                          (report.didRead ? "Đã đọc — chưa ghi sách" : "Hôm nay nghỉ")}
                      </p>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {report.learnings?.trim() ||
                        (report.didRead
                          ? "Chưa ghi insight cho ngày này."
                          : "Không có ghi chú.")}
                    </p>
                  </div>
                  <Badge tone={report.didRead ? "emerald" : "slate"}>
                    {report.didRead ? (
                      <>
                        <BookOpenCheck className="h-3 w-3" />
                        Đã đọc
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        Nghỉ
                      </>
                    )}
                  </Badge>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-slate-500" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <Modal
        open={selectedReport !== null}
        onClose={() => setSelectedReport(null)}
        title={
          selectedReport ? `Report ngày ${selectedReport.date}` : undefined
        }
        description={
          selectedReport ? (
            <span className="inline-flex items-center gap-2">
              <Badge tone={selectedReport.didRead ? "emerald" : "slate"}>
                {selectedReport.didRead ? "Đã đọc" : "Nghỉ"}
              </Badge>
              <span className="text-slate-500">
                {format(parseISO(selectedReport.date), "EEEE, dd MMMM yyyy")}
              </span>
            </span>
          ) : undefined
        }
      >
        {selectedReport ? (
          <div className="space-y-5">
            <DetailSection
              icon={<Library className="h-4 w-4" />}
              label="Sách đã đọc"
              text={selectedReport.booksRead}
            />
            <DetailSection
              icon={<Lightbulb className="h-4 w-4" />}
              label="Điều học được"
              text={selectedReport.learnings}
            />
            <DetailSection
              icon={<AlertTriangle className="h-4 w-4" />}
              label="Khó khăn"
              text={selectedReport.difficulties}
            />
            <DetailSection
              icon={<HelpCircle className="h-4 w-4" />}
              label="Câu hỏi"
              text={selectedReport.questions}
            />
          </div>
        ) : null}
      </Modal>
    </Card>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
          : "text-slate-600 hover:text-slate-900",
      )}
    >
      {icon ? <span aria-hidden>{icon}</span> : null}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function DatePill({ date, didRead }: { date: string; didRead: boolean }) {
  const parsed = parseISO(date);
  return (
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl text-center ring-1",
        didRead
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-slate-100 text-slate-600 ring-slate-200",
      )}
    >
      <span className="text-[10px] font-medium uppercase tracking-wide opacity-70">
        {format(parsed, "MMM")}
      </span>
      <span className="text-base font-bold leading-none tabular-nums">
        {format(parsed, "dd")}
      </span>
    </div>
  );
}

function DetailSection({
  icon,
  label,
  text,
}: {
  icon: ReactNode;
  label: string;
  text: string;
}) {
  const content = text?.trim();
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
        <span className="text-indigo-500">{icon}</span>
        {label}
      </p>
      <p className="mt-1.5 whitespace-pre-wrap text-sm text-slate-800">
        {content || (
          <span className="italic text-slate-400">Chưa ghi nội dung.</span>
        )}
      </p>
    </div>
  );
}
