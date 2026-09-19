
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <a
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            <span className="text-emerald-400">Pak</span>
            <span className="text-white">Utility</span>
          </a>

          <h1 className="mt-8 text-3xl font-bold sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Last updated: September 2026
          </p>
        </div>

        <div className="space-y-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 leading-7 shadow-xl sm:p-8">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-400">
              1. Introduction
            </h2>

            <p className="text-slate-300">
              Welcome to PakUtility. We provide free online utility tools
              designed to help users access useful everyday information and
              services in one place.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-400">
              2. Information We Collect
            </h2>

            <p className="text-slate-300">
              PakUtility is designed to work without requiring users to create
              an account. We do not intentionally collect sensitive personal
              information through our basic utility tools.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-400">
              3. Third-Party Services
            </h2>

            <p className="text-slate-300">
              Some tools may use third-party services or public APIs to provide
              information such as weather, prayer times, cryptocurrency rates,
              or other data. These services may process requests according to
              their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-400">
              4. Cookies and Local Storage
            </h2>

            <p className="text-slate-300">
              PakUtility may use browser storage or cookies where necessary to
              improve functionality, remember preferences, or provide a better
              user experience.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-400">
              5. Advertising
            </h2>

            <p className="text-slate-300">
              In the future, PakUtility may display advertisements from
              third-party advertising providers. These providers may use
              cookies or similar technologies according to their own policies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-400">
              6. External Links
            </h2>

            <p className="text-slate-300">
              Our website may contain links to external websites or services.
              PakUtility is not responsible for the privacy practices or
              content of third-party websites.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-400">
              7. Children's Privacy
            </h2>

            <p className="text-slate-300">
              PakUtility does not knowingly collect personal information from
              children. If you believe that a child has provided personal
              information to us, please contact us so that appropriate action
              can be taken.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-400">
              8. Changes to This Privacy Policy
            </h2>

            <p className="text-slate-300">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-400">
              9. Contact Us
            </h2>

            <p className="text-slate-300">
              If you have questions about this Privacy Policy, you can contact
              us through the Contact page of PakUtility.
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <a
            href="/"
            className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition hover:border-emerald-400 hover:text-emerald-400"
          >
            ← Home
          </a>

          <a
            href="/about"
            className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition hover:border-emerald-400 hover:text-emerald-400"
          >
            About Us
          </a>

          <a
            href="/contact"
            className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition hover:border-emerald-400 hover:text-emerald-400"
          >
            Contact Us
          </a>
        </div>

        <footer className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © 2026 PakUtility. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
