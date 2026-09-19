"use client";

import { useState } from "react";
import Link from "next/link";

type QiblaData = {
  direction: number;
  latitude: number;
  longitude: number;
};

type ApiResponse = {
  code: number;
  status: string;
  data?: {
    direction: number;
    latitude: number;
    longitude: number;
  };
};

const cities = [
  {
    name: "Islamabad",
    latitude: 33.6844,
    longitude: 73.0479,
  },
  {
    name: "Rawalpindi",
    latitude: 33.5651,
    longitude: 73.0169,
  },
  {
    name: "Lahore",
    latitude: 31.5204,
    longitude: 74.3587,
  },
  {
    name: "Karachi",
    latitude: 24.8607,
    longitude: 67.0011,
  },
  {
    name: "Peshawar",
    latitude: 34.0151,
    longitude: 71.5249,
  },
  {
    name: "Quetta",
    latitude: 30.1798,
    longitude: 66.975,
  },
  {
    name: "Multan",
    latitude: 30.1575,
    longitude: 71.5249,
  },
  {
    name: "Faisalabad",
    latitude: 31.4504,
    longitude: 73.135,
  },
];

export default function QiblaPage() {
  const [qibla, setQibla] = useState<QiblaData | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [selectedCity, setSelectedCity] =
    useState("Islamabad");

  async function getQibla(
    latitude: number,
    longitude: number
  ) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`
      );

      if (!response.ok) {
        throw new Error("Qibla API request failed");
      }

      const result: ApiResponse = await response.json();

      if (result.code !== 200 || !result.data) {
        throw new Error("Qibla direction not found");
      }

      setQibla({
        direction: result.data.direction,
        latitude: result.data.latitude,
        longitude: result.data.longitude,
      });
    } catch (err) {
      console.error(err);

      setError(
        "قبلہ کی سمت حاصل نہیں ہو سکی۔ براہِ کرم دوبارہ کوشش کریں۔"
      );
    } finally {
      setLoading(false);
    }
  }

  function findMyQibla() {
    setError("");

    if (!navigator.geolocation) {
      setError(
        "آپ کے browser میں GPS/Location support موجود نہیں ہے۔"
      );

      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        getQibla(latitude, longitude);
      },
      (locationError) => {
        console.error(
          "Location Error:",
          locationError.code,
          locationError.message
        );

        setLoading(false);

        if (locationError.code === 1) {
          setError(
            "Location permission بند ہے۔ آپ نیچے شہر منتخب کرکے Qibla direction معلوم کر سکتے ہیں۔"
          );
        } else if (locationError.code === 2) {
          setError(
            "آپ کی location دستیاب نہیں ہے۔ شہر منتخب کرکے Qibla direction معلوم کریں۔"
          );
        } else if (locationError.code === 3) {
          setError(
            "Location حاصل کرنے میں وقت زیادہ لگ گیا۔ شہر منتخب کرکے Qibla direction معلوم کریں۔"
          );
        } else {
          setError(
            "Location حاصل نہیں ہو سکی۔ شہر منتخب کرکے Qibla direction معلوم کریں۔"
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }

  function findCityQibla() {
    const city = cities.find(
      (item) => item.name === selectedCity
    );

    if (!city) {
      setError("براہِ کرم شہر منتخب کریں۔");
      return;
    }

    getQibla(city.latitude, city.longitude);
  }

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
      <section className="mx-auto max-w-5xl px-5 py-12 md:py-20">
        {/* Heading */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-4xl">
            🧭
          </div>

          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Qibla Compass
          </p>

          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
            قبلہ کی سمت
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
            اپنی موجودہ location یا شہر کے ذریعے مکہ مکرمہ کی
            طرف قبلہ کی سمت معلوم کریں۔
          </p>
        </div>

        {/* Compass */}
        <div className="mx-auto mt-12 max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl sm:p-10">
          <div className="mx-auto flex h-72 w-72 items-center justify-center rounded-full border border-white/10 bg-slate-900 shadow-inner sm:h-80 sm:w-80">
            <div className="relative flex h-60 w-60 items-center justify-center rounded-full border border-white/10 bg-slate-950 sm:h-68 sm:w-68">
              {/* Directions */}
              <span className="absolute top-3 text-sm font-bold text-red-400">
                N
              </span>

              <span className="absolute bottom-3 text-sm font-bold text-slate-500">
                S
              </span>

              <span className="absolute left-4 text-sm font-bold text-slate-500">
                W
              </span>

              <span className="absolute right-4 text-sm font-bold text-slate-500">
                E
              </span>

              {/* Qibla Arrow */}
              {qibla ? (
                <div
                  className="absolute flex h-full w-full items-center justify-center transition-transform duration-700"
                  style={{
                    transform: `rotate(${qibla.direction}deg)`,
                  }}
                >
                  <div className="absolute top-8 h-24 w-1 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/30" />

                  <div className="absolute top-4 text-xl">
                    🕋
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-5xl">🕋</div>

                  <p className="mt-3 text-sm text-slate-500">
                    Qibla
                  </p>
                </div>
              )}

              {/* Center */}
              <div className="relative z-10 h-5 w-5 rounded-full border-4 border-slate-950 bg-emerald-400" />
            </div>
          </div>

          {/* Direction */}
          {qibla && (
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Qibla Direction
              </p>

              <p className="mt-2 text-5xl font-extrabold text-emerald-400">
                {qibla.direction.toFixed(1)}°
              </p>

              <p className="mt-2 text-sm text-slate-400">
                شمال سے گھڑی کی سمت
              </p>
            </div>
          )}

          {/* GPS Button */}
          <button
            onClick={findMyQibla}
            disabled={loading}
            className="mt-8 w-full rounded-2xl bg-emerald-500 px-6 py-4 font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Location حاصل کی جا رہی ہے..."
              : "📍 میری موجودہ Location سے Qibla معلوم کریں"}
          </button>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs text-slate-600">
              یا
            </span>

            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* City Selection */}
          <div>
            <label
              htmlFor="city"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              شہر منتخب کریں
            </label>

            <select
              id="city"
              value={selectedCity}
              onChange={(event) =>
                setSelectedCity(event.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 text-white outline-none focus:border-emerald-400"
            >
              {cities.map((city) => (
                <option
                  key={city.name}
                  value={city.name}
                >
                  {city.name}, Pakistan
                </option>
              ))}
            </select>

            <button
              onClick={findCityQibla}
              disabled={loading}
              className="mt-3 w-full rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-4 font-semibold text-emerald-300 transition hover:bg-emerald-400/20 disabled:opacity-50"
            >
              🧭 منتخب شہر کی Qibla Direction
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4 text-center">
              <p className="text-sm leading-6 text-yellow-200">
                {error}
              </p>
            </div>
          )}

          {/* Coordinates */}
          {qibla && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
                <p className="text-xs text-slate-500">
                  Latitude
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {qibla.latitude.toFixed(5)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
                <p className="text-xs text-slate-500">
                  Longitude
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {qibla.longitude.toFixed(5)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Information */}
        <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-lg font-bold">
            یہ کیسے کام کرتا ہے؟
          </h2>

          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
            <p>
              1. پہلے ہم آپ کی موجودہ GPS location حاصل کرنے کی
              کوشش کرتے ہیں۔
            </p>

            <p>
              2. اگر GPS permission دستیاب نہ ہو تو آپ شہر
              manually منتخب کر سکتے ہیں۔
            </p>

            <p>
              3. Latitude اور longitude AlAdhan Qibla API کو
              بھیجے جاتے ہیں۔
            </p>

            <p>
              4. API مکہ مکرمہ کی طرف Qibla bearing واپس کرتی ہے۔
            </p>
          </div>
        </div>

        {/* Important Note */}
        <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-5">
          <p className="text-sm leading-6 text-yellow-200/70">
            ⚠️ موجودہ version Qibla bearing دکھاتا ہے۔ حقیقی
            موبائل compass کی طرح device کو گھمانے پر needle
            گھمانے کا feature بعد میں Device Orientation API کے
            ذریعے شامل کیا جا سکتا ہے۔
          </p>
        </div>

        {/* Advertisement */}
        <div className="mt-12 flex min-h-28 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
          <p className="text-sm text-slate-600">
            Advertisement Space
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-5 py-8 text-center text-sm text-slate-500">
          <p>
            © 2026 PakUtility — Qibla Compass
          </p>

          <p className="mt-2">
            Qibla direction calculated using AlAdhan API.
          </p>
        </div>
      </footer>
    </main>
  );
}