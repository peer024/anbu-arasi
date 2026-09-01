"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Pause,
  Play,
  Quote,
  Sparkles,
  Volume2,
  VolumeX,
  Disc3,
  RotateCcw,
  Maximize2,
  X,
  Camera,
  Music2,
  Crown,
  Flame,
} from "lucide-react";
import { sounds } from "@/lib/soundEffects";

type DailyExperienceProps = {
  day: number;
  daysRemaining: number;
  photoSrc?: string;
  songSrc?: string;
  songTitle?: string;
  quote?: string;
};

interface FloatingNote {
  id: number;
  note: string;
  x: number;
}

interface StampedHeart {
  id: number;
  x: number;
  y: number;
}

export function DailyExperience({
  day,
  daysRemaining,
  photoSrc,
  songSrc,
  songTitle = "Today's little melody",
  quote = "Some people make ordinary days feel a little less ordinary.",
}: DailyExperienceProps) {
  const photoContainerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAutoPlayedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [loveCount, setLoveCount] = useState(0);
  const [stampedHearts, setStampedHearts] = useState<StampedHeart[]>([]);
  const [floatingNotes, setFloatingNotes] = useState<FloatingNote[]>([]);

  // 3D Tilt State for Photo Frame
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const formattedDay = day.toString().padStart(3, "0");

  /* =======================================================
     AUDIO SETUP & PHOTO VIEW AUTOPLAY TRIGGER
  ======================================================= */
  useEffect(() => {
    if (!songSrc) return;

    const audio = new Audio();
    audio.preload = "auto";
    audio.src = songSrc;
    audio.loop = false; // Strictly single song - no loop
    audio.volume = 1;
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

    const handleTimeUpdate = () => {
      if (!audio.duration) return;
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsFinished(true);
      setProgress(100);
      audio.pause();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    // Observer: Autoplay when user scrolls to / views the photo card
    const target = photoContainerRef.current;
    if (target) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && !hasAutoPlayedRef.current) {
            hasAutoPlayedRef.current = true;

            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setIsPlaying(true);
                  setIsFinished(false);
                })
                .catch(() => {
                  const unlock = () => {
                    if (!audioRef.current) return;
                    audioRef.current
                      .play()
                      .then(() => {
                        setIsPlaying(true);
                        setIsFinished(false);
                      })
                      .catch(() => {});

                    window.removeEventListener("pointerdown", unlock);
                    window.removeEventListener("touchstart", unlock);
                    window.removeEventListener("scroll", unlock);
                    window.removeEventListener("click", unlock);
                  };

                  window.addEventListener("pointerdown", unlock, { once: true, passive: true });
                  window.addEventListener("touchstart", unlock, { once: true, passive: true });
                  window.addEventListener("scroll", unlock, { once: true, passive: true });
                  window.addEventListener("click", unlock, { once: true });
                });
            }
          }
        },
        { threshold: 0.25 }
      );

      observer.observe(target);

      return () => {
        observer.disconnect();
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
        audio.pause();
        audio.src = "";
        if (audioRef.current === audio) {
          audioRef.current = null;
        }
      };
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  }, [songSrc]);

  /* =======================================================
     FLOATING MUSICAL NOTES INTERVAL (WHEN PLAYING)
  ======================================================= */
  useEffect(() => {
    if (!isPlaying) return;

    const notesSymbols = ["♪", "♫", "♬", "♩", "✨", "💖"];
    const interval = setInterval(() => {
      const newNote: FloatingNote = {
        id: Date.now() + Math.random(),
        note: notesSymbols[Math.floor(Math.random() * notesSymbols.length)],
        x: Math.random() * 60 - 30, // -30px to +30px offset
      };
      setFloatingNotes((prev) => [...prev.slice(-8), newNote]);
    }, 850);

    return () => clearInterval(interval);
  }, [isPlaying]);

  /* =======================================================
     AUDIO CONTROLS (TOGGLE & REPLAY)
  ======================================================= */
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      sounds.playChime(800, 0.25);
      if (isFinished || (audio.duration && audio.currentTime >= audio.duration)) {
        audio.currentTime = 0;
        setIsFinished(false);
        setProgress(0);
      }

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsFinished(false);
        })
        .catch(() => {});
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = percent * audio.duration;
    setProgress(percent * 100);
    if (isFinished) {
      setIsFinished(false);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (!Number.isFinite(timeInSeconds) || timeInSeconds <= 0) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Stamp Love Reaction on Photo
  const handleStampLove = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playChime(950 + loveCount * 20, 0.35);
    setLoveCount((prev) => prev + 1);

    const newHeart: StampedHeart = {
      id: Date.now() + Math.random(),
      x: 50 + (Math.random() * 30 - 15),
      y: 50 + (Math.random() * 30 - 15),
    };
    setStampedHearts((prev) => [...prev.slice(-12), newHeart]);
  };

  // 3D Photo Frame Mouse Move
  const handlePhotoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!photoContainerRef.current) return;
    const rect = photoContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -11;
    const rotateY = ((x - centerX) / centerX) * 11;

    setTilt({
      x: rotateX,
      y: rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-24 sm:px-8 sm:py-32">
      {/* Dynamic Celestial Aurora Glows */}
      <motion.div
        animate={
          isPlaying
            ? { scale: [1, 1.35, 1], opacity: [0.18, 0.5, 0.18] }
            : { scale: [1, 1.12, 1], opacity: [0.08, 0.2, 0.08] }
        }
        transition={{ duration: isPlaying ? 3.5 : 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/3 h-[750px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-rose-500/30 via-amber-400/20 to-purple-600/30 blur-[190px]"
      />

      {/* Musical Reactive Sound Wave Halo */}
      {isPlaying && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.95, 1.3, 0.95], opacity: [0.25, 0.7, 0.25] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-1/2 top-1/3 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/40 shadow-[0_0_80px_rgba(251,191,36,0.3)]"
        />
      )}

      {/* Floating Ambient Stardust Sparks */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-amber-200/45"
            style={{
              left: `${(i * 23 + 8) % 95}%`,
              top: `${(i * 37 + 12) % 90}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.85, 0.1],
              scale: [0.8, 1.35, 0.8],
            }}
            transition={{
              duration: 3.5 + (i % 4),
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles size={11 + (i % 3) * 4} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* =================================================
            ROYAL CREST & TOP BADGE
        ================================================= */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-amber-300/40 bg-gradient-to-r from-amber-950/60 via-black/80 to-amber-950/60 px-5 py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-amber-200 backdrop-blur-2xl shadow-xl shadow-amber-950/30"
          >
            <Crown size={12} className="text-amber-300" />
            <span>Day {formattedDay} of 365 • Royal Memory</span>
            <Crown size={12} className="text-amber-300" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-6 font-serif text-4xl font-light tracking-tight sm:text-6xl md:text-7xl"
          >
            Today&apos;s quiet <span className="font-display italic text-gold-shimmer">masterpiece.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-4 max-w-md text-xs sm:text-sm font-light leading-relaxed text-white/50 px-2"
          >
            {daysRemaining > 0 ? (
              <span>
                <strong className="text-amber-200 font-medium">{daysRemaining} days</strong> until your birthday, Anbu Arasi.
              </span>
            ) : (
              <span>Today is your special day, Anbu Arasi! ❤️</span>
            )}
          </motion.p>
        </div>

        {/* =================================================
            24K GOLD HAUTE ARCHIVAL 3D PHOTO FRAME
        ================================================= */}
        {photoSrc && (
          <motion.div
            ref={photoContainerRef}
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            onMouseMove={handlePhotoMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
            }}
            style={{
              transformStyle: "preserve-3d",
              transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.025 : 1}, ${isHovered ? 1.025 : 1}, 1)`,
              transition: isHovered
                ? "transform 0.1s cubic-bezier(0.2, 0, 0, 1)"
                : "transform 0.7s cubic-bezier(0.2, 0, 0, 1)",
            }}
            className="
              group relative mx-auto mt-12 sm:mt-16 max-w-2xl overflow-hidden rounded-[34px] sm:rounded-[46px]
              border border-amber-300/40 ring-1 ring-white/20
              bg-gradient-to-b from-neutral-900/95 via-black/85 to-neutral-950/95
              p-3 sm:p-5
              shadow-[0_35px_90px_rgba(0,0,0,0.85),0_0_90px_rgba(251,191,36,0.25),inset_0_1px_0_rgba(255,255,255,0.25)]
              backdrop-blur-3xl
            "
          >
            {/* Prismatic Rainbow Holographic Glare */}
            {isHovered && (
              <div
                className="pointer-events-none absolute inset-0 z-30 opacity-50 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle 260px at ${tilt.glareX}% ${tilt.glareY}%, rgba(251, 191, 36, 0.4), rgba(217, 70, 239, 0.2), rgba(56, 189, 248, 0.15), transparent 75%)`,
                }}
              />
            )}

            {/* Corner Gold Filigree Accents */}
            <div className="pointer-events-none absolute left-3 top-3 sm:left-5 sm:top-5 z-20 h-7 w-7 border-l-2 border-t-2 border-amber-300/80 rounded-tl-lg" />
            <div className="pointer-events-none absolute right-3 top-3 sm:right-5 sm:top-5 z-20 h-7 w-7 border-r-2 border-t-2 border-amber-300/80 rounded-tr-lg" />
            <div className="pointer-events-none absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-20 h-7 w-7 border-b-2 border-l-2 border-amber-300/80 rounded-bl-lg" />
            <div className="pointer-events-none absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-20 h-7 w-7 border-b-2 border-r-2 border-amber-300/80 rounded-br-lg" />

            {/* Museum Inner Passe-Partout Matting */}
            <div
              onClick={() => {
                sounds.playSparkle();
                setShowLightbox(true);
              }}
              className="
                relative aspect-[4/3] sm:aspect-[16/11] w-full cursor-pointer overflow-hidden
                rounded-[26px] sm:rounded-[36px]
                border border-white/15
                bg-gradient-to-b from-black/90 via-black/75 to-black/95
                shadow-[inset_0_3px_15px_rgba(0,0,0,0.95)]
              "
            >
              {/* Layer 1: Ambient Blurred Background */}
              <img
                src={photoSrc}
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
                className="pointer-events-none absolute inset-0 h-full w-full object-cover blur-2xl scale-125 opacity-45 brightness-75 transition-transform duration-1000 group-hover:scale-135"
              />

              {/* Layer 2: Ultra-Crisp Uncropped Photo */}
              <div className="relative z-10 flex h-full w-full items-center justify-center p-2.5 sm:p-4">
                <img
                  src={photoSrc}
                  alt={`Memory for day ${day}`}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.endsWith(".png")) {
                      target.src = target.src.replace(".png", ".jpg");
                    } else if (target.src.endsWith(".jpg")) {
                      target.src = target.src.replace(".jpg", ".png");
                    }
                  }}
                  className="max-h-full max-w-full object-contain rounded-xl sm:rounded-2xl filter drop-shadow-[0_18px_40px_rgba(0,0,0,0.95)] transition-all duration-700 group-hover:scale-[1.025] group-hover:drop-shadow-[0_22px_50px_rgba(251,191,36,0.35)]"
                  loading="eager"
                />
              </div>

              {/* Layer 3: Dynamic Interactive Stamped Hearts */}
              {stampedHearts.map((heart) => (
                <motion.div
                  key={heart.id}
                  initial={{ scale: 0, opacity: 1, y: 0 }}
                  animate={{ scale: [0, 1.8, 1.4], opacity: [1, 1, 0], y: -50 }}
                  transition={{ duration: 1.6, ease: "easeOut" }}
                  style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
                  className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 text-amber-300 drop-shadow-[0_0_12px_#fde047]"
                >
                  <Heart size={32} fill="#fde047" />
                </motion.div>
              ))}

              {/* Vignette Shadow Overlay */}
              <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-transparent to-black/20" />

              {/* Plaque & Zoom Badges */}
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-30 flex items-center gap-2 rounded-full border border-amber-300/40 bg-black/80 px-3.5 sm:px-4 py-1.5 text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-amber-200 backdrop-blur-xl shadow-lg">
                <Camera size={11} className="text-amber-300" />
                <span>Memory • Day {formattedDay}</span>
              </div>

              {/* Love Stamp Button */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                type="button"
                onClick={handleStampLove}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 z-30 flex items-center gap-1.5 rounded-full border border-rose-300/40 bg-rose-500/20 px-3 py-1.5 text-xs text-rose-200 backdrop-blur-xl shadow-lg hover:bg-rose-500/40 transition"
                title="Send love"
              >
                <Heart size={13} fill="currentColor" className="text-rose-400 animate-pulse" />
                {loveCount > 0 && <span className="text-[10px] font-bold text-amber-200">{loveCount}</span>}
              </motion.button>

              <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <Maximize2 size={13} />
              </div>
            </div>
          </motion.div>
        )}

        {/* =================================================
            HAUTE COUTURE EDITORIAL QUOTE CARD
        ================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="
            relative mx-auto mt-8 max-w-2xl rounded-[30px] sm:rounded-[38px]
            border border-amber-300/20
            bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.015]
            p-7 sm:p-10 text-center shadow-2xl backdrop-blur-3xl
          "
        >
          <Quote size={28} className="mx-auto text-amber-300/60" />
          <p className="mt-4 font-serif text-lg sm:text-2xl font-light italic leading-relaxed text-rose-100/95">
            &ldquo;{quote}&rdquo;
          </p>
          <div className="mt-5 font-display text-xs sm:text-sm text-amber-200/80 font-normal tracking-wide">
            — Dedicated with endless love to Anbu Arasi 💖
          </div>
        </motion.div>

        {/* =================================================
            HAUTE HORLOGERIE GOLD & OBSIDIAN TURNTABLE
        ================================================= */}
        {songSrc && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="
              relative mx-auto mt-8 max-w-2xl rounded-[30px] sm:rounded-[40px]
              border border-amber-300/30 ring-1 ring-white/10
              bg-gradient-to-r from-[#170e17]/95 via-[#0e070c]/90 to-[#180d15]/95
              p-5 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.7),0_0_50px_rgba(251,191,36,0.2)]
              backdrop-blur-3xl
            "
          >
            {/* Floating Musical Notes Animation */}
            <div className="pointer-events-none absolute -top-8 left-14 z-40">
              <AnimatePresence>
                {floatingNotes.map((note) => (
                  <motion.span
                    key={note.id}
                    initial={{ opacity: 0, y: 0, x: note.x, scale: 0.6 }}
                    animate={{ opacity: [0, 1, 0], y: -50, scale: 1.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute text-amber-200 text-sm font-serif drop-shadow-[0_0_8px_#fde047]"
                  >
                    {note.note}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
              {/* Left: Turntable with Spinning Vinyl & Gold Tonearm */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex h-16 w-16 sm:h-18 sm:w-18 shrink-0 items-center justify-center">
                  {/* Spinning Gold & Obsidian Vinyl */}
                  <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                    className="relative flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-full border-2 border-amber-300/50 bg-gradient-to-br from-neutral-900 via-amber-950/60 to-black text-amber-200 shadow-2xl"
                  >
                    {/* Vinyl Grooves */}
                    <div className="absolute inset-2 rounded-full border border-white/10" />
                    <div className="absolute inset-4 rounded-full border border-white/5" />
                    <Disc3 size={32} className="text-amber-200" />
                    <div className="absolute h-3.5 w-3.5 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 shadow-[0_0_10px_#fde047]" />
                  </motion.div>

                  {/* Mechanical Gold Tonearm Stylus */}
                  <motion.div
                    animate={{ rotate: isPlaying ? 16 : -25 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ transformOrigin: "top right" }}
                    className="pointer-events-none absolute right-1 -top-1 h-10 w-2.5"
                  >
                    <div className="h-full w-0.5 bg-gradient-to-b from-amber-300 to-amber-100 shadow-[0_0_6px_#fde047]" />
                    <div className="absolute bottom-0 left-0 h-2 w-2 rounded-full bg-rose-400" />
                  </motion.div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-amber-300/80 font-medium">
                    <Music2 size={10} />
                    <span>Haute Horlogerie Melody</span>
                  </div>
                  <div className="truncate font-serif text-base sm:text-xl font-light text-rose-100 mt-0.5">
                    {songTitle}
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-white/45">
                    {isPlaying && (
                      <span className="flex items-center gap-1.5 text-amber-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span>Playing today&apos;s song</span>
                      </span>
                    )}
                    {isFinished && (
                      <span className="flex items-center gap-1.5 text-amber-200/90 font-medium">
                        <RotateCcw size={10} className="text-amber-300 animate-spin" />
                        <span>Song finished • Tap to replay</span>
                      </span>
                    )}
                    {!isPlaying && !isFinished && (
                      <span>Paused</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Controls & Liquid Gold Equalizer */}
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
                {/* 16-Band Liquid Gold Equalizer */}
                <div className="flex h-6 items-end gap-1 px-1">
                  {[0.4, 0.7, 1, 0.5, 0.9, 0.6, 0.8, 0.35, 0.9, 0.6].map((scale, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isPlaying ? ["20%", `${scale * 100}%`, "30%"] : "20%",
                      }}
                      transition={{
                        duration: 0.45 + i * 0.07,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-1 rounded-full bg-gradient-to-t from-amber-400 via-rose-400 to-amber-200"
                    />
                  ))}
                </div>

                {/* Play / Pause / Replay Button */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  onClick={togglePlay}
                  className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-tr from-amber-100 via-white to-amber-200 text-black shadow-xl hover:brightness-110 transition"
                  aria-label={isPlaying ? "Pause" : isFinished ? "Replay song" : "Play"}
                >
                  {isPlaying ? (
                    <Pause size={18} />
                  ) : isFinished ? (
                    <RotateCcw size={18} className="text-rose-600" />
                  ) : (
                    <Play size={18} className="ml-0.5" />
                  )}
                </motion.button>

                {/* Mute Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  onClick={toggleMute}
                  className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white transition"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </motion.button>
              </div>
            </div>

            {/* Precision Scrub Bar with Timestamps */}
            <div className="mt-6">
              <div
                onClick={handleSeek}
                className="group relative h-2 w-full cursor-pointer overflow-hidden rounded-full bg-white/10"
              >
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-200 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[10px] text-white/40 font-light">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* =================================================
            BOTTOM FOOTER
        ================================================= */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex items-center justify-center gap-3 text-center text-[10px] uppercase tracking-[0.4em] text-amber-200/50 font-light"
        >
          <Heart size={12} fill="currentColor" className="text-amber-300" />
          <span>Crafted with infinite love • Anbu Arasi</span>
          <Heart size={12} fill="currentColor" className="text-amber-300" />
        </motion.div>
      </div>

      {/* =================================================
          FULL-SCREEN PHOTO LIGHTBOX
      ================================================= */}
      <AnimatePresence>
        {showLightbox && photoSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center bg-black/95 p-3 sm:p-10 backdrop-blur-3xl"
          >
            <button
              type="button"
              onClick={() => setShowLightbox(false)}
              className="fixed right-4 top-4 sm:right-6 sm:top-6 z-[260] flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20 shadow-lg"
            >
              <X size={18} />
            </button>

            <div className="relative max-h-[85vh] max-w-4xl text-center px-2 sm:px-4">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-300/40 bg-black/90 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_70px_rgba(251,191,36,0.3)] p-2 sm:p-4">
                {/* Background Ambient Glow */}
                <img
                  src={photoSrc}
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
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover blur-3xl scale-125 opacity-35 brightness-75"
                />

                <motion.img
                  src={photoSrc}
                  alt={`Memory for day ${day}`}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.endsWith(".png")) {
                      target.src = target.src.replace(".png", ".jpg");
                    } else if (target.src.endsWith(".jpg")) {
                      target.src = target.src.replace(".jpg", ".png");
                    }
                  }}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10 max-h-[70vh] sm:max-h-[74vh] w-auto max-w-[90vw] mx-auto rounded-xl sm:rounded-2xl object-contain shadow-2xl"
                />
              </div>

              <div className="mt-4 font-serif text-lg sm:text-2xl font-light text-rose-100">
                Day {formattedDay} — A cherished royal memory with Anbu Arasi ❤️
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DailyExperience;
