"use client";

import { useEffect, useRef, useState } from "react";

type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

type Ayah = {
  number: number;
  numberInSurah: number;
  text: string;
};

type MatchedAyah = Ayah & {
  translation: string;
};

const ARABIC_EDITION = "quran-uthmani";
const URDU_EDITION = "ur.jalandhry";

export default function QuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState(1);

  const [arabicAyahs, setArabicAyahs] = useState<Ayah[]>([]);
  const [urduAyahs, setUrduAyahs] = useState<Ayah[]>([]);

  const [loadingSurahs, setLoadingSurahs] = useState(true);
  const [loadingQuran, setLoadingQuran] = useState(false);

  const [error, setError] = useState("");

  const [showTranslation, setShowTranslation] = useState(true);

  const [searchSurah, setSearchSurah] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ہر نئی audio request کو ایک ID ملے گی
  // اس سے پرانی play request نئی request میں مداخلت نہیں کرے گی۔
  const playRequestRef = useRef(0);

  // اگلی سورت خود چلانے کے لیے
  const autoPlayNextSurahRef = useRef(false);

  // --------------------------------------------------
  // SURAH LIST LOAD
  // --------------------------------------------------

  useEffect(() => {
    const controller = new AbortController();

    async function loadSurahs() {
      try {
        setLoadingSurahs(true);
        setError("");

        const response = await fetch(
          "https://api.alquran.cloud/v1/surah",
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("سورتوں کی فہرست حاصل نہیں ہو سکی۔");
        }

        const data = await response.json();

        setSurahs(data.data || []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error(err);
          setError("سورتوں کی فہرست لوڈ نہیں ہو سکی۔");
        }
      } finally {
        setLoadingSurahs(false);
      }
    }

    loadSurahs();

    return () => {
      controller.abort();
    };
  }, []);

  // --------------------------------------------------
  // AUDIO ELEMENT
  // --------------------------------------------------

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);

      if (arabicAyahs.length === 0 || currentAyah === null) {
        return;
      }

      // اگلی آیت موجود ہے
      if (currentAyah < arabicAyahs.length - 1) {
        playAyah(currentAyah + 1);
        return;
      }

      // موجودہ سورت ختم ہوگئی
      // اگلی سورت موجود ہے
      if (selectedSurah < 114) {
        autoPlayNextSurahRef.current = true;

        // پہلے audio مکمل reset
        audio.pause();
        audio.removeAttribute("src");
        audio.load();

        setCurrentAyah(null);
        setIsPlaying(false);

        setSelectedSurah((prev) => prev + 1);
      }
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [arabicAyahs, currentAyah, selectedSurah]);

  // --------------------------------------------------
  // SELECTED SURAH LOAD
  // --------------------------------------------------

  useEffect(() => {
    const controller = new AbortController();

    async function loadQuran() {
      try {
        setLoadingQuran(true);
        setError("");

        setArabicAyahs([]);
        setUrduAyahs([]);
        setCurrentAyah(null);

        const [arabicResponse, urduResponse] = await Promise.all([
          fetch(
            `https://api.alquran.cloud/v1/surah/${selectedSurah}/${ARABIC_EDITION}`,
            {
              signal: controller.signal,
            }
          ),

          fetch(
            `https://api.alquran.cloud/v1/surah/${selectedSurah}/${URDU_EDITION}`,
            {
              signal: controller.signal,
            }
          ),
        ]);

        if (!arabicResponse.ok || !urduResponse.ok) {
          throw new Error("قرآن کا ڈیٹا حاصل نہیں ہو سکا۔");
        }

        const arabicData = await arabicResponse.json();
        const urduData = await urduResponse.json();

        const arabic = arabicData.data?.ayahs || [];
        const urdu = urduData.data?.ayahs || [];

        setArabicAyahs(arabic);
        setUrduAyahs(urdu);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error(err);
          setError("اس سورت کا قرآن ڈیٹا لوڈ نہیں ہو سکا۔");
        }
      } finally {
        setLoadingQuran(false);
      }
    }

    loadQuran();

    return () => {
      controller.abort();
    };
  }, [selectedSurah]);

  // --------------------------------------------------
  // AUTO PLAY AFTER NEXT SURAH LOADS
  // --------------------------------------------------

  useEffect(() => {
    if (
      autoPlayNextSurahRef.current &&
      arabicAyahs.length > 0 &&
      !loadingQuran
    ) {
      autoPlayNextSurahRef.current = false;

      const timer = setTimeout(() => {
        playAyah(0);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [arabicAyahs, loadingQuran]);

  // --------------------------------------------------
  // AUDIO CLEANUP ON PAGE CLOSE
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      playRequestRef.current += 1;

      const audio = audioRef.current;

      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    };
  }, []);

  // --------------------------------------------------
  // SEARCH SURAH
  // --------------------------------------------------

  const normalizedSearch = searchSurah
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  const filteredSurahs = surahs.filter((surah) => {
    if (!normalizedSearch) return false;

    const number = String(surah.number).toLowerCase();

    const arabicName = surah.name.toLowerCase();
    const englishName = surah.englishName.toLowerCase();
    const englishTranslation =
      surah.englishNameTranslation.toLowerCase();

    return (
      number.includes(normalizedSearch) ||
      arabicName.includes(normalizedSearch) ||
      englishName.includes(normalizedSearch) ||
      englishTranslation.includes(normalizedSearch)
    );
  });

  // --------------------------------------------------
  // GET AUDIO
  // --------------------------------------------------

  function getAudioElement() {
    if (!audioRef.current) {
      return null;
    }

    return audioRef.current;
  }

  // --------------------------------------------------
  // PLAY AYAH
  // --------------------------------------------------

  async function playAyah(index: number) {
    const ayah = arabicAyahs[index];

    if (!ayah) return;

    const audio = getAudioElement();

    if (!audio) return;

    const requestId = ++playRequestRef.current;

    try {
      // موجودہ audio اگر چل رہی ہو تو پہلے روکیں
      if (!audio.paused) {
        audio.pause();
      }

      audio.currentTime = 0;

      const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`;

      audio.src = audioUrl;

      audio.load();

      setCurrentAyah(index);
      setIsPlaying(false);

      await audio.play();

      // اگر اس دوران کوئی نئی request آگئی ہو
      // تو پرانی request کو ignore کریں۔
      if (requestId !== playRequestRef.current) {
        return;
      }

      setIsPlaying(true);
    } catch (err) {
      // AbortError اکثر intentional pause/source change کی وجہ سے آتا ہے۔
      // اسے error کے طور پر show نہیں کرنا۔
      if ((err as Error).name === "AbortError") {
        return;
      }

      console.error("Audio play error:", err);

      if (requestId === playRequestRef.current) {
        setIsPlaying(false);
      }
    }
  }

  // --------------------------------------------------
  // PLAY SURAH
  // --------------------------------------------------

  function playSurah() {
    if (arabicAyahs.length === 0) return;

    const startIndex = currentAyah ?? 0;

    playAyah(startIndex);
  }

  // --------------------------------------------------
  // PAUSE
  // --------------------------------------------------

  function pauseAudio() {
    const audio = getAudioElement();

    if (!audio) return;

    playRequestRef.current += 1;

    audio.pause();

    setIsPlaying(false);
  }

  // --------------------------------------------------
  // RESUME
  // --------------------------------------------------

  async function resumeAudio() {
    const audio = getAudioElement();

    if (!audio || !audio.src) {
      playSurah();
      return;
    }

    const requestId = ++playRequestRef.current;

    try {
      await audio.play();

      if (requestId !== playRequestRef.current) {
        return;
      }

      setIsPlaying(true);
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        return;
      }

      console.error("Audio resume error:", err);
    }
  }

  // --------------------------------------------------
  // STOP
  // --------------------------------------------------

  function stopAudio() {
    const audio = getAudioElement();

    if (!audio) return;

    playRequestRef.current += 1;

    audio.pause();
    audio.currentTime = 0;

    setIsPlaying(false);
    setCurrentAyah(null);
  }

  // --------------------------------------------------
  // NEXT AYAH
  // --------------------------------------------------

  function nextAyah() {
    if (arabicAyahs.length === 0) return;

    if (currentAyah === null) {
      playAyah(0);
      return;
    }

    const nextIndex = currentAyah + 1;

    if (nextIndex < arabicAyahs.length) {
      playAyah(nextIndex);
    } else if (selectedSurah < 114) {
      goToNextSurah(true);
    }
  }

  // --------------------------------------------------
  // PREVIOUS AYAH
  // --------------------------------------------------

  function previousAyah() {
    if (arabicAyahs.length === 0) return;

    if (currentAyah === null) {
      playAyah(0);
      return;
    }

    const previousIndex = currentAyah - 1;

    if (previousIndex >= 0) {
      playAyah(previousIndex);
    }
  }

  // --------------------------------------------------
  // NEXT SURAH
  // --------------------------------------------------

  function goToNextSurah(autoPlay = false) {
    if (selectedSurah >= 114) return;

    const audio = getAudioElement();

    playRequestRef.current += 1;

    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }

    setIsPlaying(false);
    setCurrentAyah(null);

    autoPlayNextSurahRef.current = autoPlay;

    setSelectedSurah((prev) => prev + 1);

    setSearchSurah("");
    setShowSearchResults(false);
  }

  // --------------------------------------------------
  // PREVIOUS SURAH
  // --------------------------------------------------

  function goToPreviousSurah() {
    if (selectedSurah <= 1) return;

    const audio = getAudioElement();

    playRequestRef.current += 1;

    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }

    setIsPlaying(false);
    setCurrentAyah(null);

    autoPlayNextSurahRef.current = false;

    setSelectedSurah((prev) => prev - 1);

    setSearchSurah("");
    setShowSearchResults(false);
  }

  // --------------------------------------------------
  // SELECT SURAH FROM SEARCH
  // --------------------------------------------------

  function selectSurah(number: number) {
    const audio = getAudioElement();

    playRequestRef.current += 1;

    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }

    setIsPlaying(false);
    setCurrentAyah(null);

    autoPlayNextSurahRef.current = false;

    setSelectedSurah(number);

    setSearchSurah("");
    setShowSearchResults(false);
  }

  // --------------------------------------------------
  // SELECTED SURAH INFO
  // --------------------------------------------------

  const currentSurah = surahs.find(
    (surah) => surah.number === selectedSurah
  );

  // --------------------------------------------------
  // MATCH ARABIC + URDU
  // --------------------------------------------------

  const matchedAyahs: MatchedAyah[] = arabicAyahs.map((ayah) => {
    const translation = urduAyahs.find(
      (item) => item.numberInSurah === ayah.numberInSurah
    );

    return {
      ...ayah,
      translation: translation?.text || "",
    };
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* AUDIO ELEMENT */}
      <audio
        ref={audioRef}
        preload="none"
        className="hidden"
      />

      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-emerald-400">
              پاک یوٹیلٹی
            </h1>

            <p className="text-sm text-slate-400">
              قرآن مجید
            </p>
          </div>

          <a
            href="/"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
          >
            ← ہوم
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* TITLE */}
        <section className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            قرآن مجید
          </h2>

          <p className="mt-2 text-slate-400">
            مکمل سورت، اردو ترجمہ اور تلاوت
          </p>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-300">
            {error}
          </div>
        )}

        {/* SURAH SEARCH */}
        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
          <label
            htmlFor="surah-search"
            className="mb-2 block text-right text-sm font-medium text-slate-300"
          >
            سورت تلاش کریں
          </label>

          <div className="relative">
            <input
              id="surah-search"
              type="text"
              value={searchSurah}
              onChange={(e) => {
                setSearchSurah(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => {
                if (searchSurah.trim()) {
                  setShowSearchResults(true);
                }
              }}
              placeholder="مثلاً: بقرہ، Baqarah، 2"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-right text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
            />

            {searchSurah && (
              <button
                type="button"
                onClick={() => {
                  setSearchSurah("");
                  setShowSearchResults(false);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}

            {/* SEARCH RESULTS */}
            {showSearchResults && searchSurah.trim() && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
                {loadingSurahs ? (
                  <div className="p-4 text-center text-slate-400">
                    سورتیں لوڈ ہو رہی ہیں...
                  </div>
                ) : filteredSurahs.length > 0 ? (
                  filteredSurahs.map((surah) => (
                    <button
                      key={surah.number}
                      type="button"
                      onClick={() => selectSurah(surah.number)}
                      className="flex w-full items-center justify-between border-b border-slate-800 px-4 py-3 text-right transition last:border-b-0 hover:bg-slate-800"
                    >
                      <div className="text-left">
                        <span className="text-xs text-slate-500">
                          {surah.number}
                        </span>
                      </div>

                      <div>
                        <div className="font-bold text-emerald-400">
                          {surah.name}
                        </div>

                        <div className="text-sm text-slate-300">
                          {surah.englishName}
                        </div>

                        <div className="text-xs text-slate-500">
                          {surah.englishNameTranslation}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-5 text-center">
                    <p className="text-slate-300">
                      کوئی سورت نہیں ملی
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      سورت کا نام، English نام یا سورت نمبر لکھیں۔
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="mt-2 text-right text-xs text-slate-500">
            اردو، English یا سورت نمبر سے تلاش کر سکتے ہیں۔
          </p>
        </section>

        {/* CURRENT SURAH SELECTOR */}
        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={goToPreviousSurah}
              disabled={selectedSurah <= 1}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ← پچھلی سورت
            </button>

            <div className="text-center">
              {currentSurah ? (
                <>
                  <div className="text-2xl font-bold text-emerald-400">
                    {currentSurah.name}
                  </div>

                  <div className="mt-1 text-sm text-slate-400">
                    {currentSurah.englishName} • سورت نمبر{" "}
                    {currentSurah.number}
                  </div>
                </>
              ) : (
                <div className="text-slate-400">
                  سورت لوڈ ہو رہی ہے...
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => goToNextSurah(false)}
              disabled={selectedSurah >= 114}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-30"
            >
              اگلی سورت →
            </button>
          </div>
        </section>

        {/* SURAH INFORMATION */}
        {currentSurah && (
          <section className="mb-6 rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-5">
            <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
              <div>
                <div className="text-xs text-slate-500">
                  سورت
                </div>

                <div className="mt-1 font-bold text-emerald-400">
                  {currentSurah.number}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">
                  آیات
                </div>

                <div className="mt-1 font-bold text-white">
                  {currentSurah.numberOfAyahs}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">
                  English
                </div>

                <div className="mt-1 font-bold text-white">
                  {currentSurah.englishName}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">
                  نزول
                </div>

                <div className="mt-1 font-bold text-white">
                  {currentSurah.revelationType === "Meccan"
                    ? "مکی"
                    : "مدنی"}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TRANSLATION TOGGLE */}
        <section className="mb-6 flex justify-center">
          <div className="inline-flex rounded-xl border border-slate-700 bg-slate-900 p-1">
            <button
              type="button"
              onClick={() => setShowTranslation(true)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                showTranslation
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              📖 ترجمہ کے ساتھ
            </button>

            <button
              type="button"
              onClick={() => setShowTranslation(false)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                !showTranslation
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🕋 صرف عربی
            </button>
          </div>
        </section>

        {/* LOADING */}
        {loadingQuran && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <div className="text-4xl">📖</div>

            <p className="mt-3 text-slate-400">
              سورت لوڈ ہو رہی ہے...
            </p>
          </div>
        )}

        {/* AYAH LIST */}
        {!loadingQuran && matchedAyahs.length > 0 && (
          <section className="space-y-4 pb-40">
            {matchedAyahs.map((ayah, index) => {
              const isCurrent = currentAyah === index;

              return (
                <article
                  key={ayah.number}
                  className={`rounded-2xl border p-5 transition ${
                    isCurrent
                      ? "border-emerald-500 bg-emerald-950/30 shadow-lg shadow-emerald-950/20"
                      : "border-slate-800 bg-slate-900"
                  }`}
                >
                  {/* AYAH HEADER */}
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                        isCurrent
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {ayah.numberInSurah}
                    </span>

                    <button
                      type="button"
                      onClick={() => playAyah(index)}
                      className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
                    >
                      ▶ آیت چلائیں
                    </button>
                  </div>

                  {/* ARABIC */}
                  <p
                    dir="rtl"
                    className={`text-right font-serif text-3xl leading-[2.3] ${
                      isCurrent
                        ? "text-emerald-300"
                        : "text-white"
                    }`}
                  >
                    {ayah.text}
                  </p>

                  {/* URDU TRANSLATION */}
                  {showTranslation && (
                    <div className="mt-6 border-t border-slate-800 pt-5">
                      <p
                        dir="rtl"
                        className="text-right text-lg leading-9 text-slate-300"
                      >
                        {ayah.translation}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}

        {/* NO DATA */}
        {!loadingQuran &&
          !error &&
          arabicAyahs.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
              سورت کا ڈیٹا دستیاب نہیں ہے۔
            </div>
          )}
      </div>

      {/* STICKY AUDIO PLAYER */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur">
        <div className="mx-auto max-w-6xl px-3 py-3">
          <div className="mb-2 text-center text-xs text-slate-500">
            {currentAyah !== null
              ? `آیت ${currentAyah + 1} / ${arabicAyahs.length}`
              : "تلاوت شروع کرنے کے لیے Play دبائیں"}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* PREVIOUS SURAH */}
            <button
              type="button"
              onClick={goToPreviousSurah}
              disabled={selectedSurah <= 1}
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs transition hover:border-emerald-500 disabled:opacity-30"
            >
              ⏮ سورت
            </button>

            {/* PREVIOUS AYAH */}
            <button
              type="button"
              onClick={previousAyah}
              disabled={
                arabicAyahs.length === 0 ||
                currentAyah === null ||
                currentAyah <= 0
              }
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs transition hover:border-emerald-500 disabled:opacity-30"
            >
              ⏪ آیت
            </button>

            {/* PLAY */}
            <button
              type="button"
              onClick={playSurah}
              disabled={arabicAyahs.length === 0}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-30"
            >
              ▶ Play
            </button>

            {/* PAUSE */}
            <button
              type="button"
              onClick={pauseAudio}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-amber-500"
            >
              ⏸ Pause
            </button>

            {/* RESUME */}
            <button
              type="button"
              onClick={resumeAudio}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-blue-500"
            >
              ▶ Resume
            </button>

            {/* STOP */}
            <button
              type="button"
              onClick={stopAudio}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-red-500"
            >
              ⏹ Stop
            </button>

            {/* NEXT AYAH */}
            <button
              type="button"
              onClick={nextAyah}
              disabled={arabicAyahs.length === 0}
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs transition hover:border-emerald-500 disabled:opacity-30"
            >
              آیت ⏩
            </button>

            {/* NEXT SURAH */}
            <button
              type="button"
              onClick={() => goToNextSurah(false)}
              disabled={selectedSurah >= 114}
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs transition hover:border-emerald-500 disabled:opacity-30"
            >
              سورت ⏭
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}