
"use client";

import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

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
            Contact Us
          </h1>

          <p className="mt-3 text-slate-400">
            Have a question, suggestion or feedback? We would love to hear
            from you.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
            <h2 className="mb-6 text-xl font-semibold text-emerald-400">
              Get in Touch
            </h2>

            <div className="space-y-6">
              <div>
                <div className="mb-2 text-2xl">📩</div>
                <h3 className="font-semibold">Email</h3>
                <p className="mt-1 text-sm text-slate-400">
                  For general questions and feedback, please use the contact
                  form.
                </p>
              </div>

              <div>
                <div className="mb-2 text-2xl">💡</div>
                <h3 className="font-semibold">Suggestions</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Tell us which new utility or feature you would like to see.
                </p>
              </div>

              <div>
                <div className="mb-2 text-2xl">🐞</div>
                <h3 className="font-semibold">Report a Problem</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Found a problem with one of our tools? Let us know.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl lg:col-span-2 sm:p-8">
            <h2 className="mb-6 text-xl font-semibold text-emerald-400">
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                <div className="text-4xl">✅</div>

                <h3 className="mt-4 text-xl font-semibold">
                  Message Ready
                </h3>

                <p className="mt-2 text-slate-300">
                  Your message has been received by the form interface.
                  Email sending will be connected in the next step.
                </p>

                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-5 rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Your Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="What is your message about?"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Write your message here..."
                    className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
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
            href="/about"
            className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition hover:border-emerald-400 hover:text-emerald-400"
          >
            About Us
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
