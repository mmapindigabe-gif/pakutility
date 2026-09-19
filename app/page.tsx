"use client";

import Link from "next/link";

const tools = [
  {
    title: "Prayer Times",
    urdu: "نماز کے اوقات",
    description: "اپنے شہر کے مطابق نماز کے اوقات دیکھیں۔",
    icon: "🕌",
    href: "/prayer-times",
  },
  {
    title: "Qibla",
    urdu: "قبلہ کمپاس",
    description: "قبلہ کی سمت آسانی سے معلوم کریں۔",
    icon: "🧭",
    href: "/qibla",
  },
  {
    title: "Quran",
    urdu: "قرآن مجید",
    description: "قرآن عربی متن، اردو ترجمہ اور آڈیو کے ساتھ۔",
    icon: "📖",
    href: "/quran",
  },
  {
    title: "Crypto Rates",
    urdu: "کرپٹو ریٹس",
    description: "Bitcoin اور دوسری cryptocurrencies کے تازہ ریٹس۔",
    icon: "₿",
    href: "/crypto",
  },
  {
    title: "Weather",
    urdu: "موسم",
    description: "پاکستان کے شہروں کا موجودہ موسم اور forecast۔",
    icon: "🌤️",
    href: "/weather",
  },
  
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-emerald-400">Pak</span>
            <span className="text-white">Utility</span>
          </Link>

          <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
            اردو / English
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-16 md:pb-24 md:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
              🇵🇰 پاکستان کے لیے مفت روزمرہ Utilities
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Everything You Need,
              <span className="block text-emerald-400">
                In One Place
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
نماز کے اوقات، قبلہ، قرآن، موسم اور کرپٹو ریٹس —
سب ایک ہی جگہ، تیز اور آسان۔
            </p>

            {/* Search */}
            <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Search a tool..."
                className="h-14 flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/50"
              />

              <button className="h-14 rounded-2xl bg-emerald-500 px-7 font-semibold text-slate-950 transition hover:bg-emerald-400">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              OUR TOOLS
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Daily Utility Tools
            </h2>

            <p className="mt-2 text-slate-400">
              اپنی ضرورت کا tool منتخب کریں۔
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.06]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-3xl">
                {tool.icon}
              </div>

              <h3 className="text-xl font-bold transition group-hover:text-emerald-400">
                {tool.title}
              </h3>

              <p className="mt-1 text-sm text-emerald-400/80">
                {tool.urdu}
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                {tool.description}
              </p>

              <div className="mt-6 text-sm font-medium text-slate-300 group-hover:text-emerald-400">
                Open Tool →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ad Placeholder */}
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="flex min-h-28 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
          <p className="text-sm text-slate-600">
            Advertisement Space
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© 2026 PakUtility. All rights reserved.</p>

          <div className="flex justify-center gap-5">
            <Link
              href="/privacy"
              className="transition hover:text-emerald-400"
            >
              Privacy
            </Link>

            <Link
              href="/about"
              className="transition hover:text-emerald-400"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-emerald-400"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}