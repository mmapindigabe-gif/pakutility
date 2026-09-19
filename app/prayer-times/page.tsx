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
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight sm:text-2xl"
          >
            <span className="text-emerald-400">Pak</span>
            <span className="text-white">Utility</span>
          </Link>

          <Link
            href="/"
            className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/10 sm:px-4 sm:text-sm"
          >
            ← Home
          </Link>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-5 sm:py-12 md:py-16">
        {/* Title */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-3xl sm:h-16 sm:w-16 sm:text-4xl">
            🕌
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 sm:text-sm sm:tracking-widest">
            Prayer Times
          </p>

          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            نماز کے اوقات
          </h1>

          <p className="mx-auto mt-3 max-w-2xl px-2 text-sm leading-6 text-slate-400 sm:mt-4 sm:text-base">
            پاکستان کے مختلف شہروں کے آج کے نماز کے اوقات
            AlAdhan API کے ذریعے حاصل کریں۔
          </p>
        </div>

        {/* City Selector */}
        <div className="mx-auto mt-8 w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:mt-10 sm:rounded-3xl sm:p-5">
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
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3.5 text-sm text-white outline-none focus:border-emerald-400 sm:rounded-2xl sm:py-4 sm:text-base"
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
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center sm:mt-10 sm:rounded-3xl sm:p-10">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400 sm:h-10 sm:w-10" />

            <p className="mt-4 text-sm text-slate-400 sm:mt-5 sm:text-base">
              نماز کے اوقات حاصل کیے جا رہے ہیں...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-center sm:mt-10 sm:rounded-3xl sm:p-6">
            <p className="text-sm leading-6 text-red-300 sm:text-base">
              {error}
            </p>

            <button
              onClick={() => fetchPrayerTimes(city)}
              className="mt-4 rounded-xl bg-red-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-red-300 sm:mt-5 sm:text-base"
            >
              دوبارہ کوشش کریں
            </button>
          </div>
        )}

        {/* Prayer Data */}
        {!loading && !error && data && (
          <>
            {/* Date Information */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
              {/* City */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center sm:p-5">
                <p className="text-xs text-slate-500 sm:text-sm">
                  شہر
                </p>

                <p className="mt-2 text-base font-bold sm:text-lg">
                  {city}
                </p>
              </div>

              {/* Date */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center sm:p-5">
                <p className="text-xs text-slate-500 sm:text-sm">
                  تاریخ
                </p>

                <p className="mt-2 text-base font-bold sm:text-lg">
                  {data.date.readable}
                </p>
              </div>

              {/* Hijri */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center sm:p-5">
                <p className="text-xs text-slate-500 sm:text-sm">
                  ہجری تاریخ
                </p>

                <p className="mt-2 text-base font-bold sm:text-lg">
                  {data.date.hijri.date}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {data.date.hijri.month.en} {data.date.hijri.year}
                </p>
              </div>
            </div>

            {/* Prayer Cards */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {prayers.map((prayer) => {
                const time =
                  data.timings[
                    prayer.key as keyof PrayerTimes
                  ];

                return (
                  <div
                    key={prayer.key}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.06] sm:rounded-3xl sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-emerald-400">
                          {prayer.urdu}
                        </p>

                        <h2 className="mt-1 text-lg font-bold sm:text-xl">
                          {prayer.name}
                        </h2>
                      </div>

                      <div className="shrink-0 text-2xl sm:text-3xl">
                        {prayer.icon}
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6">
                      <p className="whitespace-nowrap text-3xl font-extrabold tracking-tight sm:text-4xl">
                        {cleanTime(time)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Extra Times */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
              {/* Midnight */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">
                      Midnight
                    </p>

                    <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                      نصف شب
                    </p>
                  </div>

                  <p className="shrink-0 text-xl font-bold sm:text-2xl">
                    {cleanTime(data.timings.Midnight || "")}
                  </p>
                </div>
              </div>

              {/* Timezone */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">
                      Timezone
                    </p>

                    <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                      ٹائم زون
                    </p>
                  </div>

                  <p className="max-w-[55%] break-words text-right text-xs font-semibold sm:text-sm">
                    {data.meta.timezone}
                  </p>
                </div>
              </div>
            </div>

            {/* Calculation Method */}
            <div className="mt-6 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-4 text-center sm:mt-8 sm:p-5">
              <p className="text-xs text-slate-400 sm:text-sm">
                Calculation Method
              </p>

              <p className="mt-1 text-sm font-semibold text-emerald-300 sm:text-base">
                {data.meta.method.name}
              </p>
            </div>
          </>
        )}

        {/* Ad Placeholder */}
        <div className="mt-8 flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 sm:mt-12 sm:min-h-28">
          <p className="text-center text-xs text-slate-600 sm:text-sm">
            Advertisement Space
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500 sm:px-5 sm:py-8 sm:text-sm">
          <p>© 2026 PakUtility — Prayer Times</p>

          <p className="mt-2">
            Prayer data provided by AlAdhan API.
          </p>
        </div>
      </footer>
    </main>
  );
}