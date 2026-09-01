"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cake, Sparkles, Heart, Wind, Mic, MicOff } from "lucide-react";
import { ConfettiFireworks } from "@/components/effects/ConfettiFireworks";
import { sounds } from "@/lib/soundEffects";

export function BirthdayCake() {
  const [wished, setWished] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showHeartReveal, setShowHeartReveal] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [micListening, setMicListening] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const makeWish = () => {
    if (wished) return;

    sounds.playCandleBlow();
    setWished(true);
    setShowFireworks(true);
    stopMic();

    setTimeout(() => {
      sounds.playCelebration();
      setShowHeartReveal(true);
    }, 600);

    window.setTimeout(() => {
      setShowHeartReveal(false);
      setShowMessage(true);
    }, 4500);
  };

  // Optional Microphone Blow Detection
  const startMic = async () => {
    if (wished) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      setMicListening(true);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkBlow = () => {
        if (!analyserRef.current || wished) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Low frequency energy check for breath / blowing sound into microphone
        let lowEnergy = 0;
        for (let i = 0; i < 25; i++) {
          lowEnergy += dataArray[i];
        }
        const avg = lowEnergy / 25;

        // If high energy detected in low frequencies, trigger blow out
        if (avg > 75) {
          makeWish();
          return;
        }

        animationFrameRef.current = requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch {
      setMicListening(false);
    }
  };

  const stopMic = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    setMicListening(false);
  };

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  const heartParticles = Array.from({ length: 84 }, (_, index) => {
    const t = (2 * Math.PI * index) / 84;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    return {
      x: x * 9.5,
      y: -y * 9.5,
    };
  });

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-5 py-32">
      {/* Grand Fireworks & Confetti Burst */}
      <ConfettiFireworks active={showFireworks} onComplete={() => setShowFireworks(false)} />

      {/* Background Soft Aurora Glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.28, 0.12] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/15 blur-[150px]"
      />

      <div className="relative z-10 w-full max-w-3xl text-center">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-5 py-2 text-[10px] uppercase tracking-[0.45em] text-rose-200/80"
        >
          <Sparkles size={12} />
          <span>One Little Birthday Wish</span>
          <Sparkles size={12} />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-6 font-serif text-4xl font-light tracking-tight sm:text-6xl"
        >
          Make a wish, <span className="font-display italic text-shimmer">Anbu Arasi. ✨</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-white/45"
        >
          Close your eyes for a gentle moment.
          <br />
          Think of the deepest, sweetest wish in your heart.
        </motion.p>

        {/* =================================================
            3D TIERED BIRTHDAY CAKE
        ================================================= */}
        <div className="relative mx-auto mt-16 h-[340px] w-[320px]">
          {/* Cake Glowing Base Disc */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-2 left-1/2 h-24 w-72 -translate-x-1/2 rounded-full bg-rose-400/30 blur-2xl"
          />

          {/* Platinum Plate */}
          <div className="absolute bottom-4 left-1/2 h-4 w-72 -translate-x-1/2 rounded-full border border-white/20 bg-gradient-to-r from-white/10 via-rose-100/20 to-white/10 shadow-2xl backdrop-blur-xl" />

          {/* CAKE LOWER TIER */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, type: "spring" }}
            className="absolute bottom-8 left-1/2 h-24 w-60 -translate-x-1/2"
          >
            {/* Lower Tier Body */}
            <div className="absolute inset-0 rounded-2xl border border-rose-200/20 bg-gradient-to-b from-rose-950/60 via-purple-950/40 to-neutral-950/90 shadow-2xl backdrop-blur-xl" />
            {/* Frosting Drips */}
            <div className="absolute top-0 inset-x-0 h-6 rounded-t-2xl bg-gradient-to-b from-rose-200/30 to-transparent border-t border-rose-200/40" />
            {/* Gold Pearls */}
            <div className="absolute bottom-2 left-6 h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_6px_#fde047]" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-rose-300 shadow-[0_0_6px_#f43f5e]" />
            <div className="absolute bottom-2 right-6 h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_6px_#fde047]" />
          </motion.div>

          {/* CAKE UPPER TIER */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, type: "spring" }}
            className="absolute bottom-32 left-1/2 h-20 w-44 -translate-x-1/2"
          >
            {/* Upper Tier Body */}
            <div className="absolute inset-0 rounded-2xl border border-rose-200/25 bg-gradient-to-b from-rose-900/50 via-pink-950/40 to-neutral-900/90 shadow-xl backdrop-blur-xl" />
            {/* Frosting Top */}
            <div className="absolute top-0 inset-x-0 h-5 rounded-t-2xl bg-gradient-to-b from-rose-100/35 to-transparent border-t border-rose-100/50" />
            {/* Pearl decor */}
            <div className="absolute top-8 left-4 h-1.5 w-1.5 rounded-full bg-amber-200 shadow-[0_0_5px_#fef08a]" />
            <div className="absolute top-8 right-4 h-1.5 w-1.5 rounded-full bg-amber-200 shadow-[0_0_5px_#fef08a]" />
          </motion.div>

          {/* CANDLES */}
          <div className="absolute bottom-[206px] left-1/2 flex -translate-x-1/2 gap-6">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="relative h-14 w-2.5 rounded-full bg-gradient-to-b from-amber-100 via-rose-200 to-rose-400 shadow-md"
              >
                {/* CANDLE FLAME */}
                <AnimatePresence>
                  {!wished && (
                    <>
                      {/* Outer Flame Glow */}
                      <motion.div
                        animate={{
                          scale: [1, 1.25, 0.95, 1.15, 1],
                          opacity: [0.7, 1, 0.6, 0.9, 0.7],
                          y: [0, -2, 1, -1, 0],
                        }}
                        transition={{
                          duration: 0.8 + index * 0.15,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        exit={{ opacity: 0, scale: 0, y: -25 }}
                        className="absolute -left-2 -top-8 h-8 w-6 rounded-full bg-gradient-to-t from-amber-400 via-orange-300 to-rose-200 blur-[2px] shadow-[0_0_20px_#f59e0b]"
                      />

                      {/* Inner Flame Core */}
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 0.9, 1.05, 1],
                          opacity: [0.9, 1, 0.8, 1, 0.9],
                        }}
                        transition={{
                          duration: 0.6 + index * 0.1,
                          repeat: Infinity,
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute left-1/2 -top-6 h-4 w-2 -translate-x-1/2 rounded-full bg-yellow-100 shadow-[0_0_10px_#ffffff]"
                      />
                    </>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Cake Floating Mini Sparkles */}
          {!wished &&
            Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={index}
                className="absolute text-rose-300/60"
                style={{
                  left: `${10 + (index * 39) % 80}%`,
                  top: `${10 + (index * 29) % 70}%`,
                }}
                animate={{
                  opacity: [0, 0.9, 0],
                  scale: [0.4, 1.2, 0.4],
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 2.2 + (index % 3),
                  delay: index * 0.18,
                  repeat: Infinity,
                }}
              >
                <Sparkles size={11 + (index % 3) * 3} />
              </motion.div>
            ))}
        </div>

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto w-full px-4">
          <AnimatePresence mode="wait">
            {!wished ? (
              <>
                {/* Main Wish Button */}
                <motion.button
                  key="wish-button"
                  type="button"
                  onClick={makeWish}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    w-full sm:w-auto flex items-center justify-center gap-3 rounded-full
                    border border-rose-300/30 bg-white px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-medium text-black
                    shadow-[0_0_35px_rgba(255,255,255,0.3)] transition-all hover:bg-rose-50
                  "
                >
                  <Wind size={17} className="text-rose-500 shrink-0" />
                  <span>Make a Wish & Blow Candles</span>
                </motion.button>

                {/* Optional Mic Detection Button */}
                <motion.button
                  key="mic-button"
                  type="button"
                  onClick={micListening ? stopMic : startMic}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-full border px-5 sm:px-6 py-3.5 sm:py-4 text-sm font-medium backdrop-blur-xl transition-all
                    ${
                      micListening
                        ? "border-rose-400 bg-rose-500/20 text-rose-200 animate-pulse"
                        : "border-white/10 bg-white/[0.05] text-white/70 hover:bg-white/[0.1] hover:text-white"
                    }
                  `}
                >
                  {micListening ? (
                    <>
                      <Mic size={16} className="text-rose-300 animate-bounce shrink-0" />
                      <span>Blow into mic now...</span>
                    </>
                  ) : (
                    <>
                      <Mic size={16} className="shrink-0" />
                      <span>Blow via Microphone</span>
                    </>
                  )}
                </motion.button>
              </>
            ) : (
              <motion.div
                key="wished-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 text-sm sm:text-base font-light text-rose-200"
              >
                <Sparkles size={16} className="shrink-0" />
                <span>Your wish has been carried to the stars ✨</span>
                <Sparkles size={16} className="shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* =================================================
          CONSTELLATION HEART NAME REVEAL MODAL
      ================================================= */}
      <AnimatePresence>
        {showHeartReveal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center overflow-hidden bg-[#030206]/98 px-4 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: [0.3, 1.1, 1], opacity: [0, 0.4, 0.2] }}
              transition={{ duration: 3.8, ease: "easeOut" }}
              className="pointer-events-none absolute h-[400px] w-[400px] sm:h-[500px] sm:w-[500px] rounded-full bg-rose-500/25 blur-[140px]"
            />

            <div className="relative h-[300px] w-[300px] sm:h-[440px] sm:w-[440px] scale-90 sm:scale-100">
              {heartParticles.map(({ x, y }, index) => (
                <motion.div
                  key={index}
                  initial={{
                    x: ((index * 83) % 650) - 325,
                    y: ((index * 47) % 540) - 270,
                    opacity: 0,
                    scale: 0.2,
                  }}
                  animate={{
                    x,
                    y,
                    opacity: [0, 0.9, 1],
                    scale: [0.2, 1.2, 0.7],
                  }}
                  transition={{
                    duration: 3.2,
                    delay: index * 0.012,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute left-1/2 top-1/2 -ml-[3px] -mt-[3px] h-[7px] w-[7px] rounded-full bg-rose-100 shadow-[0_0_16px_rgba(251,113,133,1)]"
                />
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: [0, 0, 0.8, 0.35], scale: [0.7, 0.92, 1.04, 1] }}
                transition={{ duration: 3.8, times: [0, 0.72, 0.9, 1], ease: "easeOut" }}
                className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-rose-200/30 shadow-[0_0_80px_rgba(251,113,133,0.35)]"
              />

              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 3.1,
                  duration: 0.85,
                  type: "spring",
                  stiffness: 130,
                  damping: 14,
                }}
                className="absolute inset-0 flex items-center justify-center text-center"
              >
                <div>
                  <div className="text-[10px] uppercase tracking-[0.55em] text-rose-200/60 font-medium">
                    Happy Birthday
                  </div>
                  <div className="mt-3 font-serif text-5xl font-light tracking-tight text-white drop-shadow-[0_0_30px_rgba(251,113,133,0.5)] sm:text-7xl">
                    Anbu Arasi
                  </div>
                  <div className="mt-3 text-lg text-rose-200">❤️</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================================================
          WISH COMPLETED MESSAGE MODAL
      ================================================= */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] flex items-center justify-center bg-[#030206]/95 px-5 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative z-10 w-full max-w-xl rounded-[36px] border border-rose-300/20 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 text-center shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_50px_rgba(251,113,133,0.15)] sm:p-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-rose-300/30 bg-rose-500/10 text-rose-200 shadow-[0_0_40px_rgba(251,113,133,0.3)]"
              >
                <Heart size={32} fill="currentColor" />
              </motion.div>

              <div className="mt-8 text-[10px] uppercase tracking-[0.45em] text-rose-300/60 font-medium">
                Your Birthday Wish
              </div>

              <h3 className="mt-4 font-serif text-3xl font-light tracking-tight sm:text-4xl text-rose-100">
                I hope every dream comes true. ✨
              </h3>

              <p className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-white/50">
                Whatever you wished for in your quiet thoughts,
                <br />
                I pray life brings you endless warmth, joy, and peace.
              </p>

              <p className="mt-6 font-display italic text-lg text-rose-200/90">
                You deserve the most beautiful life, Mah. ❤️
              </p>

              <motion.button
                type="button"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  sounds.playChime(700, 0.5);
                  setShowMessage(false);
                  window.setTimeout(() => {
                    const nextSection = document.querySelector('[data-section="secret-letters"]');
                    nextSection?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 350);
                }}
                className="mx-auto mt-10 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white px-8 py-4 text-sm font-medium text-black shadow-lg hover:bg-rose-50"
              >
                <span>Continue your journey</span>
                <span className="text-lg">→</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default BirthdayCake;