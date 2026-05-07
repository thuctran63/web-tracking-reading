import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { authOptions } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <AuthForm mode="register" />
    </main>
  );
}
