"use client";

import { useState } from "react";

import { DailyReportResponse } from "@/types/report";

type ReportListProps = {
  reports: DailyReportResponse[];
  title?: string;
  className?: string;
};

export function ReportList({
  reports,
  title = "Danh sách report hằng ngày",
  className = "",
}: ReportListProps) {
  const [selectedReport, setSelectedReport] = useState<DailyReportResponse | null>(null);

  return (
    <section
      className={`flex min-h-[400px] flex-col rounded-xl border border-indigo-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${className}`}
    >
      <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
      <p className="mt-1 text-sm text-zinc-500">Bấm vào report để xem chi tiết.</p>

      <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {reports.length === 0 ? (
          <p className="text-sm text-zinc-500">Chưa có report nào.</p>
        ) : (
          reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-left hover:bg-zinc-50"
            >
              <span className="text-sm font-medium text-zinc-800">{report.date}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  report.didRead
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-zinc-200 text-zinc-700"
                }`}
              >
                {report.didRead ? "Đã đọc" : "Không đọc"}
              </span>
            </button>
          ))
        )}
      </div>

      {selectedReport ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">
                  Report ngày {selectedReport.date}
                </h3>
                <p className="text-sm text-zinc-500">
                  Trạng thái: {selectedReport.didRead ? "Đã đọc" : "Không đọc"}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-50"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-4 text-sm text-zinc-800">
              <div>
                <p className="font-semibold text-zinc-900">Hôm nay đã đọc những cuốn sách gì?</p>
                <p className="mt-1 whitespace-pre-wrap">{selectedReport.booksRead || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-zinc-900">Những điều đã đọc và học được</p>
                <p className="mt-1 whitespace-pre-wrap">{selectedReport.learnings || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-zinc-900">Những khó khăn trong quá trình đọc</p>
                <p className="mt-1 whitespace-pre-wrap">{selectedReport.difficulties || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-zinc-900">Các câu hỏi trong quá trình đọc</p>
                <p className="mt-1 whitespace-pre-wrap">{selectedReport.questions || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
