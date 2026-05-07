import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { toDateOnly } from "@/lib/report-utils";
import { DailyReport } from "@/models/DailyReport";

const reportSchema = z.object({
  date: z.string(),
  didRead: z.boolean(),
  booksRead: z.string().trim().max(2000),
  learnings: z.string().trim().max(5000),
  difficulties: z.string().trim().max(5000),
  questions: z.string().trim().max(5000),
});

function toResponse(report: {
  _id: string;
  date: Date;
  didRead: boolean;
  booksRead: string;
  learnings: string;
  difficulties: string;
  questions: string;
}) {
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

async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  const userId = user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year")) || new Date().getFullYear();
  const from = new Date(Date.UTC(year, 0, 1));
  const to = new Date(Date.UTC(year + 1, 0, 1));

  await connectToDatabase();
  const reports = await DailyReport.find({
    userId,
    date: { $gte: from, $lt: to },
  })
    .sort({ date: 1 })
    .lean();

  return NextResponse.json({
    reports: reports.map((report) => toResponse(report)),
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  const userId = user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (user.role === "admin") {
    return NextResponse.json(
      { error: "Admin account cannot submit reading reports." },
      { status: 403 },
    );
  }

  const body = await request.json();
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid report data." }, { status: 400 });
  }

  const normalizedDate = toDateOnly(parsed.data.date);

  await connectToDatabase();
  const report = await DailyReport.findOneAndUpdate(
    { userId, date: normalizedDate },
    {
      $set: {
        didRead: parsed.data.didRead,
        booksRead: parsed.data.booksRead,
        learnings: parsed.data.learnings,
        difficulties: parsed.data.difficulties,
        questions: parsed.data.questions,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  ).lean();

  return NextResponse.json({ report: toResponse(report) }, { status: 200 });
}
