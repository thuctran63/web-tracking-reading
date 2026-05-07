import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  await connectToDatabase();

  const email = parsed.data.email.toLowerCase();
  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    return NextResponse.json(
      { error: "Email already registered." },
      { status: 409 },
    );
  }

  const passwordHash = await hash(parsed.data.password, 12);
  await User.create({
    email,
    passwordHash,
    role: "user",
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
