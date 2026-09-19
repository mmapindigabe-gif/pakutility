"use client";

import { useEffect, useMemo, useState } from "react";

type City = {
  name: string;
  urdu: string;
  lat: number;
  lon: number;
};

type WeatherData = {
  name: string;
  timezone: number;
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  sys: {
    sunrise: number;
    sunset: number;
  };
};

const cities: City[] = [
  { name: "Islamabad", urdu: "اسلام آباد", lat: 33.6844, lon: 73.0479 },
  { name: "Rawalpindi", urdu: "راولپنڈی", lat: 33.5651, lon: 73.0169 },
  { name: "Lahore", urdu: "لاہور", lat: 31.5204, lon: 74.3587 },
  { name: "Karachi", urdu: "کراچی", lat: 24.8607, lon: 67.0011 },
  { name: "Peshawar", urdu: "پشاور", lat: 34.0151, lon: 71.5249 },
  { name: "Quetta", urdu: "کوئٹہ", lat: 30.1798, lon: 66.975 },
  { name: "Multan", urdu: "ملتان", lat: 30.1575, lon: 71.5249 },
  { name: "Faisalabad", urdu: "فیصل آباد", lat: 31.4504, lon: 73.135 },
  { name: "Gujranwala", urdu: "گوجرانوالہ", lat: 32.1877, lon: 74.1945 },
  { name: "Sialkot", urdu: "سیالکوٹ", lat: 32.4945, lon: 74.5229 },
  { name: "Hyderabad", urdu: "حیدرآباد", lat: 25.396, lon: 68.3578 },
  { name: "Bahawalpur", urdu: "بہاولپور", lat: 29.3956, lon: 71.6836 },
  { name: "Sargodha", urdu: "سرگودھا", lat: 32.0836, lon: 72.6711 },
  { name: "Abbottabad", urdu: "ایبٹ آباد", lat: 34.1688, lon: 73.2215 },
  { name: "Murree", urdu: "مری", lat: 33.9073, lon: 73.3903 },
];

function formatTime(timestamp: number, timezone: number) {
  const date = new Date((timestamp + timezone) * 1000);

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

function formatUpdatedTime(timestamp: number, timezone: number) {
  return formatTime(timestamp, timezone);
}

function getWindDirection(deg: number) {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];

  return directions[Math.round(deg / 22.5) % 16];
}

function getWindKmh(speed: number, unit: "C" | "F") {
  if (unit === "C") {
    return Math.round(speed * 3.6);
  }

  return Math.round(speed * 1.60934);
}

function getVisibilityKm(visibility: number) {
  return (visibility / 1000).toFixed(1);
}

export default function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState<City>(cities[0]);
  const [search, setSearch] = useState("");
  const [unit, setUnit] = useState<"C" | "F">("C");

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredCities = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return cities;

    return cities.filter(
      (city) =>
        city.name.toLowerCase().includes(value) ||
        city.urdu.includes(value)
    );
  }, [search]);

  async function loadWeather(city: City, selectedUnit: "C" | "F") {
    try {
      setLoading(true);
      setError("");

      const units = selectedUnit === "C" ? "metric" : "imperial";

      const response = await fetch(
        `/api/weather?lat=${city.lat}&lon=${city.lon}&units=${units}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Weather data could not be loaded."
        );
      }

      setWeather(data);
    } catch (err) {
      console.error("Weather loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Weather data load نہیں ہو سکا۔"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWeather(selectedCity, unit);
  }, [selectedCity, unit]);

  const temperature = weather
    ? Math.round(weather.main.temp)
    : "--";

  const feelsLike = weather
    ? Math.round(weather.main.feels_like)
    : "--";

  const minTemp = weather
    ? Math.round(weather.main.temp_min)
    : "--";

  const maxTemp = weather
    ? Math.round(weather.main.temp_max)
    : "--";

  const windSpeed = weather
    ? getWindKmh(weather.wind.speed, unit)
    : "--";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-emerald-400 sm:text-4xl">
            🌤️ PakUtility Weather
          </h1>

          <p className="mt-2 text-slate-400">
            پاکستان کے شہروں کا موجودہ موسم
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔎 شہر تلاش کریں... لاہور / Lahore"
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
          />
        </div>

        {/* City List */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {filteredCities.map((city) => (
            <button
              key={city.name}
              onClick={() => {
                setSelectedCity(city);
                setSearch("");
              }}
              className={`rounded-xl border p-3 transition ${
                selectedCity.name === city.name
                  ? "border-emerald-500 bg-emerald-500/20"
                  : "border-slate-800 bg-slate-900 hover:border-emerald-500"
              }`}
            >
              <div className="font-semibold">
                {city.name}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {city.urdu}
              </div>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

          <div className="rounded-xl border border-slate-700 bg-slate-900 p-1">
            <button
              onClick={() => setUnit("C")}
              className={`rounded-lg px-5 py-2 ${
                unit === "C"
                  ? "bg-emerald-500 text-slate-950"
                  : "text-slate-300"
              }`}
            >
              °C
            </button>

            <button
              onClick={() => setUnit("F")}
              className={`rounded-lg px-5 py-2 ${
                unit === "F"
                  ? "bg-emerald-500 text-slate-950"
                  : "text-slate-300"
              }`}
            >
              °F
            </button>
          </div>

          <button
            onClick={() => loadWeather(selectedCity, unit)}
            disabled={loading}
            className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading ? "⏳ Loading..." : "🔄 Refresh Weather"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-red-300">
            <p className="font-semibold">
              ⚠️ Weather Error
            </p>

            <p className="mt-2 text-sm">
              {error}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && !weather && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <div className="text-5xl">🌤️</div>

            <p className="mt-4 text-slate-400">
              موسم لوڈ ہو رہا ہے...
            </p>
          </div>
        )}

        {/* Weather */}
        {weather && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl sm:p-8">

            {/* Top */}
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

              <div>
                <p className="text-sm text-slate-500">
                  موجودہ موسم
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  📍 {weather.name}
                </h2>

                <p className="mt-1 text-slate-400">
                  {selectedCity.urdu}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className="h-24 w-24"
                />

                <div>
                  <div className="text-5xl font-bold">
                    {temperature}°{unit}
                  </div>

                  <p className="mt-2 capitalize text-slate-300">
                    {weather.weather[0].description}
                  </p>
                </div>
              </div>

            </div>

            {/* Temperature Summary */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  🌡️ محسوس ہونے والا
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {feelsLike}°{unit}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  🔽 کم ترین
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {minTemp}°{unit}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  🔼 زیادہ ترین
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {maxTemp}°{unit}
                </p>
              </div>

            </div>

            {/* Main Details */}
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">

              <div className="rounded-2xl bg-slate-800 p-5 text-center">
                <div className="text-2xl">💧</div>

                <p className="mt-2 text-sm text-slate-400">
                  نمی
                </p>

                <p className="mt-1 text-xl font-bold">
                  {weather.main.humidity}%
                </p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5 text-center">
                <div className="text-2xl">💨</div>

                <p className="mt-2 text-sm text-slate-400">
                  ہوا
                </p>

                <p className="mt-1 text-xl font-bold">
                  {windSpeed} km/h
                </p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5 text-center">
                <div className="text-2xl">🧭</div>

                <p className="mt-2 text-sm text-slate-400">
                  ہوا کی سمت
                </p>

                <p className="mt-1 text-xl font-bold">
                  {getWindDirection(weather.wind.deg)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5 text-center">
                <div className="text-2xl">☁️</div>

                <p className="mt-2 text-sm text-slate-400">
                  بادل
                </p>

                <p className="mt-1 text-xl font-bold">
                  {weather.clouds.all}%
                </p>
              </div>

            </div>

            {/* More Details */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  🌡️ Pressure
                </p>

                <p className="mt-2 text-xl font-bold">
                  {weather.main.pressure} hPa
                </p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  👁️ Visibility
                </p>

                <p className="mt-2 text-xl font-bold">
                  {getVisibilityKm(weather.visibility)} km
                </p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  🌅 Sunrise
                </p>

                <p className="mt-2 text-xl font-bold">
                  {formatTime(
                    weather.sys.sunrise,
                    weather.timezone
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  🌇 Sunset
                </p>

                <p className="mt-2 text-xl font-bold">
                  {formatTime(
                    weather.sys.sunset,
                    weather.timezone
                  )}
                </p>
              </div>

            </div>

            {/* Last Updated */}
            <div className="mt-6 border-t border-slate-800 pt-5 text-center text-sm text-slate-500">
              آخری اپڈیٹ:{" "}
              {formatUpdatedTime(
                weather.dt,
                weather.timezone
              )}
            </div>

          </div>
        )}

        {/* Advertisement */}
        <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center">
          <p className="text-sm text-slate-500">
            Advertisement
          </p>
        </div>

      </div>
    </main>
  );
}