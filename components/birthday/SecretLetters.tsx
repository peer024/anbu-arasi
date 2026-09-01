"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Sparkles, X, ChevronRight, Feather } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

const LETTERS = [
  {
    id: "birthday",
    label: "A Special Letter",
    title: "For your birthday ❤️",
    sealColor: "#8B1E3F",
    icon: "💌",
    lines: [
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
      "I LOVE YOU SO MUCH, MAH. 💖💖",
    ],
  },
  {
    id: "unsaid",
    label: "Things I Never Said",
    title: "A few words I kept inside",
    sealColor: "#702963",
    icon: "🤍",
    lines: [
      "Sometimes there are things that are difficult to say out loud.",
      "So I thought I would leave a few of them here in this little letter.",
      "You became someone I genuinely look forward to talking to every single day.",
      "Even the smallest conversations with you stay in my mind for a long time.",
      "I may not always know how to explain what I feel...",
      "but that does not make the feeling any less real or deep.",
      "Some people simply become special without asking permission.",
      "And somehow, you became one of those people for me. ❤️",
    ],
  },
  {
    id: "promise",
    label: "One Quiet Promise",
    title: "Something I want you to remember",
    sealColor: "#990033",
    icon: "🕯️",
    lines: [
      "I cannot promise that every day will always be completely easy.",
      "But I can promise one simple thing.",
      "Whenever you need someone who genuinely cares and listens...",
      "I want to always be there.",
      "Whenever life feels a little heavy or overwhelming...",
      "I hope you remember that you do not have to carry everything alone.",
      "For you, I will always try my best to be there, Mah. ❤️",
    ],
  },
  {
    id: "wish",
    label: "My Birthday Prayer",
    title: "What I wish for you",
    sealColor: "#A52A2A",
    icon: "✨",
    lines: [
      "On your birthday, I do not want to wish you only one beautiful day.",
      "I wish you beautiful, peaceful days throughout the entire year.",
      "I hope you smile more and laugh from the bottom of your heart.",
      "I hope you find reasons to be happy even on ordinary days.",
      "I hope every dream you carry quietly in your heart finds its way to you.",
      "And most of all...",
      "I hope you always remember how truly special and loved you are. ❤️",
    ],
  },
];

export function SecretLetters() {
  const [activeLetter, setActiveLetter] = useState<(typeof LETTERS)[number] | null>(null);
  const [visibleLines, setVisibleLines] = useState(0);

  const openLetter = (letter: (typeof LETTERS)[number]) => {
    sounds.playWaxSeal();
    setActiveLetter(letter);
    setVisibleLines(0);

    letter.lines.forEach((_, index) => {
      window.setTimeout(() => {
        setVisibleLines(index + 1);
        if (index % 3 === 0) sounds.playSparkle();
      }, 400 * index);
    });
  };

  const closeLetter = () => {
    sounds.playChime(600, 0.3);
    setActiveLetter(null);
    setVisibleLines(0);
  };

  return (
    <>
      <section
        data-section="secret-letters"
        className="relative overflow-hidden px-5 py-32 sm:px-8 sm:py-40"
      >
        {/* Soft Background Aurora */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/10 blur-[150px]"
        />

        <div className="relative z-10 mx-auto max-w-5xl">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/[0.08] px-5 py-2 text-[10px] uppercase tracking-[0.45em] text-rose-200/80"
            >
              <Feather size={12} />
              <span>Handwritten From The Heart</span>
              <Feather size={12} />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mt-6 font-serif text-4xl font-light tracking-tight sm:text-6xl"
            >
              Secret letters <span className="font-display italic text-shimmer">sealed for you.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mx-auto mt-6 max-w-lg text-sm font-light leading-relaxed text-white/45"
            >
              Four wax-sealed envelopes containing thoughts written in quiet moments. Tap any seal to break and read.
            </motion.p>
          </div>

          {/* 3D ENVELOPES GRID */}
          <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            {LETTERS.map((letter, index) => (
              <WaxSealedEnvelopeCard
                key={letter.id}
                letter={letter}
                index={index}
                onOpen={() => openLetter(letter)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          FULLSCREEN PARCHMENT LETTER READER
      =================================================== */}
      <AnimatePresence>
        {activeLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex items-center justify-center overflow-y-auto bg-[#030206]/97 px-3 py-6 backdrop-blur-2xl sm:px-6 sm:py-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeLetter}
              className="fixed right-4 top-4 sm:right-6 sm:top-6 z-[230] flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20 shadow-lg"
            >
              <X size={18} />
            </button>

            {/* PARCHMENT LETTER MODAL */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.94 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="
                relative my-auto w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-[28px] sm:rounded-[36px]
                border border-amber-200/20
                bg-gradient-to-b from-[#181116] via-[#120c10] to-[#0d080b]
                p-6 sm:p-14 shadow-[0_30px_90px_rgba(0,0,0,0.8),0_0_80px_rgba(251,113,133,0.15)]
                backdrop-blur-3xl
              "
            >
              {/* Subtle Gold Foil Corner Borders */}
              <div className="pointer-events-none absolute left-4 top-4 sm:left-6 sm:top-6 h-6 w-6 sm:h-8 sm:w-8 border-l-2 border-t-2 border-amber-300/30" />
              <div className="pointer-events-none absolute right-4 top-4 sm:right-6 sm:top-6 h-6 w-6 sm:h-8 sm:w-8 border-r-2 border-t-2 border-amber-300/30" />
              <div className="pointer-events-none absolute bottom-4 left-4 sm:bottom-6 sm:left-6 h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-l-2 border-amber-300/30" />
              <div className="pointer-events-none absolute bottom-4 right-4 sm:bottom-6 sm:right-6 h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-r-2 border-amber-300/30" />

              {/* Header inside letter */}
              <div className="text-center">
                <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.45em] text-rose-300/60 font-medium">
                  {activeLetter.label}
                </div>
                <h3 className="mt-2 sm:mt-3 font-serif text-2xl sm:text-4xl font-light text-rose-100">
                  {activeLetter.title}
                </h3>
                <div className="mx-auto mt-3 sm:mt-4 h-[1px] w-20 sm:w-24 bg-gradient-to-r from-transparent via-rose-300/30 to-transparent" />
              </div>

              {/* Letter Lines */}
              <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-5 text-left font-serif text-sm sm:text-lg font-light leading-relaxed sm:leading-8 text-rose-50/90">
                {activeLetter.lines.slice(0, visibleLines).map((line, lineIndex) => {
                  const isSpecial = line.includes("I LOVE YOU") || line.includes("Anbu Arasi");
                  return (
                    <motion.p
                      key={lineIndex}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className={
                        isSpecial
                          ? "pt-3 sm:pt-4 font-display italic text-xl sm:text-3xl text-rose-300 drop-shadow-[0_0_20px_rgba(251,113,133,0.5)] text-center"
                          : "text-rose-100/85"
                      }
                    >
                      {line}
                    </motion.p>
                  );
                })}
              </div>

              {/* Bottom Sign-off */}
              {visibleLines >= activeLetter.lines.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-10 sm:mt-12 border-t border-white/10 pt-6 sm:pt-8 text-center"
                >
                  <div className="font-handwriting text-2xl sm:text-3xl text-rose-300">
                    With endless love & care,
                  </div>
                  <div className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/40">
                    Always by your side
                  </div>

                  <button
                    type="button"
                    onClick={closeLetter}
                    className="mt-6 sm:mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white transition hover:bg-white/20"
                  >
                    <span>Fold & Close Letter</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* =========================================================
   3D WAX-SEALED ENVELOPE CARD
========================================================= */

function WaxSealedEnvelopeCard({
  letter,
  index,
  onOpen,
}: {
  letter: (typeof LETTERS)[number];
  index: number;
  onOpen: () => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
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

    setTilt({ x: rotateX, y: rotateY });
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
          sounds.playChime(700, 0.25);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setTilt({ x: 0, y: 0 });
        }}
        onClick={onOpen}
        style={{
          transformStyle: "preserve-3d",
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.03 : 1}, ${isHovered ? 1.03 : 1}, 1)`,
          transition: isHovered
            ? "transform 0.1s cubic-bezier(0.2, 0, 0, 1)"
            : "transform 0.6s cubic-bezier(0.2, 0, 0, 1)",
        }}
        className="
          group relative cursor-pointer overflow-hidden rounded-[32px]
          border border-rose-300/20
          bg-gradient-to-b from-[#181116]/90 via-[#120a10]/80 to-[#0c050a]/90
          p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]
          backdrop-blur-2xl transition-all duration-500
          hover:border-rose-300/50 hover:shadow-[0_25px_60px_rgba(251,113,133,0.25)]
        "
      >
        {/* Envelope Top Triangular Flap Decoration */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white/[0.04] to-transparent border-b border-white/[0.05]" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-2xl">{letter.icon}</span>
            <div className="flex items-center gap-1.5 rounded-full border border-rose-300/20 bg-rose-500/10 px-3.5 py-1 text-[9px] uppercase tracking-[0.25em] text-rose-200">
              <Sparkles size={10} />
              <span>Sealed</span>
            </div>
          </div>

          <div className="mt-8 text-[10px] uppercase tracking-[0.35em] text-rose-300/60 font-medium">
            {letter.label}
          </div>

          <h3 className="mt-2 font-serif text-2xl font-light text-rose-100 group-hover:text-white transition-colors">
            {letter.title}
          </h3>

          {/* WAX SEAL STAMP BUTTON */}
          <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-3">
              {/* Wax Seal Disc */}
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.6)] border border-amber-300/40 text-amber-200"
                style={{ backgroundColor: letter.sealColor }}
              >
                <Heart size={16} fill="currentColor" />
              </div>
              <span className="text-xs font-light text-white/60 group-hover:text-rose-200 transition-colors">
                Break seal & read
              </span>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-transform group-hover:translate-x-1 group-hover:bg-rose-500 group-hover:text-white">
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}