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
      {/* Grain overlay */}
      <div className="bg-grain" />

      {/* Hero background */}
      <div className="bg-grid-warm absolute inset-x-0 top-0 h-[520px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      <div className="bg-radial-accent absolute inset-x-0 top-0 h-[520px]" />
      <div className="absolute -top-40 left-1/2 -z-10 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/15 via-indigo-400/10 to-emerald-500/10 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 animate-fade-up">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-[0_2px_8px_rgba(212,82,42,0.25)]">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="text-base font-semibold text-slate-900">
            Reading Tracker
          </span>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden h-9 items-center justify-center rounded-xl px-3.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 sm:inline-flex"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-indigo-500 px-3.5 text-sm font-medium text-white shadow-[0_2px_8px_rgba(212,82,42,0.25)] transition-all hover:bg-indigo-600 hover:shadow-[0_4px_12px_rgba(212,82,42,0.3)]"
          >
            Bắt đầu
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6 py-12 text-center sm:py-24">
        {/* Badge */}
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-medium text-indigo-700 backdrop-blur shadow-sm animate-fade-up delay-1">
          <Sparkles className="h-3.5 w-3.5" />
          Phiên bản mới — UI hiện đại hơn
        </span>

        {/* Headline */}
        <h1 className="animate-fade-up delay-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Theo dõi{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">
            tiến độ đọc sách
          </span>
          <br className="hidden sm:block" /> mỗi ngày một cách nhẹ nhàng
        </h1>

        <p className="animate-fade-up delay-3 mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
          Mỗi ngày 1 report ngắn, calendar tự động cập nhật, streak tự động đếm.
          Tập trung vào việc đọc, để app lo phần thống kê.
        </p>

        <div className="animate-fade-up delay-3 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-500 px-5 text-sm font-medium text-white shadow-[0_2px_8px_rgba(212,82,42,0.25)] transition-all hover:bg-indigo-600 hover:shadow-[0_4px_16px_rgba(212,82,42,0.35)]"
          >
            <LogIn className="h-4 w-4" />
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 hover:shadow-md"
          >
            <UserPlus className="h-4 w-4" />
            Tạo tài khoản
          </Link>
        </div>

        {/* Stats row */}
        <div className="animate-fade-up delay-4 mt-12 flex flex-wrap items-center justify-center gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-indigo-500">3s</p>
            <p className="text-xs text-slate-500">Mỗi report</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <p className="text-2xl font-bold text-emerald-500">365</p>
            <p className="text-xs text-slate-500">Ngày trong năm</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <p className="inline-flex items-center gap-1 text-2xl font-bold text-amber-500">
              <Flame className="h-5 w-5" />
              ∞
            </p>
            <p className="text-xs text-slate-500">Streak không giới hạn</p>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-16 grid w-full gap-5 sm:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-6 text-left shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(212,82,42,0.08)] animate-fade-up delay-${index + 2}`}
            >
              <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-indigo-50 transition-all duration-500 group-hover:scale-[3] group-hover:opacity-0" />
              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 ring-1 ring-indigo-200">
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="relative mt-4 text-sm font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="relative mt-1 text-sm text-slate-600">
                {feature.description}
              </p>
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
