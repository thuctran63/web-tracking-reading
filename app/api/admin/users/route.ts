import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  await connectToDatabase();
  const filter = q
    ? { email: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }
    : {};

  const users = await User.find({
    ...filter,
    role: { $ne: "admin" },
  })
    .sort({ email: 1 })
    .limit(20)
    .lean();

  return NextResponse.json({
    users: users.map((user) => ({
      id: user._id.toString(),
      email: user.email,
    })),
  });
}
