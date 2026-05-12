"use client";

import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "register") {
        const registerResponse = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: identifier, password }),
        });

        const registerData = (await registerResponse.json()) as { error?: string };
        if (!registerResponse.ok) {
          setError(registerData.error ?? "Không thể tạo tài khoản.");
          return;
        }
      }

      const loginResult = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        setError("Email hoặc mật khẩu chưa đúng.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <div className="w-full max-w-md">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <BookOpen className="h-4 w-4" />
        </span>
        <span className="font-semibold">Reading Tracker</span>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)] sm:p-7"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
            {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
          </span>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
            </h1>
            <p className="text-sm text-slate-500">
              {isLogin
                ? "Tiếp tục theo dõi tiến độ đọc sách của bạn."
                : "Bắt đầu hành trình tracking việc đọc sách."}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="identifier"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              {isLogin ? "Email hoặc username" : "Email"}
            </label>
            <Input
              id="identifier"
              required
              type={isLogin ? "text" : "email"}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder={isLogin ? "vd: user@email.com hoặc admin" : "you@email.com"}
              leftIcon={<Mail className="h-4 w-4" />}
              autoComplete={isLogin ? "username" : "email"}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Mật khẩu
            </label>
            <Input
              id="password"
              required
              minLength={isLogin ? 1 : 6}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={isLogin ? "Nhập mật khẩu" : "Tối thiểu 6 ký tự"}
              leftIcon={<Lock className="h-4 w-4" />}
              autoComplete={isLogin ? "current-password" : "new-password"}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />
            {!isLogin ? (
              <p className="mt-1.5 text-xs text-slate-500">
                Mật khẩu tối thiểu 6 ký tự.
              </p>
            ) : null}
          </div>
        </div>

        {error ? (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="mt-6 w-full"
          disabled={isLoading}
          rightIcon={
            isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )
          }
        >
          {isLoading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Tạo tài khoản"}
        </Button>

        <p className="mt-5 text-center text-sm text-slate-500">
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <Link
            href={isLogin ? "/register" : "/login"}
            className="font-medium text-indigo-600 transition-colors hover:text-indigo-500"
          >
            {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
          </Link>
        </p>
      </form>
    </div>
  );
}
