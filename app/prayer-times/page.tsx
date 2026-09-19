"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type PrayerTimes = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak?: string;
  Midnight?: string;
};

type ApiResponse = {
  code: number;
  status: string;
  data?: {
    timings: PrayerTimes;
    date: {
      readable: string;
      hijri: {
        date: string;
        month: {
          en: string;
          ar: string;
        };
        year: string;
      };
    };
    meta: {
      timezone: string;
      method: {
        id: number;
        name: string;
      };
    };
  };
};

const prayers = [
  {
    key: "Fajr",
    name: "Fajr",
    urdu: "فجر",
    icon: "🌅",
  },
  {
    key: "Sunrise",
    name: "Sunrise",
    urdu: "طلوعِ آفتاب",
    icon: "🌄",
  },
  {
    key: "Dhuhr",
    name: "Dhuhr",
    urdu: "ظہر",
    icon: "☀️",
  },
  {
    key: "Asr",
    name: "Asr",
    urdu: "عصر",
    icon: "🌤️",
  },
  {
    key: "Maghrib",
    name: "Maghrib",
    urdu: "مغرب",
    icon: "🌇",
  },
  {
    key: "Isha",
    name: "Isha",
    urdu: "عشاء",
    icon: "🌙",
  },
];

const cities = [
  "Islamabad",
  "Rawalpindi",
  "Lahore",
  "Karachi",
  "Peshawar",
  "Quetta",
  "Multan",
  "Faisalabad",
];

function cleanTime(time: string | undefined) {
  if (!time) return "--:--";

  const clean = time.split(" ")[0];
  const [hours, minutes] = clean.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return clean;
  }

  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;

  return `${hour12.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;
}

export default function PrayerTimesPage() {
  const [city, setCity] = useState("Islamabad");
  const [country] = useState("Pakistan");

  const [data, setData] = useState<ApiResponse["data"] | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchPrayerTimes(selectedCity: string) {
    try {
      setLoading(true);
      setError("");

      const url =
        `https://api.aladhan.com/v1/timingsByCity` +
        `?city=${encodeURIComponent(selectedCity)}` +
        `&country=${encodeURIComponent(country)}` +
        `&method=1`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const result: ApiResponse = await response.json();

      if (result.code !== 200 || !result.data) {
        throw new Error("Prayer times not found");
      }

      setData(result.data);
    } catch (err) {
      console.error(err);
      setError(
        "نماز کے اوقات حاصل نہیں ہو سکے۔ براہِ کرم دوبارہ کوشش کریں۔"
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPrayerTimes(city);
  }, [city]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            <span className="text-emerald-400">Pak</span>
            <span className="text-white">Utility</span>
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
          >
            ← Home
          </Link>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        {/* Title */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-4xl">
            🕌
          </div>

          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Prayer Times
          </p>

          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
            نماز کے اوقات
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            پاکستان کے مختلف شہروں کے آج کے نماز کے اوقات
            AlAdhan API کے ذریعے حاصل کریں۔
          </p>
        </div>

        {/* City Selector */}
        <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <label
            htmlFor="city"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            شہر منتخب کریں
          </label>

          <select
            id="city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 text-white outline-none focus:border-emerald-400"
          >
            {cities.map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}, Pakistan
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400" />

            <p className="mt-5 text-slate-400">
              نماز کے اوقات حاصل کیے جا رہے ہیں...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-10 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 text-center">
            <p className="text-red-300">{error}</p>

            <button
              onClick={() => fetchPrayerTimes(city)}
              className="mt-5 rounded-xl bg-red-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-red-300"
            >
              دوبارہ کوشش کریں
            </button>
          </div>
        )}

        {/* Prayer Data */}
        {!loading && !error && data && (
          <>
            {/* Date Information */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                <p className="text-sm text-slate-500">
                  شہر
                </p>

                <p className="mt-2 text-lg font-bold">
                  {city}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                <p className="text-sm text-slate-500">
                  تاریخ
                </p>

                <p className="mt-2 text-lg font-bold">
                  {data.date.readable}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                <p className="text-sm text-slate-500">
                  ہجری تاریخ
                </p>

                <p className="mt-2 text-lg font-bold">
                  {data.date.hijri.date}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {data.date.hijri.month.en}{" "}
                  {data.date.hijri.year}
                </p>
              </div>
            </div>

            {/* Prayer Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {prayers.map((prayer) => {
                const time =
                  data.timings[
                    prayer.key as keyof PrayerTimes
                  ];

                return (
                  <div
                    key={prayer.key}
                    className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-emerald-400">
                          {prayer.urdu}
                        </p>

                        <h2 className="mt-1 text-xl font-bold">
                          {prayer.name}
                        </h2>
                      </div>

                      <div className="text-3xl">
                        {prayer.icon}
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-4xl font-extrabold tracking-tight">
                        {cleanTime(time)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Extra Times */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Midnight
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      نصف شب
                    </p>
                  </div>

                  <p className="text-2xl font-bold">
                    {cleanTime(data.timings.Midnight || "")}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Timezone
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      ٹائم زون
                    </p>
                  </div>

                  <p className="text-right text-sm font-semibold">
                    {data.meta.timezone}
                  </p>
                </div>
              </div>
            </div>

            {/* Calculation Method */}
            <div className="mt-8 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-5 text-center">
              <p className="text-sm text-slate-400">
                Calculation Method
              </p>

              <p className="mt-1 font-semibold text-emerald-300">
                {data.meta.method.name}
              </p>
            </div>
          </>
        )}

        {/* Ad Placeholder */}
        <div className="mt-12 flex min-h-28 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
          <p className="text-sm text-slate-600">
            Advertisement Space
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-8 text-center text-sm text-slate-500">
          <p>
            © 2026 PakUtility — Prayer Times
          </p>

          <p className="mt-2">
            Prayer data provided by AlAdhan API.
          </p>
        </div>
      </footer>
    </main>
  );
}