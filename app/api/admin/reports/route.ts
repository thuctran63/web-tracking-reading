import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { DailyReport } from "@/models/DailyReport";

const querySchema = z.object({
  userId: z.string().min(1),
  year: z.coerce.number().int().min(2000).max(3000),
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    userId: searchParams.get("userId"),
    year: searchParams.get("year") ?? new Date().getFullYear(),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query." }, { status: 400 });
  }

  const from = new Date(Date.UTC(parsed.data.year, 0, 1));
  const to = new Date(Date.UTC(parsed.data.year + 1, 0, 1));

  await connectToDatabase();
  const reports = await DailyReport.find({
    userId: parsed.data.userId,
    date: { $gte: from, $lt: to },
  })
    .sort({ date: -1 })
    .lean();

  return NextResponse.json({
    reports: reports.map((report) => ({
      id: report._id.toString(),
      date: report.date.toISOString().slice(0, 10),
      didRead: report.didRead,
      booksRead: report.booksRead,
      learnings: report.learnings,
      difficulties: report.difficulties,
      questions: report.questions,
    })),
  });
}
