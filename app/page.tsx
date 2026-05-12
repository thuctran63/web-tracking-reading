import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Flame,
  LogIn,
  Sparkles,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: BookOpen,
    title: "Report hằng ngày",
    description:
      "Ghi nhận sách đã đọc, điều học được, khó khăn và câu hỏi chỉ trong vài giây mỗi ngày.",
  },
  {
    icon: CalendarDays,
    title: "Calendar kiểu GitHub",
    description:
      "Trực quan hóa thói quen đọc theo cả năm. Nhìn một lần biết ngay tháng nào bạn đang đuối.",
  },
  {
    icon: Flame,
    title: "Theo dõi streak",
    description:
      "Đếm chuỗi ngày đọc liên tục, tỉ lệ ngày có đọc và best streak — đốt cháy động lực mỗi ngày.",
  },
] as const;

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50">
      <div className="bg-grid absolute inset-x-0 top-0 h-[420px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      <div className="absolute -top-32 left-1/2 -z-10 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-200/60 via-violet-200/50 to-sky-200/40 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="text-base font-semibold text-slate-900">
            Reading Tracker
          </span>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden h-9 items-center justify-center rounded-xl px-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 sm:inline-flex"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500"
          >
            Bắt đầu
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6 py-12 text-center sm:py-20">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-medium text-indigo-700 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          Phiên bản mới — UI hiện đại hơn
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Theo dõi <span className="text-indigo-600">tiến độ đọc sách</span>
          <br className="hidden sm:block" /> mỗi ngày một cách nhẹ nhàng
        </h1>
        <p className="mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
          Mỗi ngày 1 report ngắn, calendar tự động cập nhật, streak tự động đếm.
          Tập trung vào việc đọc, để app lo phần thống kê.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500"
          >
            <LogIn className="h-4 w-4" />
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <UserPlus className="h-4 w-4" />
            Tạo tài khoản
          </Link>
        </div>

        <div className="mt-16 grid w-full gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur transition-shadow hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100"
                aria-hidden
              >
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 mx-auto w-full max-w-6xl px-6 py-6 text-center text-xs text-slate-500">
        Đọc đều mỗi ngày — chậm mà chắc.
      </footer>
    </main>
  );
}
