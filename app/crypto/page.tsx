"use client";

import { useEffect, useMemo, useState } from "react";

type Currency = "PKR" | "USD";

type CryptoCoin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  market_cap_rank: number;
  price_pkr: number;
  price_usd: number;
  change_24h: number;
  market_cap_pkr: number;
  market_cap_usd: number;
};

const COINS = [
  "bitcoin",
  "ethereum",
  "binancecoin",
  "solana",
  "ripple",
  "dogecoin",
  "cardano",
  "tron",
];

function formatCurrency(value: number, currency: Currency) {
  if (!Number.isFinite(value)) return "N/A";

  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  }

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: value < 1 ? 4 : 0,
  }).format(value);
}

function formatMarketCap(value: number, currency: Currency) {
  if (!Number.isFinite(value)) return "N/A";

  const symbol = currency === "USD" ? "$" : "₨";

  if (value >= 1_000_000_000_000) {
    return `${symbol}${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `${symbol}${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `${symbol}${(value / 1_000_000).toFixed(2)}M`;
  }

  if (value >= 1_000) {
    return `${symbol}${(value / 1_000).toFixed(2)}K`;
  }

  return `${symbol}${value.toFixed(0)}`;
}

export default function CryptoPage() {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [searchCrypto, setSearchCrypto] = useState("");
  const [currency, setCurrency] = useState<Currency>("PKR");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchCrypto = async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const baseUrl = "https://api.coingecko.com/api/v3";

      const commonParams =
        `ids=${COINS.join(",")}` +
        `&order=market_cap_desc` +
        `&per_page=8` +
        `&page=1` +
        `&sparkline=false` +
        `&price_change_percentage=24h`;

      const [pkrResponse, usdResponse] = await Promise.all([
        fetch(
          `${baseUrl}/coins/markets?vs_currency=pkr&${commonParams}`,
          {
            cache: "no-store",
          }
        ),

        fetch(
          `${baseUrl}/coins/markets?vs_currency=usd&${commonParams}`,
          {
            cache: "no-store",
          }
        ),
      ]);

      if (!pkrResponse.ok || !usdResponse.ok) {
        throw new Error(
          "CoinGecko API response failed. API limit یا API key مسئلہ ہو سکتا ہے۔"
        );
      }

      const pkrData = await pkrResponse.json();
      const usdData = await usdResponse.json();

      const usdMap = new Map(
        usdData.map((coin: any) => [
          coin.id,
          {
            price_usd: coin.current_price,
            market_cap_usd: coin.market_cap,
          },
        ])
      );

      const mergedCoins: CryptoCoin[] = pkrData.map((coin: any) => {
        const usdCoin = usdMap.get(coin.id) as
          | {
              price_usd: number;
              market_cap_usd: number;
            }
          | undefined;

        return {
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image,
          market_cap_rank: coin.market_cap_rank,
          price_pkr: coin.current_price,
          price_usd: usdCoin?.price_usd ?? 0,
          change_24h: coin.price_change_percentage_24h ?? 0,
          market_cap_pkr: coin.market_cap ?? 0,
          market_cap_usd: usdCoin?.market_cap_usd ?? 0,
        };
      });

      setCoins(mergedCoins);
    } catch (err) {
      console.error(err);

      setError(
        "Crypto data load نہیں ہو سکا۔ براہِ کرم دوبارہ Refresh کریں۔"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCrypto();
  }, []);

  const filteredCoins = useMemo(() => {
    const query = searchCrypto.trim().toLowerCase();

    if (!query) {
      return coins;
    }

    return coins.filter((coin) => {
      return (
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query) ||
        coin.id.toLowerCase().includes(query)
      );
    });
  }, [coins, searchCrypto]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">₿</span>

                <span className="font-bold text-emerald-400">
                  PakUtility
                </span>
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl">
                Crypto Rates
              </h1>

              <p className="mt-2 text-slate-400">
                پاکستان میں cryptocurrency کی Live قیمتیں PKR اور USD میں
              </p>
            </div>

            <button
              onClick={() => fetchCrypto(true)}
              disabled={refreshing}
              className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-semibold transition hover:border-emerald-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {refreshing ? "Refreshing..." : "🔄 Refresh"}
            </button>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          {/* Search */}
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl">
              🔎
            </span>

            <input
              type="text"
              value={searchCrypto}
              onChange={(e) => setSearchCrypto(e.target.value)}
              placeholder="Bitcoin, Ethereum, BTC, SOL..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-4 pl-12 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
            />
          </div>

          {/* Currency Selector */}
          <div className="flex rounded-xl border border-slate-700 bg-slate-900 p-1">
            <button
              onClick={() => setCurrency("PKR")}
              className={`rounded-lg px-6 py-3 font-semibold transition ${
                currency === "PKR"
                  ? "bg-emerald-500 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              🇵🇰 PKR
            </button>

            <button
              onClick={() => setCurrency("USD")}
              className={`rounded-lg px-6 py-3 font-semibold transition ${
                currency === "USD"
                  ? "bg-emerald-500 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              🇺🇸 USD
            </button>
          </div>
        </div>

        {/* Search status */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-400">
          <span>
            Showing {filteredCoins.length} cryptocurrency
            {filteredCoins.length !== 1 ? "ies" : "y"}
          </span>

          {searchCrypto && (
            <button
              onClick={() => setSearchCrypto("")}
              className="text-emerald-400 hover:text-emerald-300"
            >
              Clear Search
            </button>
          )}
        </div>
      </section>

      {/* Error */}
      {error && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>

              <div>
                <p className="font-semibold">Crypto data error</p>

                <p className="mt-1 text-sm">{error}</p>

                <button
                  onClick={() => fetchCrypto(true)}
                  className="mt-3 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-semibold hover:bg-red-500/30"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Loading */}
      {loading && (
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 pb-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="h-12 w-12 rounded-full bg-slate-800" />

              <div className="mt-4 h-5 w-32 rounded bg-slate-800" />

              <div className="mt-3 h-8 w-40 rounded bg-slate-800" />

              <div className="mt-5 h-4 w-24 rounded bg-slate-800" />
            </div>
          ))}
        </section>
      )}

      {/* Crypto Cards */}
      {!loading && filteredCoins.length > 0 && (
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 pb-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {filteredCoins.map((coin) => {
            const primaryPrice =
              currency === "PKR" ? coin.price_pkr : coin.price_usd;

            const primaryMarketCap =
              currency === "PKR"
                ? coin.market_cap_pkr
                : coin.market_cap_usd;

            const isPositive = coin.change_24h >= 0;

            return (
              <article
                key={coin.id}
                className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-900/90"
              >
                {/* Coin Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="h-12 w-12 rounded-full"
                    />

                    <div>
                      <h2 className="font-bold text-white">
                        {coin.name}
                      </h2>

                      <p className="text-sm uppercase text-slate-500">
                        {coin.symbol}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-lg bg-slate-800 px-2 py-1 text-xs text-slate-400">
                    #{coin.market_cap_rank}
                  </span>
                </div>

                {/* Primary Price */}
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Price in {currency}
                  </p>

                  <p className="mt-1 break-all text-2xl font-bold text-emerald-400">
                    {formatCurrency(primaryPrice, currency)}
                  </p>
                </div>

                {/* Both Currencies */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-slate-950 p-3">
                    <p className="text-xs text-slate-500">PKR</p>

                    <p className="mt-1 break-all text-sm font-semibold text-white">
                      {formatCurrency(coin.price_pkr, "PKR")}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-3">
                    <p className="text-xs text-slate-500">USD</p>

                    <p className="mt-1 break-all text-sm font-semibold text-white">
                      {formatCurrency(coin.price_usd, "USD")}
                    </p>
                  </div>
                </div>

                {/* 24 Hour Change */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
                  <span className="text-sm text-slate-500">
                    24h Change
                  </span>

                  <span
                    className={`font-semibold ${
                      isPositive
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {coin.change_24h.toFixed(2)}%
                  </span>
                </div>

                {/* Market Cap */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Market Cap
                  </span>

                  <span className="text-sm font-semibold text-slate-300">
                    {formatMarketCap(primaryMarketCap, currency)}
                  </span>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* No Search Results */}
      {!loading && !error && filteredCoins.length === 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <div className="text-5xl">🔎</div>

            <h2 className="mt-4 text-xl font-bold">
              Crypto نہیں ملی
            </h2>

            <p className="mt-2 text-slate-400">
              Bitcoin، Ethereum، BTC یا کسی موجودہ cryptocurrency کا نام
              تلاش کریں۔
            </p>

            <button
              onClick={() => setSearchCrypto("")}
              className="mt-5 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Show All
            </button>
          </div>
        </section>
      )}{/* Gold & Silver */}
<section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
  <div className="mb-4">
    <h2 className="text-2xl font-bold">🥇 Gold & Silver</h2>
    <p className="mt-1 text-sm text-slate-400">
      Precious metals prices
    </p>
  </div>

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {/* Gold */}
    <div className="rounded-2xl border border-yellow-500/20 bg-slate-900 p-5">
      <div className="flex items-center gap-3">
        <div className="text-4xl">🥇</div>

        <div>
          <h3 className="text-xl font-bold">Gold</h3>
          <p className="text-sm text-slate-500">
            Gold / XAU
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-xs text-slate-500">USD / Ounce</p>
          <p className="mt-1 font-bold text-yellow-400">
            $3,650
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-xs text-slate-500">PKR / Ounce</p>
          <p className="mt-1 font-bold text-yellow-400">
            ₨1,020,000
          </p>
        </div>
      </div>
    </div>

    {/* Silver */}
    <div className="rounded-2xl border border-slate-600 bg-slate-900 p-5">
      <div className="flex items-center gap-3">
        <div className="text-4xl">🥈</div>

        <div>
          <h3 className="text-xl font-bold">Silver</h3>
          <p className="text-sm text-slate-500">
            Silver / XAG
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-xs text-slate-500">USD / Ounce</p>
          <p className="mt-1 font-bold text-slate-300">
            $42
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-xs text-slate-500">PKR / Ounce</p>
          <p className="mt-1 font-bold text-slate-300">
            ₨11,750
          </p>
        </div>
      </div>
    </div>
  </div>

  <p className="mt-3 text-xs text-slate-600">
    Gold/Silver values shown here are indicative and should not be
    considered live trading or investment prices.
  </p>
</section>

      {/* Advertisement */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/50">
          <span className="text-sm text-slate-600">
            Advertisement
          </span>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <p className="text-sm leading-6 text-yellow-200/70">
            ⚠️ Crypto prices market data کے مطابق تبدیل ہوتی رہتی ہیں۔
            PakUtility یہ معلومات صرف تعلیمی اور معلوماتی مقصد کے لیے
            فراہم کرتا ہے۔ یہ مالیاتی یا سرمایہ کاری کا مشورہ نہیں ہے۔
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} PakUtility — Crypto Rates
        </div>
      </footer>
    </main>
  );
}