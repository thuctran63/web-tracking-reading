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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
      <div className="bg-grain" />
      <div className="bg-grid-warm absolute inset-x-0 top-0 h-[320px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      <div className="bg-radial-accent absolute inset-x-0 top-0 h-[360px]" />
      <div className="absolute -top-24 left-1/2 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/15 via-indigo-400/10 to-emerald-500/10 blur-3xl" />
      <div className="relative z-10">
        <AuthForm mode="register" />
      </div>
    </main>
  );
}
