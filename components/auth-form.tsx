"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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
          setError(registerData.error ?? "Could not create account.");
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

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <h1 className="text-2xl font-semibold text-zinc-900">
        {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        {mode === "login"
          ? "Tiếp tục theo dõi tiến độ đọc sách mỗi ngày."
          : "Bắt đầu hành trình tracking việc đọc sách."}
      </p>

      <div className="mt-5 space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-zinc-700">
            {mode === "login" ? "Email hoặc username" : "Email"}
          </span>
          <input
            required
            type={mode === "login" ? "text" : "email"}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-indigo-500 focus:ring-2"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder={mode === "login" ? "vd: user@email.com hoặc admin" : ""}
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-zinc-700">Mật khẩu</span>
          <input
            required
            minLength={mode === "register" ? 6 : 1}
            type="password"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-indigo-500 focus:ring-2"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-5 w-full rounded-lg bg-indigo-600 px-3 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
      >
        {isLoading ? "Đang xử lý..." : mode === "login" ? "Đăng nhập" : "Đăng ký"}
      </button>

      <p className="mt-4 text-sm text-zinc-500">
        {mode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
        <Link
          href={mode === "login" ? "/register" : "/login"}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {mode === "login" ? "Đăng ký ngay" : "Đăng nhập"}
        </Link>
      </p>
    </form>
  );
}
