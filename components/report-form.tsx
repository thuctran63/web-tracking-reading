"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Library,
  Lightbulb,
  Save,
  Sparkles,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import { DailyReportResponse } from "@/types/report";

const formSchema = z.object({
  date: z.string().min(1),
  didRead: z.boolean(),
  booksRead: z.string().max(2000),
  learnings: z.string().max(5000),
  difficulties: z.string().max(5000),
  questions: z.string().max(5000),
});

type FormData = z.infer<typeof formSchema>;

type ReportFormProps = {
  initialReport?: DailyReportResponse;
  className?: string;
};

type FieldKey = "booksRead" | "learnings" | "difficulties" | "questions";

const fieldsMeta: Record<
  FieldKey,
  {
    label: string;
    placeholder: string;
    rows: number;
    max: number;
    icon: ReactNode;
  }
> = {
  booksRead: {
    label: "Hôm nay đã đọc những cuốn sách gì?",
    placeholder: "Tên sách, chương, số trang...",
    rows: 2,
    max: 2000,
    icon: <Library className="h-3.5 w-3.5" />,
  },
  learnings: {
    label: "Những điều đã học được",
    placeholder: "Insight, ý hay, ghi chú...",
    rows: 3,
    max: 5000,
    icon: <Lightbulb className="h-3.5 w-3.5" />,
  },
  difficulties: {
    label: "Khó khăn trong quá trình đọc",
    placeholder: "Đoạn khó hiểu, từ vựng mới...",
    rows: 3,
    max: 5000,
    icon: <AlertCircle className="h-3.5 w-3.5" />,
  },
  questions: {
    label: "Câu hỏi cần làm rõ",
    placeholder: "Câu hỏi mở, ý cần đào sâu...",
    rows: 3,
    max: 5000,
    icon: <HelpCircle className="h-3.5 w-3.5" />,
  },
};

type Status =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function ReportForm({ initialReport, className }: ReportFormProps) {
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const { register, handleSubmit, setValue, control, formState, reset } =
    useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        date: initialReport?.date ?? new Date().toISOString().slice(0, 10),
        didRead: initialReport?.didRead ?? false,
        booksRead: initialReport?.booksRead ?? "",
        learnings: initialReport?.learnings ?? "",
        difficulties: initialReport?.difficulties ?? "",
        questions: initialReport?.questions ?? "",
      },
    });

  useEffect(() => {
    reset({
      date: initialReport?.date ?? new Date().toISOString().slice(0, 10),
      didRead: initialReport?.didRead ?? false,
      booksRead: initialReport?.booksRead ?? "",
      learnings: initialReport?.learnings ?? "",
      difficulties: initialReport?.difficulties ?? "",
      questions: initialReport?.questions ?? "",
    });
  }, [initialReport, reset]);

  const didRead = useWatch({ control, name: "didRead" });
  const watchedValues = useWatch({ control });

  const onSubmit = handleSubmit(async (data) => {
    setStatus({ type: "idle" });
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      setStatus({ type: "error", message: "Không lưu được report, vui lòng thử lại." });
      return;
    }

    setStatus({ type: "success", message: "Đã lưu report cho ngày này." });
  });

  return (
    <Card className={cn("flex flex-col", className)} as="section">
      <CardHeader>
        <CardTitle>Report đọc sách</CardTitle>
        <CardDescription>
          Mỗi ngày 1 report — heatmap sẽ tự cập nhật trạng thái.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-[200px_1fr] sm:items-start">
            <div>
              <label
                htmlFor="report-date"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Ngày
              </label>
              <Input
                id="report-date"
                type="date"
                {...register("date")}
                leftIcon={<Calendar className="h-4 w-4" />}
              />
            </div>

            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-700">
                Hôm nay có đọc không?
              </p>
              <div
                role="radiogroup"
                aria-label="Có đọc hôm nay không"
                className="inline-flex w-full max-w-[260px] items-center rounded-xl border border-slate-200 bg-slate-100 p-1"
              >
                <SegmentedOption
                  selected={didRead === true}
                  onClick={() => setValue("didRead", true, { shouldDirty: true })}
                  tone="emerald"
                  label="Có đọc"
                />
                <SegmentedOption
                  selected={didRead === false}
                  onClick={() => setValue("didRead", false, { shouldDirty: true })}
                  tone="slate"
                  label="Không"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(Object.keys(fieldsMeta) as FieldKey[]).map((key) => {
              const meta = fieldsMeta[key];
              const value = (watchedValues?.[key] as string | undefined) ?? "";
              return (
                <div key={key} className={key === "booksRead" ? "md:col-span-2" : ""}>
                  <label
                    htmlFor={`field-${key}`}
                    className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700"
                  >
                    <span className="text-slate-500">{meta.icon}</span>
                    {meta.label}
                  </label>
                  <Textarea
                    id={`field-${key}`}
                    rows={meta.rows}
                    maxLength={meta.max}
                    placeholder={meta.placeholder}
                    {...register(key)}
                  />
                  <div className="mt-1 flex justify-end text-[11px] tabular-nums text-slate-400">
                    {value.length}/{meta.max}
                  </div>
                </div>
              );
            })}
          </div>

          {status.type === "success" ? (
            <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{status.message}</span>
            </div>
          ) : null}
          {status.type === "error" ? (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{status.message}</span>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              Report cùng ngày sẽ tự ghi đè (1 entry / ngày).
            </p>
            <Button
              type="submit"
              loading={formState.isSubmitting}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Lưu report
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SegmentedOption({
  selected,
  onClick,
  label,
  tone,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  tone: "emerald" | "slate";
}) {
  const activeClass =
    tone === "emerald"
      ? "bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-200"
      : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200";
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        selected ? activeClass : "text-slate-600 hover:text-slate-900",
      )}
    >
      {label}
    </button>
  );
}
