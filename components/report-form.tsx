"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
};

export function ReportForm({ initialReport }: ReportFormProps) {
  const [status, setStatus] = useState<string>("");
  const [didRead, setDidRead] = useState<boolean>(initialReport?.didRead ?? false);
  const { register, handleSubmit, setValue, formState } = useForm<FormData>({
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

  const onSubmit = handleSubmit(async (data) => {
    setStatus("");
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      setStatus("Không lưu được report, vui lòng thử lại.");
      return;
    }

    setStatus("Lưu report thành công.");
  });

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Report đọc sách hôm nay</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Mỗi ngày chỉ cần 1 report để calendar cập nhật trạng thái.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-zinc-700">Ngày</span>
          <input
            type="date"
            {...register("date")}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-indigo-500 focus:ring-2"
          />
        </label>

        <div className="rounded-lg border border-zinc-200 p-3">
          <p className="text-sm font-medium text-zinc-700">Hôm nay có đọc sách không?</p>
          <div className="mt-2 flex gap-4 text-sm text-zinc-800">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                checked={didRead === true}
                onChange={() => {
                  setDidRead(true);
                  setValue("didRead", true);
                }}
              />
              Có
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                checked={didRead === false}
                onChange={() => {
                  setDidRead(false);
                  setValue("didRead", false);
                }}
              />
              Không
            </label>
          </div>
        </div>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-zinc-700">
            Hôm nay đã đọc những cuốn sách gì?
          </span>
          <textarea
            rows={2}
            {...register("booksRead")}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-indigo-500 focus:ring-2"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-zinc-700">
            Những điều đã đọc và học được
          </span>
          <textarea
            rows={3}
            {...register("learnings")}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-indigo-500 focus:ring-2"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-zinc-700">
            Những khó khăn trong quá trình đọc
          </span>
          <textarea
            rows={3}
            {...register("difficulties")}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-indigo-500 focus:ring-2"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-zinc-700">
            Các câu hỏi trong quá trình đọc
          </span>
          <textarea
            rows={3}
            {...register("questions")}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-indigo-500 focus:ring-2"
          />
        </label>

        {formState.errors.root ? (
          <p className="text-sm text-red-600">{formState.errors.root.message}</p>
        ) : null}
        {status ? <p className="text-sm text-zinc-600">{status}</p> : null}

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Lưu report
        </button>
      </form>
    </section>
  );
}
