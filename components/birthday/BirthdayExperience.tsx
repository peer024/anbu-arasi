"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MemoryTimeline } from "./MemoryTimeline";
import { WhySpecial } from "./WhySpecial";
import { SecretGift } from "./SecretGift";
import { BirthdayCake } from "./BirthdayCake";
import { SecretLetters } from "./SecretLetters";
import { BirthdayNight } from "./BirthdayNight";
import { CosmicBackground } from "@/components/effects/CosmicBackground";
import { CursorSparkles } from "@/components/effects/CursorSparkles";
import { sounds } from "@/lib/soundEffects";

import {
  Cake,
  Heart,
  Sparkles,
  Star,
  Music2,
  Volume2,
  VolumeX,
  Mail,
  ArrowDown,
  X,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Disc,
  Crown,
  Gem,
  Moon,
  Waves,
} from "lucide-react";

import { memories } from "@/data/memories";

/* =========================================================
   BIRTHDAY SONGS
========================================================= */

const BIRTHDAY_SONGS = [
  {
    title: "A little song for you",
    src: "/music/birthday-01.mp3",
  },
  {
    title: "Another little memory",
    src: "/music/birthday-02.mp3",
  },
  {
    title: "For your special day",
    src: "/music/birthday-03.mp3",
  },
];

/* =========================================================
   BIRTHDAY PHOTOS
========================================================= */

const BIRTHDAY_PHOTOS = memories.map((m) => m.image);

/* =========================================================
   LETTER
========================================================= */

const LETTER_LINES = [
  "Happy Birthday to you, Mah ❤️",
  "Unga birthday enakku romba special day, Mah.",
  "Ennaiku ungala first time patheno, appove oru vishayam decide pannitten...",
  "Neenga en life-la irundha, en life romba happy-aa irukkum-nu.",
  "Ungakooda pesaama irukka ennala mudiyave mudiyathu, Mah.",
  "Neenga sonneenga-nu, unga vaarthaikkaaga mattum dhaan sila neram pesaama irundhen.",
  "Enakku summa ellaaraiyum pidikkaathu, Mah...",
  "Aana ungala first time paathadhum enakku pidichirundhuchu.",
  "Adhu yen-nu enakkum theriyala.",
  "Aana andha feeling mattum konjam konjam-aa innaikku varaikkum maarave illa.",
  "Ennodaiya motha anbukkum sondhakkaariya,",
  "en Anbu Arasi-aa neenga mattum dhaan irukkanum nu naan aasai paduren, Mah. ❤️",
  "Oru vishayam mattum eppovume marakkaatheenga...",
  "Ennaikkum, eppovum, ungalukkaaga naan iruppen.",
  "Naan iruppen, Mah. ❤️",
];

/* =========================================================
   COMPONENT
========================================================= */

type BirthdayExperienceProps = {
  photoSrc?: string;
};

export function BirthdayExperience({ photoSrc }: BirthdayExperienceProps) {
  const [started, setStarted] = useState(false);
  const [showHeartIntro, setShowHeartIntro] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [songIndex, setSongIndex] = useState(0);
  const songIndexRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activePhoto = photoSrc || BIRTHDAY_PHOTOS[photoIndex];

  const heartParticles = useMemo(
    () =>
      Array.from({ length: 84 }, (_, index) => {
        const t = (Math.PI * 2 * index) / 84;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y =
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t);

        return {
          id: index,
          startX: (index * 47) % 100,
          startY: (index * 83) % 100,
          x: x * 9.5,
          y: -y * 9.5,
          delay: (index / 84) * 1.5,
        };
      }),
    []
  );

  /* =======================================================
     START EXPERIENCE
  ======================================================= */

  const startBirthdayExperience = async () => {
    sounds.playCelebration();
    setStarted(true);
    setShowHeartIntro(true);

    window.setTimeout(() => {
      setShowHeartIntro(false);
    }, 5200);

    const audio = audioRef.current;
    if (!audio) return;

    songIndexRef.current = 0;
    setSongIndex(0);
    audio.pause();
    audio.src = BIRTHDAY_SONGS[0].src;
    audio.currentTime = 0;
    audio.muted = false;

    try {
      await audio.play();
      setIsPlaying(true);
      setIsMuted(false);
    } catch (error) {
      console.error("Birthday audio could not start:", error);
    }
  };

  /* =======================================================
     PLAY NEXT SONG
  ======================================================= */

  const playNextSong = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextIndex = (songIndexRef.current + 1) % BIRTHDAY_SONGS.length;
    songIndexRef.current = nextIndex;
    setSongIndex(nextIndex);

    audio.pause();
    audio.src = BIRTHDAY_SONGS[nextIndex].src;
    audio.currentTime = 0;
    audio.muted = false;

    try {
      await audio.play();
      setIsPlaying(true);
      setIsMuted(false);
    } catch {
      setIsPlaying(false);
    }
  };

  /* =======================================================
     PERSISTENT BIRTHDAY AUDIO WITH INSTANT AUTOPLAY UNLOCK
  ======================================================= */

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = BIRTHDAY_SONGS[0].src;
    audio.volume = 1;
    audioRef.current = audio;

    const handleEnded = () => {
      void playNextSong();
    };

    audio.addEventListener("ended", handleEnded);

    // 1. Attempt immediate autoplay
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Unblock audio on first interaction seamlessly
          const unlock = () => {
            if (!audioRef.current) return;
            audioRef.current
              .play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch(() => {});
            window.removeEventListener("pointerdown", unlock);
            window.removeEventListener("touchstart", unlock);
            window.removeEventListener("click", unlock);
            window.removeEventListener("keydown", unlock);
          };

          window.addEventListener("pointerdown", unlock, { once: true, passive: true });
          window.addEventListener("touchstart", unlock, { once: true, passive: true });
          window.addEventListener("click", unlock, { once: true });
          window.addEventListener("keydown", unlock, { once: true });
        });
    }

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  }, []);

  /* =======================================================
     PHOTO ROTATION
  ======================================================= */

  useEffect(() => {
    if (!started) return;
    const timer = window.setInterval(() => {
      setPhotoIndex((current) => (current + 1) % BIRTHDAY_PHOTOS.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [started]);

  /* =======================================================
     LETTER ANIMATION
  ======================================================= */

  useEffect(() => {
    if (!showLetter) {
      setVisibleLines(0);
      return;
    }

    setVisibleLines(0);
    const timers: number[] = [];

    LETTER_LINES.forEach((_, index) => {
      const timer = window.setTimeout(() => {
        setVisibleLines(index + 1);
        sounds.playChime(500 + index * 40, 0.4);
      }, 450 * index);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [showLetter]);

  /* =======================================================
     PLAY / PAUSE
  ======================================================= */

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Audio playback failed:", error);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  /* =======================================================
     PRE-INTRO SCREEN
  ======================================================= */

  if (!started) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#030206] text-white">
        <BirthdayNight />
        <CosmicBackground />
        <CursorSparkles />

        {/* Ambient Aurora Glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/15 blur-[150px]"
          />
          <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[130px]" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-pink-500/10 blur-[140px]" />
        </div>

        <section className="relative z-10 flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-rose-300/30 bg-gradient-to-b from-rose-500/20 to-purple-500/10 shadow-[0_0_50px_rgba(251,113,133,0.3)] backdrop-blur-2xl"
            >
              <Cake size={40} strokeWidth={1.2} className="text-rose-200" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-rose-200/20 bg-rose-500/[0.08] px-5 py-2 text-[10px] uppercase tracking-[0.5em] text-rose-200/80"
            >
              <Sparkles size={11} />
              <span>03 • 03 • 2027</span>
              <Sparkles size={11} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="mt-6 font-serif text-5xl font-light tracking-tight sm:text-7xl md:text-8xl"
            >
              Today is
              <span className="mt-2 block font-display italic text-shimmer">
                your day.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mx-auto mt-8 max-w-md text-base leading-relaxed text-white/50 font-light"
            >
              The countdown has ended.
              <br />
              A world full of love and beautiful memories is waiting just for you.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={startBirthdayExperience}
              className="
                group mx-auto mt-12 flex items-center gap-3.5 rounded-full
                border border-rose-300/40 bg-gradient-to-r from-rose-500/25 via-pink-500/20 to-purple-500/25
                px-9 py-4 text-sm font-medium text-white shadow-[0_0_50px_rgba(251,113,133,0.35)]
                backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_0_70px_rgba(251,113,133,0.55)]
              "
            >
              <Sparkles size={16} className="text-rose-200" />
              <span>Open your surprise</span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3 }}
              className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/30"
            >
              <Music2 size={13} />
              <span>Three special songs are queued for you</span>
            </motion.div>
          </div>
        </section>
      </main>
    );
  }

  /* =======================================================
     MAIN EXPERIENCE
  ======================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030206] text-white">
      <CosmicBackground />
      <CursorSparkles />

      {/* ===================================================
          OPEN SURPRISE → STARDUST HEART REVEAL
      =================================================== */}
      <AnimatePresence>
        {showHeartIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-[#030206]/98 px-5 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.1, 1], opacity: [0, 0.4, 0.2] }}
              transition={{ duration: 4, ease: "easeOut" }}
              className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-rose-500/25 blur-[140px]"
            />

            <div className="relative h-[450px] w-[450px]">
              {heartParticles.map((particle) => (
                <motion.span
                  key={particle.id}
                  initial={{
                    left: `${particle.startX}%`,
                    top: `${particle.startY}%`,
                    opacity: 0,
                    scale: 0.15,
                  }}
                  animate={{
                    left: `calc(50% + ${particle.x}px)`,
                    top: `calc(50% + ${particle.y}px)`,
                    opacity: [0, 0.9, 1],
                    scale: [0.15, 1.2, 0.75],
                  }}
                  transition={{
                    duration: 3.5,
                    delay: particle.delay,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute -ml-[3px] -mt-[3px] h-[7px] w-[7px] rounded-full bg-rose-100 shadow-[0_0_16px_rgba(251,113,133,1)]"
                />
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: [0, 0, 0.9, 0.45], scale: [0.75, 0.95, 1.05, 1] }}
                transition={{ duration: 4.2, times: [0, 0.7, 0.9, 1] }}
                className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-rose-300/30 shadow-[0_0_90px_rgba(251,113,133,0.4)]"
              />

              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 3.2, duration: 0.9, type: "spring", stiffness: 120, damping: 14 }}
                className="absolute inset-0 flex items-center justify-center text-center"
              >
                <div>
                  <div className="text-[10px] uppercase tracking-[0.6em] text-rose-200/60 font-medium">
                    Happy Birthday
                  </div>
                  <div className="mt-3 font-serif text-5xl font-light tracking-tight text-white drop-shadow-[0_0_35px_rgba(251,113,133,0.6)] sm:text-7xl">
                    Anbu Arasi
                  </div>
                  <div className="mt-3 text-lg text-rose-200/80">❤️</div>
                </div>
              </motion.div>
            </div>

            <div className="pointer-events-none absolute bottom-12 text-[10px] uppercase tracking-[0.45em] text-white/30">
              A little world, made with all my love
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================
          FLOATING LUXURY VINYL AUDIO STUDIO
      =================================================== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          fixed right-3 top-3 sm:right-5 sm:top-5 z-50 flex items-center gap-1.5 sm:gap-3
          rounded-full border border-white/[0.12]
          bg-black/75 p-1.5 sm:p-2 backdrop-blur-2xl
          shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(251,113,133,0.15)]
        "
      >
        {/* Rotating Vinyl Record Icon */}
        <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center overflow-hidden rounded-full bg-neutral-900 border border-white/10 shadow-inner">
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={isPlaying ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
            className="flex items-center justify-center text-rose-300/80"
          >
            <Disc size={22} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
          </motion.div>
        </div>

        {/* Track Title + Equalizer */}
        <div className="hidden min-w-[140px] px-2 text-left sm:block">
          <div className="truncate text-[11px] font-medium text-white/90">
            {BIRTHDAY_SONGS[songIndex].title}
          </div>

          <div className="mt-1 flex items-center gap-1">
            {isPlaying ? (
              <div className="flex h-3 items-end gap-[2px]">
                {[0.6, 1, 0.4, 0.9, 0.5].map((val, i) => (
                  <motion.span
                    key={i}
                    animate={{ height: [3, 10 * val + 2, 4, 12 * val + 1, 3] }}
                    transition={{ duration: 0.6 + i * 0.1, repeat: Infinity, repeatType: "mirror" }}
                    className="w-[2px] rounded-full bg-rose-400"
                  />
                ))}
              </div>
            ) : (
              <span className="text-[9px] uppercase tracking-wider text-white/40">Paused</span>
            )}
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlayback}
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <span className="flex gap-[3px]">
              <span className="h-3 w-[2px] bg-black" />
              <span className="h-3 w-[2px] bg-black" />
            </span>
          ) : (
            <span className="ml-0.5 h-0 w-0 border-b-[4px] border-l-[7px] border-t-[4px] border-b-transparent border-l-black border-t-transparent" />
          )}
        </button>

        {/* Skip Song Button */}
        <button
          type="button"
          onClick={playNextSong}
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/[0.08] text-white/70 transition-colors hover:bg-white/[0.15] hover:text-white"
          aria-label="Next song"
        >
          <SkipForward size={13} />
        </button>

        {/* Mute Toggle */}
        <button
          type="button"
          onClick={toggleMute}
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/[0.08] text-white/70 transition-colors hover:bg-white/[0.15] hover:text-white"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </motion.div>

      {/* ===================================================
          CINEMATIC HERO SECTION
      =================================================== */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-5 py-20 sm:py-28">
        <div className="w-full max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-4 py-1.5 sm:px-5 sm:py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.45em] text-rose-200/80"
          >
            <Sparkles size={12} />
            <span>A Day Worth Celebrating Forever</span>
            <Sparkles size={12} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 1 }}
            className="mt-6 sm:mt-8 font-serif text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight leading-tight"
          >
            Happy Birthday
            <span className="mt-2 sm:mt-3 block font-display italic text-shimmer">
              Anbu Arasi ✨
            </span>
          </motion.h1>

          {/* ===============================================
              HERO PHOTO FRAME
          ================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.55, duration: 1 }}
            className="
              relative mx-auto mt-10 sm:mt-14 h-[330px] sm:h-[460px] w-full max-w-2xl
              overflow-hidden rounded-[30px] sm:rounded-[42px]
              border border-amber-300/30 ring-1 ring-white/15
              bg-gradient-to-b from-neutral-900/90 via-black/80 to-neutral-950/95
              p-2.5 sm:p-4
              shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_80px_rgba(251,113,133,0.22),inset_0_1px_0_rgba(255,255,255,0.2)]
              backdrop-blur-3xl
            "
          >
            {/* Corner Gold Filigree Accents */}
            <div className="pointer-events-none absolute left-3 top-3 sm:left-4 sm:top-4 z-20 h-6 w-6 border-l-2 border-t-2 border-amber-300/60 rounded-tl-md" />
            <div className="pointer-events-none absolute right-3 top-3 sm:right-4 sm:top-4 z-20 h-6 w-6 border-r-2 border-t-2 border-amber-300/60 rounded-tr-md" />
            <div className="pointer-events-none absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 h-6 w-6 border-b-2 border-l-2 border-amber-300/60 rounded-bl-md" />
            <div className="pointer-events-none absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 h-6 w-6 border-b-2 border-r-2 border-amber-300/60 rounded-br-md" />

            {/* Inner Matte Canvas */}
            <div className="relative h-full w-full overflow-hidden rounded-[22px] sm:rounded-[32px] border border-white/10 bg-black/80">
              <AnimatePresence mode="wait">
                <div key={activePhoto} className="relative h-full w-full flex items-center justify-center">
                  {/* Layer 1: Ambient Blurred Background */}
                  <motion.img
                    src={activePhoto}
                    alt=""
                    aria-hidden="true"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.endsWith(".png")) {
                        target.src = target.src.replace(".png", ".jpg");
                      } else if (target.src.endsWith(".jpg")) {
                        target.src = target.src.replace(".jpg", ".png");
                      }
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover blur-2xl scale-125 brightness-75"
                  />

                  {/* Layer 2: Ultra-Crisp Uncropped Photo */}
                  <motion.img
                    src={activePhoto}
                    alt="Birthday memory"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.endsWith(".png")) {
                        target.src = target.src.replace(".png", ".jpg");
                      } else if (target.src.endsWith(".jpg")) {
                        target.src = target.src.replace(".jpg", ".png");
                      }
                    }}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 1.2 }}
                    className="relative z-10 max-h-full max-w-full object-contain p-2 filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)]"
                  />
                </div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              <div className="absolute bottom-3 sm:bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full border border-amber-300/30 bg-black/75 px-4 sm:px-6 py-1.5 sm:py-2 text-[8px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-amber-200/90 backdrop-blur-2xl whitespace-nowrap shadow-lg">
                ✦ A memory crafted with love • Anbu Arasi ✦
              </div>
            </div>
          </motion.div>

          {/* SCROLL INDICATOR */}
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="mt-10 sm:mt-14 flex flex-col items-center gap-2 sm:gap-3 text-[9px] uppercase tracking-[0.4em] text-white/35 font-light"
          >
            <span>Scroll gently to explore</span>
            <ArrowDown size={14} />
          </motion.div>
        </div>
      </section>

      {/* ===================================================
          MEMORY GALLERY WITH LIGHTBOX
      =================================================== */}
      <section className="relative z-10 px-4 sm:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.45em] text-rose-300/60">
              <Sparkles size={11} />
              <span>Treasured Moments</span>
              <Sparkles size={11} />
            </div>

            <h2 className="mt-4 sm:mt-5 font-serif text-3xl sm:text-6xl font-light tracking-tight">
              Moments <span className="font-display italic text-white/40">worth keeping.</span>
            </h2>
          </div>

          <div className="mt-12 sm:mt-16 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {BIRTHDAY_PHOTOS.slice(0, 9).map((photo, index) => (
              <motion.div
                key={photo}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08, duration: 0.7 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => {
                  setLightboxIndex(index);
                  sounds.playSparkle();
                }}
                className="
                  group relative aspect-[4/5] cursor-pointer overflow-hidden
                  rounded-[26px] sm:rounded-[34px]
                  border border-white/[0.14] ring-1 ring-white/10
                  bg-gradient-to-b from-neutral-900/90 to-neutral-950/95
                  p-2
                  shadow-[0_20px_50px_rgba(0,0,0,0.6)]
                  transition-all duration-500 hover:border-amber-300/40 hover:shadow-[0_25px_60px_rgba(251,113,133,0.25)]
                "
              >
                <div className="relative h-full w-full overflow-hidden rounded-[20px] sm:rounded-[26px] bg-black/70 border border-white/5">
                  {/* Layer 1: Ambient Blurred Background */}
                  <img
                    src={photo}
                    alt=""
                    aria-hidden="true"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.endsWith(".png")) {
                        target.src = target.src.replace(".png", ".jpg");
                      } else if (target.src.endsWith(".jpg")) {
                        target.src = target.src.replace(".jpg", ".png");
                      }
                    }}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover blur-xl scale-125 opacity-35 brightness-75 transition-transform duration-700 group-hover:scale-135"
                  />

                  {/* Layer 2: Ultra-Crisp Centered Image */}
                  <div className="relative z-10 flex h-full w-full items-center justify-center p-3">
                    <img
                      src={photo}
                      alt={`Memory ${index + 1}`}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src.endsWith(".png")) {
                          target.src = target.src.replace(".png", ".jpg");
                        } else if (target.src.endsWith(".jpg")) {
                          target.src = target.src.replace(".jpg", ".png");
                        }
                      }}
                      className="max-h-full max-w-full object-contain rounded-lg filter drop-shadow-[0_12px_25px_rgba(0,0,0,0.9)] transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>

                  {/* Vignette Shadow */}
                  <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-30 flex items-center justify-between right-3 sm:right-4">
                    <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-white/80 font-medium backdrop-blur-md">
                      <Sparkles size={9} className="text-rose-300" />
                      Memory {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/15 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md shadow-md">
                      <Maximize2 size={12} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center bg-black/95 p-3 sm:p-10 backdrop-blur-3xl"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="fixed right-4 top-4 sm:right-6 sm:top-6 z-[260] flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20 shadow-lg"
              aria-label="Close Lightbox"
            >
              <X size={18} />
            </button>

            {/* Left Nav */}
            <button
              type="button"
              onClick={() =>
                setLightboxIndex((prev) => (prev === null || prev === 0 ? 8 : prev - 1))
              }
              className="fixed left-2 sm:left-6 top-1/2 z-[260] -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 sm:bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Right Nav */}
            <button
              type="button"
              onClick={() =>
                setLightboxIndex((prev) => (prev === null || prev === 8 ? 0 : prev + 1))
              }
              className="fixed right-2 sm:right-6 top-1/2 z-[260] -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 sm:bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>

            {/* Main Lightbox Content */}
            <div className="relative max-h-[85vh] max-w-4xl text-center px-2 sm:px-4">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-300/30 bg-black/90 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_60px_rgba(251,113,133,0.25)] p-2 sm:p-4">
                {/* Ambient Blurred Backdrop */}
                <img
                  src={BIRTHDAY_PHOTOS[lightboxIndex]}
                  alt=""
                  aria-hidden="true"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.endsWith(".png")) {
                      target.src = target.src.replace(".png", ".jpg");
                    } else if (target.src.endsWith(".jpg")) {
                      target.src = target.src.replace(".jpg", ".png");
                    }
                  }}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover blur-3xl scale-125 opacity-30 brightness-75"
                />

                <motion.img
                  key={lightboxIndex}
                  src={BIRTHDAY_PHOTOS[lightboxIndex]}
                  alt="Enlarged memory"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.endsWith(".png")) {
                      target.src = target.src.replace(".png", ".jpg");
                    } else if (target.src.endsWith(".jpg")) {
                      target.src = target.src.replace(".jpg", ".png");
                    }
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10 max-h-[70vh] sm:max-h-[74vh] w-auto max-w-[90vw] mx-auto rounded-xl sm:rounded-2xl object-contain shadow-2xl"
                />
              </div>

              <div className="mt-4 font-serif text-base sm:text-xl font-light text-rose-100">
                Memory {String(lightboxIndex + 1).padStart(2, "0")} — A cherished moment with Anbu Arasi ❤️
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MemoryTimeline />
      <WhySpecial />
      <RoyalCrownJewels />
      <EnchantedRoyalRose />
      <RoyalWishingFountain />
      <CelestialStarMap />
      <SecretGift />
      <BirthdayCake />
      <SecretLetters />
      <RoyalCertificateOfDevotion />

      {/* ===================================================
          LETTER INVITATION
      =================================================== */}
      <section className="relative z-10 flex min-h-[70vh] items-center justify-center px-4 sm:px-5 py-24 sm:py-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border border-amber-300/40 bg-gradient-to-tr from-amber-500/20 to-rose-500/20 text-amber-200 shadow-[0_0_50px_rgba(251,191,36,0.3)] backdrop-blur-2xl"
          >
            <Mail size={28} className="sm:w-8 sm:h-8 text-amber-300" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="mt-6 sm:mt-8 text-[9px] sm:text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.45em] text-rose-300/60">
              There&apos;s one more thing
            </div>

            <h2 className="mt-3 sm:mt-4 font-serif text-3xl sm:text-6xl font-light">
              A little letter,
              <br />
              <span className="font-display italic text-white/40">just for you.</span>
            </h2>

            <button
              type="button"
              onClick={() => {
                sounds.playWaxSeal();
                setShowLetter(true);
              }}
              className="
                mt-8 sm:mt-10 inline-flex items-center gap-3 rounded-full
                border border-white/20 bg-white px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-medium text-black
                shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300
                hover:scale-105 hover:bg-rose-50
              "
            >
              <Mail size={15} />
              <span>Open the letter</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===================================================
          LETTER MODAL
      =================================================== */}
      <AnimatePresence>
        {showLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] overflow-y-auto bg-[#030206]/96 px-3 sm:px-5 py-6 sm:py-10 backdrop-blur-2xl"
          >
            <button
              type="button"
              onClick={() => setShowLetter(false)}
              className="fixed right-4 top-4 sm:right-6 sm:top-6 z-[220] flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20 shadow-lg"
              aria-label="Close letter"
            >
              <X size={18} />
            </button>

            <div className="mx-auto flex min-h-full max-w-2xl items-center justify-center py-6 sm:py-8">
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="
                  w-full rounded-[36px] border border-rose-300/20
                  bg-gradient-to-b from-white/[0.06] to-white/[0.02]
                  p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_60px_rgba(251,113,133,0.15)]
                  backdrop-blur-2xl sm:p-14
                "
              >
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.45em] text-rose-300/60">
                    <Sparkles size={11} />
                    <span>A Letter For You</span>
                    <Sparkles size={11} />
                  </div>
                  <h3 className="mt-3 font-serif text-3xl font-light sm:text-4xl text-rose-100">
                    My Dear Anbu Arasi
                  </h3>
                </div>

                <div className="mt-10 space-y-6">
                  {LETTER_LINES.map((line, index) => (
                    <AnimatePresence key={line}>
                      {index < visibleLines && (
                        <motion.p
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.55 }}
                          className={`
                            ${
                              index === 0
                                ? "font-display text-2xl text-rose-200 sm:text-3xl"
                                : "font-sans text-base sm:text-lg text-white/70"
                            }
                            ${
                              index === LETTER_LINES.length - 1
                                ? "font-serif text-xl text-rose-300 font-medium"
                                : ""
                            }
                            font-light leading-relaxed
                          `}
                        >
                          {line}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  ))}
                </div>

                {visibleLines === LETTER_LINES.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-14 border-t border-white/10 pt-10 text-center"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playCelebration();
                        setShowLetter(false);
                        window.setTimeout(() => setShowFinal(true), 500);
                      }}
                      className="
                        inline-flex items-center gap-3 rounded-full
                        border border-rose-300/30 bg-rose-500/20 px-8 py-4
                        text-sm font-medium text-rose-100 shadow-[0_0_30px_rgba(251,113,133,0.3)]
                        transition-all hover:scale-105 hover:bg-rose-500/30
                      "
                    >
                      <Heart size={16} fill="currentColor" className="text-rose-300" />
                      <span>One last thing</span>
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================
          FINAL LOVE REVEAL
      =================================================== */}
      <AnimatePresence>
        {showFinal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex min-h-screen items-center justify-center overflow-hidden bg-[#030206] px-6 text-center"
          >
            <CosmicBackground />
            <CursorSparkles />

            <div className="relative z-10 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, type: "spring", bounce: 0.5 }}
                className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-rose-300/40 bg-rose-500/20 text-rose-200 shadow-[0_0_60px_rgba(251,113,133,0.45)] backdrop-blur-2xl"
              >
                <Heart size={44} fill="currentColor" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="mt-10 text-[10px] uppercase tracking-[0.5em] text-rose-300/60 font-medium"
              >
                And Finally...
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-6 font-serif text-4xl font-light leading-tight sm:text-6xl md:text-7xl lg:text-8xl"
              >
                I LOVE YOU
                <span className="mt-2 block font-display italic text-shimmer">
                  SO MUCH, MAH. 💖
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 1 }}
                className="mx-auto mt-10 max-w-lg text-base leading-relaxed text-white/50 font-light"
              >
                Whatever happens, whatever tomorrow brings,
                <br />
                I will always be by your side wishing the happiest life for you.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
                className="mt-14 text-[10px] uppercase tracking-[0.45em] text-rose-300/50 font-medium"
              >
                Happy Birthday Anbu Arasi ❤️
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* =========================================================
   THE ENCHANTED ROYAL ROSE (3D GLASS BELL JAR)
========================================================= */

function EnchantedRoyalRose() {
  const [blessingIndex, setBlessingIndex] = useState<number | null>(null);

  const blessings = [
    "May your royal smile forever light up the universe, Anbu Arasi. 🌹✨",
    "You are the rarest, most cherished soul in my entire world, Mah. 💖",
    "Protected, honored, and loved beyond all words and measures. 👑",
    "May every single step you take be blessed with everlasting happiness. 🌹",
  ];

  const handleTouchRose = () => {
    sounds.playSparkle();
    sounds.playChime(880, 0.4);
    setBlessingIndex((prev) => (prev === null ? 0 : (prev + 1) % blessings.length));
  };

  return (
    <section className="relative overflow-hidden px-5 py-28 sm:px-8 sm:py-36">
      {/* Background Soft Glow */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-rose-600/20 via-pink-500/15 to-amber-400/20 blur-[170px]"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center gap-2.5 rounded-full border border-amber-300/40 bg-gradient-to-r from-amber-950/50 via-black/80 to-amber-950/50 px-5 py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-amber-200 backdrop-blur-2xl shadow-xl"
        >
          <Sparkles size={12} className="text-amber-300 animate-spin" style={{ animationDuration: "8s" }} />
          <span>The Eternal Royal Rose • High Jewelry</span>
          <Sparkles size={12} className="text-amber-300" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-6 font-serif text-4xl font-light tracking-tight sm:text-6xl"
        >
          An eternal bloom for <span className="font-display italic text-gold-shimmer">Anbu Arasi. 🌹</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-4 max-w-md text-xs sm:text-sm font-light leading-relaxed text-white/50 px-2"
        >
          Tap the enchanted crystal bell jar to release a royal blessing and shimmering golden stardust.
        </motion.p>

        {/* 3D Glass Dome */}
        <div className="relative mx-auto mt-12 sm:mt-16 flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleTouchRose}
            className="
              group relative flex h-80 w-64 sm:h-96 sm:w-72 cursor-pointer items-center justify-center
              rounded-t-[140px] rounded-b-[40px]
              border-2 border-amber-300/40 ring-1 ring-white/20
              bg-gradient-to-b from-white/[0.12] via-rose-500/[0.04] to-black/90
              p-4 shadow-[0_30px_90px_rgba(0,0,0,0.8),0_0_60px_rgba(251,191,36,0.3),inset_0_2px_15px_rgba(255,255,255,0.25)]
              backdrop-blur-3xl transition-all duration-500
              hover:border-amber-300/80 hover:shadow-[0_0_90px_rgba(244,63,94,0.45)]
            "
          >
            {/* Top Crystal Finial */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-amber-300/60 bg-gradient-to-tr from-amber-400 to-rose-300 shadow-[0_0_15px_#fde047]">
              <Sparkles size={14} className="text-black animate-spin" style={{ animationDuration: "8s" }} />
            </div>

            {/* Specular Highlight on Glass */}
            <div className="pointer-events-none absolute inset-4 rounded-t-[120px] rounded-b-[30px] border-l border-t border-white/30 opacity-60" />

            {/* Glowing Eternal Rose */}
            <div className="relative flex flex-col items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute h-32 w-32 rounded-full bg-rose-500/40 blur-2xl"
              />

              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, 1.5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 text-6xl sm:text-7xl filter drop-shadow-[0_0_20px_#f43f5e]"
              >
                🌹
              </motion.div>

              {/* Stem & Leaves */}
              <div className="relative -mt-2 h-20 w-1 bg-gradient-to-b from-emerald-500 to-emerald-800 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                <div className="absolute left-[-10px] top-6 h-3 w-3.5 rounded-full bg-emerald-500 rotate-[-45deg]" />
                <div className="absolute right-[-10px] top-10 h-3 w-3.5 rounded-full bg-emerald-500 rotate-[45deg]" />
              </div>

              {/* Fallen Petals */}
              <div className="relative mt-2 flex gap-2">
                <span className="text-sm opacity-80 rotate-12">🥀</span>
                <span className="text-xs opacity-90 -rotate-45">🌹</span>
              </div>
            </div>

            {/* 24K Gold Base Rim */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-6 w-56 sm:w-64 rounded-full border border-amber-300/60 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 shadow-[0_0_25px_rgba(251,191,36,0.5)]" />
          </motion.div>

          {/* Blessing Card Reveal */}
          <AnimatePresence mode="wait">
            {blessingIndex !== null && (
              <motion.div
                key={blessingIndex}
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 rounded-full border border-amber-300/40 bg-gradient-to-r from-rose-950/85 via-black/90 to-rose-950/85 px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-serif italic text-amber-200 shadow-2xl backdrop-blur-2xl"
              >
                {blessings[blessingIndex]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   24K ROYAL DECREE OF ETERNAL DEVOTION
========================================================= */

function RoyalCertificateOfDevotion() {
  const [sealed, setSealed] = useState(false);

  const handleSeal = () => {
    sounds.playWaxSeal();
    sounds.playCelebration();
    setSealed(true);
  };

  return (
    <section className="relative overflow-hidden px-5 py-28 sm:px-8 sm:py-36">
      <div className="relative z-10 mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9 }}
          className="
            relative overflow-hidden rounded-[32px] sm:rounded-[44px]
            border-2 border-amber-300/40 ring-1 ring-white/20
            bg-gradient-to-b from-[#1c120c]/95 via-black/90 to-[#190e16]/95
            p-6 sm:p-12 shadow-[0_35px_90px_rgba(0,0,0,0.85),0_0_80px_rgba(251,191,36,0.25)]
            backdrop-blur-3xl text-center
          "
        >
          {/* Corner Gold Filigree */}
          <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-amber-300/70 rounded-tl-md" />
          <div className="pointer-events-none absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 border-amber-300/70 rounded-tr-md" />
          <div className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-amber-300/70 rounded-bl-md" />
          <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-amber-300/70 rounded-br-md" />

          {/* Royal Seal Monogram */}
          <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-amber-300/50 bg-amber-400/[0.08] text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
            <Crown size={30} className="sm:w-9 sm:h-9" />
          </div>

          <div className="mt-6 text-[9px] sm:text-[10px] uppercase tracking-[0.45em] text-amber-300 font-medium">
            ✦ Royal Decree of Eternal Devotion ✦
          </div>

          <h2 className="mt-3 font-serif text-2xl sm:text-4xl font-light text-rose-100">
            Dedicated to Her Royal Highness, <br />
            <span className="font-display italic text-gold-shimmer">Anbu Arasi (Mah) 💖</span>
          </h2>

          <div className="mx-auto my-6 h-px w-32 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />

          <p className="font-serif text-sm sm:text-base font-light italic leading-relaxed text-amber-100/85">
            &ldquo;Ennodaiya motha anbukkum sondhakkaariya, en Anbu Arasi-aa neenga mattum dhaan irukkanum nu naan aasai paduren, Mah. Ennaikkum, eppovum, ungalukkaaga naan iruppen.&rdquo;
          </p>

          <p className="mt-4 text-xs sm:text-sm font-light leading-relaxed text-white/50">
            No matter what tomorrow brings, this world and my heart will always celebrate your existence.
          </p>

          {/* Interactive Royal Wax Seal Button */}
          <div className="mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleSeal}
              className="
                inline-flex items-center gap-2 rounded-full border border-amber-300/50
                bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20
                px-6 py-2.5 text-[10px] uppercase tracking-[0.35em] text-amber-200
                backdrop-blur-xl shadow-lg hover:border-amber-300/80 transition
              "
            >
              <Heart size={12} fill="currentColor" className="text-amber-300" />
              <span>{sealed ? "Royal Decree Sealed Forever 💖" : "Seal with Royal Oath ✦"}</span>
              <Heart size={12} fill="currentColor" className="text-amber-300" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================
   THE ROYAL CROWN JEWELS (HIGH JEWELRY TIARA COLLECTION)
========================================================= */

const CROWN_JEWELS = [
  {
    id: "diamond",
    name: "Diamond of Infinite Grace",
    subtitle: "Pure Radiance",
    color: "from-sky-300 via-white to-amber-200",
    border: "border-sky-300/40",
    glow: "shadow-[0_0_35px_rgba(186,230,253,0.4)]",
    icon: Gem,
    tribute: "Your natural elegance and pure heart illuminate the entire world with effortless, breathtaking grace, Anbu Arasi. ✨",
  },
  {
    id: "ruby",
    name: "Imperial Ruby of the Heart",
    subtitle: "Endless Warmth",
    color: "from-rose-500 via-red-400 to-pink-500",
    border: "border-rose-400/40",
    glow: "shadow-[0_0_35px_rgba(244,63,94,0.4)]",
    icon: Heart,
    tribute: "A vibrant, kind soul whose warmth turns every single quiet moment into a deeply cherished memory. 🌹",
  },
  {
    id: "sapphire",
    name: "Celestial Sapphire of Serenity",
    subtitle: "Peace & Depth",
    color: "from-indigo-400 via-blue-400 to-purple-400",
    border: "border-indigo-400/40",
    glow: "shadow-[0_0_35px_rgba(129,140,248,0.4)]",
    icon: Sparkles,
    tribute: "A calming, peaceful presence that brings profound sanctuary and gentle clarity into my life. 🌌",
  },
  {
    id: "topaz",
    name: "Imperial Gold Topaz of Joy",
    subtitle: "Everlasting Joy",
    color: "from-amber-300 via-yellow-300 to-amber-500",
    border: "border-amber-300/40",
    glow: "shadow-[0_0_35px_rgba(251,191,36,0.4)]",
    icon: Crown,
    tribute: "May your journey always be crowned with radiant laughter, celebrated dreams, and eternal fulfillment. 👑",
  },
];

function RoyalCrownJewels() {
  const [selectedGem, setSelectedGem] = useState<string | null>("diamond");

  const activeJewel = CROWN_JEWELS.find((j) => j.id === selectedGem) || CROWN_JEWELS[0];

  return (
    <section className="relative overflow-hidden px-5 py-32 sm:px-8 sm:py-40">
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center gap-2.5 rounded-full border border-amber-300/40 bg-gradient-to-r from-amber-950/50 via-black/80 to-amber-950/50 px-5 py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-amber-200 backdrop-blur-2xl shadow-xl"
        >
          <Crown size={12} className="text-amber-300" />
          <span>High Jewelry Tiara • Crown Collection</span>
          <Crown size={12} className="text-amber-300" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-6 font-serif text-4xl font-light tracking-tight sm:text-6xl text-white"
        >
          The Four Royal <span className="font-display italic text-gold-shimmer">Crown Jewels. 💎✨</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-4 max-w-lg text-xs sm:text-sm font-light leading-relaxed text-white/50 px-2"
        >
          Each jewel represents a sacred facet of Anbu Arasi&apos;s royal grace. Tap each gemstone to reveal its tribute.
        </motion.p>

        {/* 4 GEM SHOWCASE GRID */}
        <div className="mt-14 sm:mt-18 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {CROWN_JEWELS.map((jewel, index) => {
            const isSelected = selectedGem === jewel.id;
            const IconComp = jewel.icon;
            return (
              <motion.button
                key={jewel.id}
                type="button"
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  sounds.playSparkle();
                  sounds.playChime(750 + index * 80, 0.35);
                  setSelectedGem(jewel.id);
                }}
                className={`
                  group relative flex flex-col items-center rounded-[24px] sm:rounded-[32px] p-5 sm:p-6
                  border transition-all duration-500 backdrop-blur-2xl
                  ${
                    isSelected
                      ? `border-amber-300/80 bg-gradient-to-b from-amber-400/[0.12] to-black/90 ${jewel.glow}`
                      : "border-white/10 bg-neutral-950/70 hover:border-amber-300/40"
                  }
                `}
              >
                {/* Gem Center Display */}
                <div
                  className={`
                    flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl
                    border ${jewel.border} bg-gradient-to-tr ${jewel.color} text-black font-bold shadow-lg
                    transition-transform duration-500 group-hover:scale-110
                  `}
                >
                  <IconComp size={24} className="sm:w-7 sm:h-7 text-neutral-900" />
                </div>

                <div className="mt-4 text-[9px] uppercase tracking-[0.25em] text-amber-300/80 font-medium">
                  {jewel.subtitle}
                </div>
                <div className="mt-1 font-serif text-sm sm:text-base font-light text-rose-100 line-clamp-1">
                  {jewel.name.split(" ")[0]}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Gem Tribute Display */}
        <AnimatePresence mode="wait">
          {activeJewel && (
            <motion.div
              key={activeJewel.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-10 mx-auto max-w-2xl rounded-[26px] sm:rounded-[36px] border border-amber-300/40 bg-gradient-to-b from-[#180f12]/90 via-black/85 to-[#160c14]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl"
            >
              <div className="text-[10px] uppercase tracking-[0.35em] text-amber-300 font-medium">
                ✦ {activeJewel.name} ✦
              </div>
              <p className="mt-3 font-serif text-sm sm:text-base italic font-light leading-relaxed text-amber-100/90">
                &ldquo;{activeJewel.tribute}&rdquo;
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* =========================================================
   THE ROYAL STARLIGHT WISHING FOUNTAIN
========================================================= */

function RoyalWishingFountain() {
  const [wishGranted, setWishGranted] = useState(false);
  const [wishCount, setWishCount] = useState(0);

  const royalWishes = [
    "May all your secret dreams quietly take flight and illuminate the highest stars, Anbu Arasi. ✨",
    "May your life always be blessed with unconditional love, peace, and radiant health, Mah. 💖",
    "May you always find endless reasons to smile your most genuine, beautiful smile. 🌹",
    "Held in the highest royal honor, protected under the starry cosmos for eternity. 👑",
  ];

  const handleMakeWish = () => {
    sounds.playSparkle();
    sounds.playChime(920 + (wishCount % 4) * 40, 0.4);
    setWishGranted(true);
    setWishCount((prev) => prev + 1);
  };

  return (
    <section className="relative overflow-hidden px-5 py-32 sm:px-8 sm:py-40">
      {/* Background Starlight Pool Glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.28, 0.12] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cyan-600/15 via-purple-600/15 to-amber-400/20 blur-[180px]"
      />

      <div className="relative z-20 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center gap-2.5 rounded-full border border-amber-300/40 bg-gradient-to-r from-amber-950/50 via-black/80 to-amber-950/50 px-5 py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-amber-200 backdrop-blur-2xl shadow-xl"
        >
          <Moon size={12} className="text-amber-300" />
          <span>The Royal Starlight Wishing Fountain</span>
          <Moon size={12} className="text-amber-300" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-6 font-serif text-4xl font-light tracking-tight sm:text-6xl text-white"
        >
          Make a wish upon the <span className="font-display italic text-gold-shimmer">celestial waters. 🌊✨</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-4 max-w-md text-xs sm:text-sm font-light leading-relaxed text-white/50 px-2"
        >
          Tap the enchanted royal starlight fountain to cast a golden wish into the cosmos.
        </motion.p>

        {/* 3D ROYAL WATER FOUNTAIN DOME */}
        <div className="relative mx-auto mt-12 sm:mt-16 flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleMakeWish}
            className="
              group relative flex h-72 w-72 sm:h-84 sm:w-84 cursor-pointer items-center justify-center
              rounded-full border-4 border-amber-300/40 ring-2 ring-white/20
              bg-gradient-to-b from-neutral-900/95 via-[#0b0612]/90 to-black/95
              p-6 shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_80px_rgba(251,191,36,0.3)]
              backdrop-blur-3xl transition-all duration-500
              hover:border-amber-300/80 hover:shadow-[0_0_90px_rgba(251,191,36,0.55)]
            "
          >
            {/* Outer Water Ripple Rings */}
            <div className="pointer-events-none absolute inset-4 rounded-full border border-cyan-400/20 animate-ping" style={{ animationDuration: "4s" }} />
            <div className="pointer-events-none absolute inset-8 rounded-full border border-amber-300/20" />
            <div className="pointer-events-none absolute inset-12 rounded-full border border-white/10" />

            {/* Glowing Golden Water Surface */}
            <div className="pointer-events-none absolute inset-6 rounded-full bg-gradient-to-tr from-cyan-900/40 via-purple-900/30 to-amber-900/40 blur-md" />

            {/* Central Floating Golden Lotus */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl sm:text-7xl filter drop-shadow-[0_0_25px_#fde047] select-none"
              >
                🪷
              </motion.div>

              <div className="mt-3 flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-black/80 px-3.5 py-1 text-[9px] uppercase tracking-[0.25em] text-amber-200 backdrop-blur-xl shadow-lg">
                <Sparkles size={10} className="text-amber-300" />
                <span>Tap To Cast Wish</span>
              </div>
            </div>

            {/* 24k Gold Bevel Screws */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_6px_#fde047]" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_6px_#fde047]" />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_6px_#fde047]" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_6px_#fde047]" />
          </motion.div>

          {/* Dynamic Wish Reveal Card */}
          <AnimatePresence mode="wait">
            {wishGranted && (
              <motion.div
                key={wishCount}
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 max-w-xl rounded-full border border-amber-300/40 bg-gradient-to-r from-amber-950/85 via-black/90 to-amber-950/85 px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-serif italic text-amber-200 shadow-2xl backdrop-blur-2xl"
              >
                {royalWishes[(wishCount - 1) % royalWishes.length]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   THE CELESTIAL STAR REGISTRY (03 MARCH CONSTALLATION)
========================================================= */

function CelestialStarMap() {
  const [starLit, setStarLit] = useState(false);

  const starPoints = [
    { x: 50, y: 25, label: "Alpha • Anbu Arasi" },
    { x: 30, y: 45, label: "Beta • Grace" },
    { x: 70, y: 45, label: "Gamma • Warmth" },
    { x: 40, y: 70, label: "Delta • Serenity" },
    { x: 60, y: 70, label: "Epsilon • Devotion" },
    { x: 50, y: 88, label: "Zeta • Eternity" },
  ];

  const handleTouchStar = () => {
    sounds.playSparkle();
    sounds.playChime(1000, 0.4);
    setStarLit(true);
  };

  return (
    <section className="relative overflow-hidden px-5 py-32 sm:px-8 sm:py-40">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center gap-2.5 rounded-full border border-amber-300/40 bg-gradient-to-r from-amber-950/50 via-black/80 to-amber-950/50 px-5 py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-amber-200 backdrop-blur-2xl shadow-xl"
        >
          <Sparkles size={12} className="text-amber-300 animate-spin" style={{ animationDuration: "9s" }} />
          <span>The Celestial Star Registry • 03 March</span>
          <Sparkles size={12} className="text-amber-300" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-6 font-serif text-4xl font-light tracking-tight sm:text-6xl text-white"
        >
          The Star Named After <span className="font-display italic text-gold-shimmer">Anbu Arasi. 🌌✨</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-4 max-w-lg text-xs sm:text-sm font-light leading-relaxed text-white/50 px-2"
        >
          Registered in the heavens on March 03. Tap the celestial constellation to ignite the golden celestial lines.
        </motion.p>

        {/* 3D CELESTIAL STAR MAP DOME */}
        <div className="relative mx-auto mt-12 sm:mt-16 flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={handleTouchStar}
            className="
              group relative h-80 w-full sm:h-96 max-w-xl cursor-pointer overflow-hidden
              rounded-[32px] sm:rounded-[44px]
              border-2 border-amber-300/40 ring-1 ring-white/15
              bg-gradient-to-b from-[#090414]/95 via-black/90 to-[#0c0617]/95
              p-6 shadow-[0_35px_90px_rgba(0,0,0,0.85),0_0_80px_rgba(251,191,36,0.25)]
              backdrop-blur-3xl transition-all duration-500
              hover:border-amber-300/80 hover:shadow-[0_0_90px_rgba(251,191,36,0.45)]
            "
          >
            {/* SVG Constellation Lines */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none">
              <line x1="50%" y1="25%" x2="30%" y2="45%" stroke={starLit ? "#fde047" : "rgba(255,255,255,0.2)"} strokeWidth="1.5" strokeDasharray={starLit ? "none" : "3,3"} />
              <line x1="50%" y1="25%" x2="70%" y2="45%" stroke={starLit ? "#fde047" : "rgba(255,255,255,0.2)"} strokeWidth="1.5" strokeDasharray={starLit ? "none" : "3,3"} />
              <line x1="30%" y1="45%" x2="40%" y2="70%" stroke={starLit ? "#fde047" : "rgba(255,255,255,0.2)"} strokeWidth="1.5" strokeDasharray={starLit ? "none" : "3,3"} />
              <line x1="70%" y1="45%" x2="60%" y2="70%" stroke={starLit ? "#fde047" : "rgba(255,255,255,0.2)"} strokeWidth="1.5" strokeDasharray={starLit ? "none" : "3,3"} />
              <line x1="40%" y1="70%" x2="50%" y2="88%" stroke={starLit ? "#fde047" : "rgba(255,255,255,0.2)"} strokeWidth="1.5" strokeDasharray={starLit ? "none" : "3,3"} />
              <line x1="60%" y1="70%" x2="50%" y2="88%" stroke={starLit ? "#fde047" : "rgba(255,255,255,0.2)"} strokeWidth="1.5" strokeDasharray={starLit ? "none" : "3,3"} />
            </svg>

            {/* Render Constellation Stars */}
            {starPoints.map((pt, i) => (
              <motion.div
                key={i}
                style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                animate={{ scale: starLit ? [1, 1.4, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              >
                <div className={`h-3 w-3 sm:h-4 sm:w-4 rounded-full ${i === 0 ? "bg-amber-300 shadow-[0_0_15px_#fde047]" : "bg-white shadow-[0_0_10px_#ffffff]"}`} />
              </motion.div>
            ))}

            {/* Central Glow on Main Star */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full bg-amber-400/25 blur-xl pointer-events-none" />

            {/* Interactive Tap Hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-amber-300/40 bg-black/80 px-4 py-1.5 text-[9px] uppercase tracking-[0.25em] text-amber-200 backdrop-blur-xl shadow-lg">
              {starLit ? "✦ Constellation Aligned For Anbu Arasi 💖 ✦" : "✦ Tap To Align The Stars ✦"}
            </div>
          </motion.div>

          {/* Celestial Registry Data Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl w-full"
          >
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center backdrop-blur-xl">
              <div className="text-[8px] uppercase tracking-[0.25em] text-amber-300/80">Star Name</div>
              <div className="mt-1 font-serif text-xs sm:text-sm text-white font-medium">Anbu Arasi Alpha</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center backdrop-blur-xl">
              <div className="text-[8px] uppercase tracking-[0.25em] text-amber-300/80">Constellation</div>
              <div className="mt-1 font-serif text-xs sm:text-sm text-white font-medium">Pisces (03 March)</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center backdrop-blur-xl">
              <div className="text-[8px] uppercase tracking-[0.25em] text-amber-300/80">Coordinates</div>
              <div className="mt-1 font-serif text-xs sm:text-sm text-white font-medium">RA 23h 59m • Dec +03°</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center backdrop-blur-xl">
              <div className="text-[8px] uppercase tracking-[0.25em] text-amber-300/80">Registry Status</div>
              <div className="mt-1 font-serif text-xs sm:text-sm text-amber-300 font-medium">Eternal & Unique ✨</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}