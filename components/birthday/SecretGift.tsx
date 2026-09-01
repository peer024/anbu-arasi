"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Heart, X, PackageOpen } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

export function SecretGift() {
  const [opened, setOpened] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleOpenGift = () => {
    if (opened) return;
    sounds.playWaxSeal();
    setOpened(true);

    window.setTimeout(() => {
      sounds.playCelebration();
      setShowMessage(true);
    }, 1000);
  };

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-5 py-32">
      {/* Background Soft Glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.25, 0.12] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/15 blur-[140px]"
      />

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-5 py-2 text-[10px] uppercase tracking-[0.45em] text-rose-200/80"
        >
          <Sparkles size={12} />
          <span>A Secret Kept Safe</span>
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
          I kept something <span className="font-display italic text-shimmer">just for you.</span>
        </motion.h2>

        {/* 3D GIFT BOX CONTAINER */}
        <div className="relative mx-auto mt-12 sm:mt-16 h-64 w-64 sm:h-80 sm:w-80">
          {/* Ambient Glow behind box */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute left-1/2 top-1/2 h-44 w-44 sm:h-56 sm:w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400/25 blur-3xl"
          />

          {/* GIFT BOX BUTTON */}
          <motion.button
            type="button"
            onClick={handleOpenGift}
            disabled={opened}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={opened ? {} : { scale: 1.08, y: -8 }}
            whileTap={opened ? {} : { scale: 0.95 }}
            animate={
              opened
                ? { scale: [1, 1.1, 0.8], opacity: [1, 1, 0], y: -20 }
                : { y: [0, -8, 0] }
            }
            transition={
              opened
                ? { duration: 0.9 }
                : { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }
            className="
              group absolute left-1/2 top-1/2 flex h-40 w-40 sm:h-48 sm:w-48 -translate-x-1/2 -translate-y-1/2
              items-center justify-center rounded-[28px] sm:rounded-[36px]
              border border-rose-300/30
              bg-gradient-to-br from-white/[0.08] via-rose-500/[0.08] to-purple-500/[0.05]
              shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(251,113,133,0.2)]
              backdrop-blur-2xl transition-all duration-500
              hover:border-rose-300/60 hover:shadow-[0_25px_60px_rgba(251,113,133,0.4)]
            "
          >
            {/* Satin Ribbon Cross Effect */}
            <div className="absolute inset-x-0 top-1/2 h-3.5 sm:h-4 -translate-y-1/2 bg-gradient-to-r from-rose-400/40 via-rose-200/50 to-rose-400/40 shadow-sm" />
            <div className="absolute inset-y-0 left-1/2 w-3.5 sm:w-4 -translate-x-1/2 bg-gradient-to-b from-rose-400/40 via-rose-200/50 to-rose-400/40 shadow-sm" />

            {/* Glowing Bow / Gift Icon */}
            <div className="relative z-10 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-rose-500/20 text-rose-100 shadow-[0_0_25px_rgba(251,113,133,0.6)] backdrop-blur-md">
              <Gift size={34} strokeWidth={1.3} className="sm:w-10 sm:h-10 text-rose-100 drop-shadow-md" />
            </div>
          </motion.button>

          {/* Floating Stardust surrounding box */}
          {!opened &&
            Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={index}
                className="absolute text-rose-300/60"
                style={{
                  left: `${10 + (index * 37) % 80}%`,
                  top: `${5 + (index * 53) % 85}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.4, 1.2, 0.4],
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 2 + (index % 3),
                  delay: index * 0.2,
                  repeat: Infinity,
                }}
              >
                <Sparkles size={10 + (index % 3) * 4} />
              </motion.div>
            ))}
        </div>

        {/* HINT */}
        {!opened && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-[9px] sm:text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.4em] text-rose-200/50 font-medium animate-pulse"
          >
            ✦ Tap the gift to unwrap ✦
          </motion.div>
        )}
      </div>

      {/* ===============================================
          SECRET MESSAGE MODAL
      ================================================ */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-[#030206]/96 px-4 py-6 sm:px-5 sm:py-10 backdrop-blur-2xl"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowMessage(false)}
              className="fixed right-4 top-4 sm:right-6 sm:top-6 z-[220] flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20 shadow-lg"
            >
              <X size={18} />
            </button>

            {/* Floating Sparkles in modal */}
            <div className="pointer-events-none absolute inset-0">
              {Array.from({ length: 30 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute text-rose-300/40"
                  style={{
                    left: `${(index * 31) % 100}%`,
                    top: `${(index * 47) % 100}%`,
                  }}
                  animate={{
                    y: [0, -25, 0],
                    opacity: [0.1, 0.7, 0.1],
                  }}
                  transition={{
                    duration: 2.5 + (index % 3),
                    delay: index * 0.05,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles size={10} />
                </motion.div>
              ))}
            </div>

            {/* MESSAGE CARD */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="
                relative z-10 w-full max-w-xl rounded-[28px] sm:rounded-[36px]
                border border-rose-300/20 bg-gradient-to-b from-white/[0.07] to-white/[0.02]
                p-6 sm:p-14 text-center shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_60px_rgba(251,113,133,0.2)]
                backdrop-blur-2xl
              "
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.35, type: "spring" }}
                className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-rose-300/30 bg-rose-500/10 text-rose-200 shadow-[0_0_35px_rgba(251,113,133,0.3)]"
              >
                <Heart size={26} className="sm:w-8 sm:h-8" fill="currentColor" />
              </motion.div>

              <div className="mt-6 sm:mt-8 text-[9px] sm:text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.45em] text-rose-300/60 font-medium">
                Secretly Kept For You
              </div>

              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="mt-4 sm:mt-5 font-serif text-2xl sm:text-4xl font-light text-rose-100"
              >
                You found it. ❤️
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-4 sm:mt-6 text-sm sm:text-base font-light leading-relaxed text-white/60"
              >
                Some surprises are not meant to be explained in many words.
                <br />
                They are simply created from the heart to make you smile.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-6 sm:mt-8 font-display italic text-lg sm:text-xl text-rose-200/90"
              >
                And this entire little world was crafted especially for you, Anbu Arasi. 💖
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}