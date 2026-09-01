"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Star, Gem, Crown, Compass } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

const SPECIAL_POINTS = [
  {
    number: "01",
    subtitle: "Radiance & Joy",
    title: "Your beautiful smile",
    text: "There is an effortless magic in your smile that can turn any ordinary, quiet moment into something profoundly warm and unforgettable.",
    icon: Sparkles,
  },
  {
    number: "02",
    subtitle: "Conversations & Voice",
    title: "The way you speak",
    text: "Even simple, everyday conversations with you somehow become cherished memories that linger softly in my mind long after we part.",
    icon: Star,
  },
  {
    number: "03",
    subtitle: "Quiet Details",
    title: "The little things you do",
    text: "It is never just the grand gestures. It is the tiny, thoughtful details and gentle habits of yours that make my heart feel so safe.",
    icon: Gem,
  },
  {
    number: "04",
    subtitle: "Serenity & Peace",
    title: "The way you make me feel",
    text: "Some people simply make the entire world feel lighter, brighter, and full of genuine purpose. You are that person for me, Anbu Arasi.",
    icon: Heart,
  },
  {
    number: "05",
    subtitle: "Pure Royal Grace",
    title: "Your kind and gentle heart",
    text: "The kindness and genuine warmth you carry inside are rarer than the most precious jewels in the universe.",
    icon: Crown,
  },
  {
    number: "06",
    subtitle: "Eternal & Irreplaceable",
    title: "My forever favourite soul",
    text: "Among eight billion people across the cosmos, you will always be the only one who holds this sacred place in my life. ❤️",
    icon: Compass,
  },
];

export function WhySpecial() {
  return (
    <section className="relative overflow-hidden px-5 py-32 sm:px-8 sm:py-40">
      {/* Background Soft Glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.3, 0.12] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-500/15 via-rose-500/15 to-purple-600/15 blur-[180px]"
      />

      {/* HEADER */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center gap-2.5 rounded-full border border-amber-300/40 bg-gradient-to-r from-amber-950/50 via-black/80 to-amber-950/50 px-5 py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-amber-200 backdrop-blur-2xl shadow-xl"
        >
          <Crown size={12} className="text-amber-300" />
          <span>Royal Constellations • Pure & Irreplaceable</span>
          <Crown size={12} className="text-amber-300" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-6 font-serif text-4xl font-light tracking-tight sm:text-6xl"
        >
          Why you are so <span className="font-display italic text-gold-shimmer">truly special. ✨</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-4 max-w-lg text-xs sm:text-sm font-light leading-relaxed text-white/50 px-2"
        >
          You do not have to try to be extraordinary. Just being who you are is a gift to the entire world.
        </motion.p>
      </div>

      {/* 6 ROYAL EDITORIAL CARDS */}
      <div className="relative z-10 mx-auto mt-20 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {SPECIAL_POINTS.map((point, index) => (
          <EditorialSpecialCard key={point.number} point={point} index={index} />
        ))}
      </div>

      {/* FOOTER QUOTE */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="relative z-10 mx-auto mt-24 flex max-w-md items-center justify-center gap-3 text-center text-[10px] uppercase tracking-[0.4em] text-amber-200/50 font-light"
      >
        <Heart size={12} fill="currentColor" className="text-amber-300" />
        <span>One In A Million • Anbu Arasi</span>
        <Heart size={12} fill="currentColor" className="text-amber-300" />
      </motion.div>
    </section>
  );
}

function EditorialSpecialCard({
  point,
  index,
}: {
  point: (typeof SPECIAL_POINTS)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = point.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTilt({
      x: rotateX,
      y: rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          setIsHovered(true);
          sounds.playChime(600 + index * 50, 0.25);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
        }}
        style={{
          transformStyle: "preserve-3d",
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.03 : 1}, ${isHovered ? 1.03 : 1}, 1)`,
          transition: isHovered
            ? "transform 0.1s cubic-bezier(0.2, 0, 0, 1)"
            : "transform 0.6s cubic-bezier(0.2, 0, 0, 1)",
        }}
        className="
          group relative overflow-hidden rounded-[28px] sm:rounded-[38px]
          border border-amber-300/30 ring-1 ring-white/10
          bg-gradient-to-b from-neutral-900/90 via-black/85 to-neutral-950/95
          p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(251,191,36,0.15)]
          backdrop-blur-3xl transition-all duration-500 hover:border-amber-300/70 hover:shadow-[0_25px_60px_rgba(251,191,36,0.3)]
        "
      >
        {/* Corner Gold Notches */}
        <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-amber-300/60 rounded-tl-sm" />
        <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-amber-300/60 rounded-tr-sm" />

        {/* Specular Prismatic glare */}
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-0 z-20 opacity-40 transition-opacity"
            style={{
              background: `radial-gradient(circle 200px at ${tilt.glareX}% ${tilt.glareY}%, rgba(251, 191, 36, 0.45), rgba(217, 70, 239, 0.2), transparent 70%)`,
            }}
          />
        )}

        {/* Oversized background Serif numeral */}
        <div className="pointer-events-none absolute -right-2 -top-4 font-serif text-8xl font-thin tracking-tighter text-amber-300/[0.04] transition-colors group-hover:text-amber-400/[0.12] select-none">
          {point.number}
        </div>

        {/* ICON WITH GOLD AURA */}
        <div className="relative z-10 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-400/[0.08] text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.25)] transition-transform duration-500 group-hover:scale-110 group-hover:bg-amber-400/[0.15]">
          <IconComponent size={22} className="sm:w-6 sm:h-6" />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 mt-6 sm:mt-8">
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-amber-300/80 font-medium">
            {point.subtitle}
          </div>

          <h3 className="mt-2 font-serif text-xl sm:text-2xl font-light text-rose-100 group-hover:text-white transition-colors">
            {point.title}
          </h3>

          <p className="mt-3 text-xs sm:text-sm font-light leading-relaxed text-white/50 group-hover:text-white/70 transition-colors">
            {point.text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default WhySpecial;