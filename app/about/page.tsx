
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <a href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-emerald-400">Pak</span>
            <span className="text-white">Utility</span>
          </a>

          <h1 className="mt-8 text-3xl font-bold sm:text-4xl">
            About PakUtility
          </h1>

          <p className="mt-3 text-slate-400">
            Simple, useful and free online tools for everyone.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 leading-7 shadow-xl sm:p-8">
          {/* Who We Are */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-400">
              Who We Are
            </h2>

            <p className="text-slate-300">
              PakUtility is a free online utility platform created to bring
              useful everyday tools together in one simple and easy-to-use
              website.
            </p>

            <p className="mt-4 text-slate-300">
              Our goal is to make useful information and digital tools easily
              accessible to people in Pakistan and around the world.
            </p>
          </section>

          {/* What We Offer */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-emerald-400">
              What We Offer
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-2 text-2xl">🕌</div>
                <h3 className="font-semibold text-white">
                  Prayer Times
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Find prayer timings for major cities in Pakistan.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-2 text-2xl">🧭</div>
                <h3 className="font-semibold text-white">
                  Qibla Finder
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Use our Qibla tool to help determine the direction of the
                  Kaaba.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-2 text-2xl">📖</div>
                <h3 className="font-semibold text-white">
                  Quran
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Access Quran-related content through a simple interface.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-2 text-2xl">₿</div>
                <h3 className="font-semibold text-white">
                  Crypto Rates
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Check cryptocurrency market rates and useful crypto
                  information.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 sm:col-span-2">
                <div className="mb-2 text-2xl">🌤️</div>
                <h3 className="font-semibold text-white">
                  Weather
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Get weather information to help plan your day.
                </p>
              </div>
            </div>
          </section>

          {/* Our Mission */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-400">
              Our Mission
            </h2>

            <p className="text-slate-300">
              Our mission is to build a reliable collection of simple digital
              tools that save time and make everyday tasks easier.
            </p>

            <p className="mt-4 text-slate-300">
              We aim to keep PakUtility fast, accessible, mobile-friendly and
              easy to understand.
            </p>
          </section>

          {/* Free Access */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-400">
              Free to Use
            </h2>

            <p className="text-slate-300">
              PakUtility is designed to provide its core tools free of charge.
              We want users to be able to access useful utilities without
              complicated registration or unnecessary barriers.
            </p>
          </section>

          {/* Continuous Improvement */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-400">
              Always Improving
            </h2>

            <p className="text-slate-300">
              PakUtility is continuously being improved with new tools,
              better performance, mobile-friendly designs and useful features.
            </p>
          </section>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <a
            href="/"
            className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition hover:border-emerald-400 hover:text-emerald-400"
          >
            ← Home
          </a>

          <a
            href="/privacy"
            className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition hover:border-emerald-400 hover:text-emerald-400"
          >
            Privacy Policy
          </a>

          <a
            href="/contact"
            className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition hover:border-emerald-400 hover:text-emerald-400"
          >
            Contact Us
          </a>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © 2026 PakUtility. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
