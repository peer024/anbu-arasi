"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Heart, Sparkles, Star } from "lucide-react";

import { DailyExperience } from "@/components/daily/DailyExperience";
import { BirthdayExperience } from "@/components/birthday/BirthdayExperience";
import { CosmicBackground } from "@/components/effects/CosmicBackground";
import { CursorSparkles } from "@/components/effects/CursorSparkles";
import { getDailyContent } from "@/data/daily";
import { sounds } from "@/lib/soundEffects";

/* =========================================================
   SETTINGS
========================================================= */

const PREVIEW_MODE = false;
const PREVIEW_DAY = 4;
const TEST_BIRTHDAY_MODE = false;

const BIRTHDAY_DATE = new Date("2027-03-03T00:00:00+05:30");

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(): TimeLeft {
  const difference = BIRTHDAY_DATE.getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function formatNumber(value: number) {
  return value.toString().padStart(2, "0");
}

/* =========================================================
   3D TILT COUNTDOWN CARD
========================================================= */

function TiltCountdownCard({
  label,
  value,
  index,
}: {
  label: string;
  value: number;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTilt({
      x: rotateX,
      y: rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    sounds.playChime(600 + index * 100, 0.4);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15 * index, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.045 : 1}, ${isHovered ? 1.045 : 1}, 1)`,
        transition: isHovered
          ? "transform 0.1s cubic-bezier(0.2, 0, 0, 1)"
          : "transform 0.6s cubic-bezier(0.2, 0, 0, 1)",
      }}
      className="
        group relative overflow-hidden rounded-[26px] sm:rounded-[34px]
        border border-amber-300/35 ring-1 ring-white/15
        bg-gradient-to-b from-neutral-900/90 via-black/85 to-neutral-950/95
        px-3 py-6 sm:px-6 sm:py-9 backdrop-blur-3xl
        shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(251,191,36,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]
      "
    >
      {/* Corner Gold Notches */}
      <div className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 border-l border-t border-amber-300/60 rounded-tl-sm" />
      <div className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 border-r border-t border-amber-300/60 rounded-tr-sm" />

      {/* Dynamic Specular Prismatic Glare */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 140px at ${tilt.glareX}% ${tilt.glareY}%, rgba(251, 191, 36, 0.45), rgba(251, 113, 133, 0.25), transparent 70%)`,
          }}
        />
      )}

      {/* Ambient Top Glow */}
      <div className="pointer-events-none absolute -top-12 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-amber-400/20 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:bg-amber-300/30" />

      <div className="relative text-center" style={{ transform: "translateZ(25px)" }}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="font-display text-4xl font-normal tracking-tight text-white drop-shadow-[0_0_25px_rgba(251,191,36,0.35)] sm:text-6xl md:text-7xl"
          >
            {formatNumber(value)}
          </motion.div>
        </AnimatePresence>

        <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5">
          <span className="h-px w-2 sm:w-3 bg-amber-300/40" />
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-amber-200/70 font-medium">
            {label}
          </span>
          <span className="h-px w-2 sm:w-3 bg-amber-300/40" />
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   HOME
========================================================= */

export default function Home() {
  const dailyContent = getDailyContent(PREVIEW_MODE ? PREVIEW_DAY : undefined);

  const [entered, setEntered] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [birthdayStarted, setBirthdayStarted] = useState(
    TEST_BIRTHDAY_MODE || Date.now() >= BIRTHDAY_DATE.getTime()
  );

  useEffect(() => {
    if (TEST_BIRTHDAY_MODE) {
      setBirthdayStarted(true);
      return;
    }

    const checkBirthday = () => {
      const now = Date.now();
      const difference = BIRTHDAY_DATE.getTime() - now;
      setTimeLeft(calculateTimeLeft());
      if (difference <= 0) {
        setBirthdayStarted(true);
      }
    };

    checkBirthday();
    const timer = window.setInterval(checkBirthday, 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (birthdayStarted) {
    return <BirthdayExperience photoSrc={dailyContent.memory?.image} />;
  }

  const countdown = PREVIEW_MODE
    ? { days: 999, hours: 23, minutes: 59, seconds: 59 }
    : timeLeft;

  const handleEnterWorld = () => {
    sounds.playCelebration();
    setEntered(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030206] text-white">
      {/* Real-time Interactive Starfield & Constellations */}
      <CosmicBackground />

      {/* Interactive Cursor Stardust Sparkle Trail */}
      <CursorSparkles />

      {/* Top Royal Date Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="fixed left-1/2 top-4 sm:top-6 z-40 -translate-x-1/2 max-w-[90vw]"
      >
        <button
          type="button"
          onClick={() => sounds.playSparkle()}
          className="flex items-center gap-2 rounded-full border border-amber-300/30 bg-black/70 px-4 py-1.5 sm:px-5 sm:py-2 backdrop-blur-2xl shadow-xl shadow-amber-950/20 hover:border-amber-300/60 transition"
        >
          <Sparkles size={11} className="text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.45em] text-amber-200 font-light whitespace-nowrap">
            03 • 03 • 2027 • Anbu Arasi
          </span>
          <Sparkles size={11} className="text-amber-300" />
        </button>
      </motion.div>

      {/* ===================================================
          INTRO HERO
      =================================================== */}
      {!entered ? (
        <motion.section
          key="intro-screen"
          className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 1 }}
        >
          <div className="w-full max-w-4xl text-center">
            {/* Royal Monogram Crest Seal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative mx-auto mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-2 border-amber-300/60 bg-gradient-to-tr from-neutral-900 via-amber-950/40 to-neutral-900 shadow-[0_0_50px_rgba(251,191,36,0.35)]"
            >
              <div className="pointer-events-none absolute inset-1 rounded-full border border-white/20 animate-spin" style={{ animationDuration: "12s" }} />
              <span className="font-serif text-2xl sm:text-3xl font-light text-amber-200 tracking-wider">
                AA
              </span>
              <div className="absolute -bottom-1 h-3 w-3 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e]" />
            </motion.div>

            {/* Pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-500/[0.08] px-4 py-1.5 sm:px-5 sm:py-2 backdrop-blur-xl max-w-full"
            >
              <Star size={11} className="text-amber-300 shrink-0" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-amber-200/90 font-medium truncate">
                A Royal Sanctuary Crafted For You
              </span>
              <Star size={11} className="text-amber-300 shrink-0" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="font-serif text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight leading-tight"
            >
              Something
              <span className="mt-2 block font-display italic text-gold-shimmer">
                magical awaits.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.9 }}
              className="mx-auto mt-6 sm:mt-8 max-w-lg text-sm sm:text-base font-light leading-relaxed text-white/55 px-2"
            >
              A private, eternal universe created exclusively for Anbu Arasi.
              <br />
              Step inside and let 365 days of cherished moments unfold.
            </motion.p>

            {/* Magnetic CTA Button with Double Pulsing Halo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.9 }}
              className="relative mt-10 sm:mt-12 inline-block"
            >
              {/* Outer Pulsing Glow Aura */}
              <div className="pointer-events-none absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-400/40 via-rose-500/30 to-purple-500/40 blur-lg opacity-75 animate-pulse" />

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnterWorld}
                className="
                  group relative mx-auto inline-flex items-center gap-3 sm:gap-4
                  rounded-full border border-amber-300/50
                  bg-gradient-to-r from-amber-600/30 via-rose-600/20 to-purple-600/30
                  p-2 pl-6 sm:pl-8 backdrop-blur-2xl
                  shadow-[0_0_50px_rgba(251,191,36,0.4)]
                  transition-all duration-500
                  hover:border-amber-300/80 hover:shadow-[0_0_70px_rgba(251,191,36,0.65)]
                "
              >
                <span className="text-xs sm:text-sm font-medium tracking-wide text-white">
                  Enter your royal world ✨
                </span>

                <span className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-amber-100">
                  <ArrowRight size={16} />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </motion.section>
      ) : (
        <>
          {/* =================================================
              COUNTDOWN SECTION
          ================================================= */}
          <motion.section
            key="countdown-screen"
            className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 pb-16"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="w-full max-w-6xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.45em] text-amber-300/80"
              >
                <Sparkles size={11} />
                <span>Counting down to your special day</span>
                <Sparkles size={11} />
              </motion.div>

              <h2 className="mt-4 sm:mt-5 font-serif text-3xl sm:text-6xl md:text-7xl font-light tracking-tight text-white">
                03 March 2027
              </h2>

              <p className="mx-auto mt-3 sm:mt-4 max-w-md text-xs sm:text-sm leading-relaxed text-white/45 font-light px-2">
                One day at a time.
                <br />
                One priceless memory at a time.
              </p>

              {/* 3D TILT COUNTDOWN GRID */}
              <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-16 sm:grid-cols-4 sm:gap-6">
                <TiltCountdownCard label="Days" value={countdown.days} index={0} />
                <TiltCountdownCard label="Hours" value={countdown.hours} index={1} />
                <TiltCountdownCard label="Minutes" value={countdown.minutes} index={2} />
                <TiltCountdownCard label="Seconds" value={countdown.seconds} index={3} />
              </div>

              {/* DIVIDER WITH ROMANTIC QUOTE */}
              <div className="mx-auto mt-12 sm:mt-16 flex max-w-xl items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-white/35 font-light px-4">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent" />
                <span className="italic text-amber-200/80">Every second brings us closer</span>
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent" />
              </div>

              {/* PREVIEW INDICATOR */}
              {PREVIEW_MODE && (
                <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/[0.05] px-5 py-2 text-[9px] uppercase tracking-[0.35em] text-amber-200/50">
                  <Sparkles size={11} />
                  Preview Mode — Day {PREVIEW_DAY}
                </div>
              )}
            </div>
          </motion.section>

          {/* =================================================
              DAILY EXPERIENCE
          ================================================= */}
          <DailyExperience
            day={dailyContent.day}
            daysRemaining={dailyContent.daysRemaining}
            photoSrc={dailyContent.memory?.image}
            quote={dailyContent.quote?.text}
            songSrc={dailyContent.song?.src}
            songTitle={dailyContent.song?.title}
          />
        </>
      )}

      {/* Bottom Glowing Rim */}
      <div className="pointer-events-none fixed bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-rose-300/20 to-transparent" />
    </main>
  );
}