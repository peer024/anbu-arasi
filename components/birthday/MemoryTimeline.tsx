"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, X, Maximize2, Camera } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

import { memories } from "@/data/memories";

const MEMORY_PHOTOS = memories.map((m) => m.image);
const PHOTO_COUNT = MEMORY_PHOTOS.length;

const MEMORY_ITEMS = [
  {
    day: "Day 001",
    title: "The beginning",
    text: "Some moments are small when they happen, but become special when we remember them.",
  },
  {
    day: "Day 030",
    title: "A little closer",
    text: "Somewhere between ordinary conversations and little moments, something beautiful started growing.",
  },
  {
    day: "Day 060",
    title: "A memory worth keeping",
    text: "Not every memory needs a reason. Some are special simply because of who was there.",
  },
  {
    day: "Day 100",
    title: "Still here",
    text: "Time passes, but some people quietly become an important part of our thoughts.",
  },
  {
    day: "Day 150",
    title: "More little moments",
    text: "A collection of little moments can sometimes become one beautiful story.",
  },
  {
    day: "Day 200",
    title: "Another chapter",
    text: "Every chapter does not have to be perfect to be worth remembering.",
  },
  {
    day: "Day 250",
    title: "A quiet favourite",
    text: "Some people become favourites without us ever knowing exactly when it happened.",
  },
  {
    day: "Day 300",
    title: "Almost there",
    text: "And somehow, all those little moments led us here.",
  },
  {
    day: "Birthday",
    title: "Your special day",
    text: "And today deserves a memory of its own. ❤️",
  },
];

export function MemoryTimeline() {
  const [selectedPhoto, setSelectedPhoto] = useState<{
    src: string;
    title: string;
    day: string;
  } | null>(null);

  return (
    <section className="relative overflow-hidden px-5 py-32 sm:px-8 sm:py-40">
      {/* Background Soft Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/[0.06] blur-[150px]" />

      {/* Header */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-5 py-2 text-[10px] uppercase tracking-[0.45em] text-rose-200/80"
        >
          <Sparkles size={12} />
          <span>Our Journey Through Time</span>
          <Sparkles size={12} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-6 font-serif text-4xl font-light tracking-tight sm:text-6xl"
        >
          A little journey <span className="font-display italic text-shimmer">through memories.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-6 max-w-lg text-sm font-light leading-relaxed text-white/45"
        >
          Not every day needs a photograph. Sometimes a quiet thought is enough to keep a moment alive forever.
        </motion.p>
      </div>

      {/* TIMELINE */}
      <div className="relative z-10 mx-auto mt-24 max-w-5xl">
        {/* Center Illuminated Spine */}
        <div className="absolute bottom-0 left-4 top-0 w-[2px] bg-gradient-to-b from-transparent via-rose-300/30 to-transparent md:left-1/2 md:-translate-x-1/2" />

        <div className="space-y-24 sm:space-y-32">
          {MEMORY_ITEMS.map((memory, index) => {
            const photo = MEMORY_PHOTOS[index % PHOTO_COUNT];
            const isRight = index % 2 === 1;

            return (
              <motion.div
                key={memory.day}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.05 }}
                className="relative grid grid-cols-[36px_1fr] gap-6 md:grid-cols-2 md:gap-20"
              >
                {/* Mobile Milestone Node */}
                <div className="relative z-20 flex h-9 w-9 items-center justify-center rounded-full border border-rose-300/40 bg-black/80 shadow-[0_0_15px_rgba(251,113,133,0.6)] backdrop-blur-xl md:hidden">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-400 animate-ping opacity-75" />
                  <div className="absolute h-2.5 w-2.5 rounded-full bg-rose-300" />
                </div>

                {/* Desktop Left */}
                <div className={`hidden md:block ${isRight ? "md:order-2" : "md:order-1"}`}>
                  <PolaroidMemoryCard
                    photo={photo}
                    day={memory.day}
                    title={memory.title}
                    text={memory.text}
                    align={isRight ? "left" : "right"}
                    onSelect={() => setSelectedPhoto({ src: photo, title: memory.title, day: memory.day })}
                  />
                </div>

                {/* Desktop Center Milestone Node */}
                <div className="absolute left-1/2 top-8 z-20 hidden -translate-x-1/2 md:flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-300/40 bg-black/90 shadow-[0_0_20px_rgba(251,113,133,0.5)] backdrop-blur-xl transition-transform hover:scale-125">
                    <Heart size={14} className="text-rose-300" fill="currentColor" />
                  </div>
                </div>

                {/* Desktop Right */}
                <div className={`hidden md:block ${isRight ? "md:order-1" : "md:order-2"}`}>
                  <PolaroidMemoryCard
                    photo={photo}
                    day={memory.day}
                    title={memory.title}
                    text={memory.text}
                    align={isRight ? "right" : "left"}
                    onSelect={() => setSelectedPhoto({ src: photo, title: memory.title, day: memory.day })}
                  />
                </div>

                {/* Mobile Card */}
                <div className="col-span-2 min-w-0 pl-10 md:hidden">
                  <PolaroidMemoryCard
                    photo={photo}
                    day={memory.day}
                    title={memory.title}
                    text={memory.text}
                    align="left"
                    onSelect={() => setSelectedPhoto({ src: photo, title: memory.title, day: memory.day })}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center bg-black/95 p-3 sm:p-10 backdrop-blur-3xl"
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="fixed right-4 top-4 sm:right-6 sm:top-6 z-[260] flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20 shadow-lg"
            >
              <X size={18} />
            </button>

            <div className="relative max-h-[85vh] max-w-4xl text-center px-2 sm:px-4">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-300/30 bg-black/90 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_60px_rgba(251,113,133,0.25)] p-2 sm:p-4">
                {/* Ambient Blurred Backdrop */}
                <img
                  src={selectedPhoto.src}
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
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.endsWith(".png")) {
                      target.src = target.src.replace(".png", ".jpg");
                    } else if (target.src.endsWith(".jpg")) {
                      target.src = target.src.replace(".jpg", ".png");
                    }
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative z-10 max-h-[70vh] sm:max-h-[74vh] w-auto max-w-[90vw] mx-auto rounded-xl sm:rounded-2xl object-contain shadow-2xl"
                />
              </div>

              <div className="mt-4 font-serif text-lg sm:text-2xl font-light text-rose-100">
                {selectedPhoto.day} — {selectedPhoto.title} ❤️
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* END FOOTER */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="relative z-10 mx-auto mt-24 sm:mt-28 flex max-w-md items-center justify-center gap-3 text-center text-[9px] sm:text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.4em] text-rose-300/40 font-light"
      >
        <Heart size={12} fill="currentColor" />
        <span>Every Memory Held Close To Heart</span>
        <Heart size={12} fill="currentColor" />
      </motion.div>
    </section>
  );
}

/* =========================================================
   3D TILT POLAROID MEMORY CARD
========================================================= */

function PolaroidMemoryCard({
  photo,
  day,
  title,
  text,
  align,
  onSelect,
}: {
  photo: string;
  day: string;
  title: string;
  text: string;
  align: "left" | "right";
  onSelect: () => void;
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
    <div className={align === "right" ? "md:text-right" : "md:text-left"}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          setIsHovered(true);
          sounds.playChime(650, 0.35);
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
          group relative cursor-pointer overflow-hidden rounded-[26px] sm:rounded-[36px]
          border border-white/[0.14] ring-1 ring-white/10
          bg-gradient-to-b from-neutral-900/90 via-black/80 to-neutral-950/95
          shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)]
          backdrop-blur-2xl transition-all duration-500 hover:border-amber-300/40 hover:shadow-[0_25px_60px_rgba(251,113,133,0.22)]
        "
        onClick={onSelect}
      >
        {/* Specular highlight */}
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-0 z-30 opacity-30 transition-opacity"
            style={{
              background: `radial-gradient(circle 180px at ${tilt.glareX}% ${tilt.glareY}%, rgba(251, 191, 36, 0.35), transparent 70%)`,
            }}
          />
        )}

        {/* PHOTO FRAME INNER CANVAS */}
        <div className="relative aspect-[16/11] w-full overflow-hidden bg-black/80 p-2 sm:p-2.5">
          <div className="relative h-full w-full overflow-hidden rounded-[18px] sm:rounded-[26px] bg-black/60 border border-white/5">
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
            <div className="relative z-10 flex h-full w-full items-center justify-center p-2.5">
              <img
                src={photo}
                alt={title}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.endsWith(".png")) {
                    target.src = target.src.replace(".png", ".jpg");
                  } else if (target.src.endsWith(".jpg")) {
                    target.src = target.src.replace(".jpg", ".png");
                  }
                }}
                className="max-h-full max-w-full object-contain rounded-lg filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>

            {/* Vignette Shadow */}
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

            {/* DAY BADGE */}
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-30 flex items-center gap-1.5 sm:gap-2 rounded-full border border-amber-300/30 bg-black/75 px-3 sm:px-4 py-1 sm:py-1.5 text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-amber-200 backdrop-blur-xl shadow-lg">
              <Camera size={10} className="text-amber-300" />
              <span>{day}</span>
            </div>

            <div className="absolute right-3 sm:right-4 bottom-3 sm:bottom-4 z-30 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-xl opacity-0 transition-opacity group-hover:opacity-100 shadow-md">
              <Maximize2 size={12} />
            </div>
          </div>
        </div>

        {/* TEXT CONTENT */}
        <div className="p-5 sm:p-7">
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-amber-300/70 font-medium">
            {day}
          </div>

          <h3 className="mt-1.5 sm:mt-2 font-serif text-xl sm:text-2xl font-light text-rose-100 group-hover:text-white transition-colors">
            {title}
          </h3>

          <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-light leading-relaxed text-white/50">
            {text}
          </p>
        </div>
      </motion.div>
    </div>
  );
}