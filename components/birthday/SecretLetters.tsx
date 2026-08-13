"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  LockKeyhole,
  Mail,
  Sparkles,
  X,
} from "lucide-react";

/* =========================================================
   LETTER DATA
========================================================= */

const LETTERS = [
  {
    id: "birthday",
    label: "A little message",
    title: "For your birthday ❤️",
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
    label: "Things I never said",
    title: "A few words I kept inside",
    icon: "🤍",
    lines: [
      "Sometimes there are things that are difficult to say out loud.",

      "So I thought I would leave a few of them here.",

      "You became someone I genuinely look forward to talking to.",

      "Even the smallest conversations with you can stay in my mind for a long time.",

      "I may not always know how to explain what I feel...",

      "but that does not make the feeling any less real.",

      "Some people simply become special without asking permission.",

      "And somehow, you became one of those people for me. ❤️",
    ],
  },

  {
    id: "promise",
    label: "One promise",
    title: "Something I want you to remember",
    icon: "🤍",
    lines: [
      "I cannot promise that every day will always be perfect.",

      "But I can promise one simple thing.",

      "Whenever you need someone who genuinely cares...",

      "I want to be there.",

      "Whenever life feels a little heavy...",

      "I hope you remember that you do not have to carry everything alone.",

      "For you, I will always try to be there, Mah. ❤️",
    ],
  },

  {
    id: "wish",
    label: "My birthday wish",
    title: "What I wish for you",
    icon: "✨",
    lines: [
      "On your birthday, I do not want to wish you only one beautiful day.",

      "I wish you beautiful days throughout the year.",

      "I hope you smile more.",

      "I hope you find reasons to be happy even on ordinary days.",

      "I hope every dream you carry quietly in your heart finds its way to you.",

      "And most of all...",

      "I hope you always remember how special you are. ❤️",
    ],
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export function SecretLetters() {
  const [activeLetter, setActiveLetter] =
    useState<
      (typeof LETTERS)[number] | null
    >(null);

  const [visibleLines, setVisibleLines] =
    useState(0);

  /* =======================================================
     OPEN LETTER
  ======================================================= */

  const openLetter = (
    letter: (typeof LETTERS)[number]
  ) => {
    setActiveLetter(letter);
    setVisibleLines(0);

    letter.lines.forEach(
      (_, index) => {
        window.setTimeout(() => {
          setVisibleLines(index + 1);
        }, 420 * index);
      }
    );
  };

  /* =======================================================
     CLOSE LETTER
  ======================================================= */

  const closeLetter = () => {
    setActiveLetter(null);
    setVisibleLines(0);
  };

  return (
    <>
      {/* ===================================================
          LETTER SECTION
      =================================================== */}

      <section
        className="
          relative
          overflow-hidden
          px-5
          py-32
          sm:px-8
          sm:py-40
        "
      >
        {/* BACKGROUND */}

        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.1, 0.22, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[500px]
            w-[500px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-rose-500/[0.07]
            blur-[150px]
          "
        />

        {/* HEADER */}

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-3xl
            text-center
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            className="
              flex
              items-center
              justify-center
              gap-2
              text-[9px]
              uppercase
              tracking-[0.45em]
              text-rose-200/40
            "
          >
            <Sparkles size={12} />

            Words kept for you

            <Sparkles size={12} />
          </motion.div>

          <motion.h2
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.15,
            }}
            className="
              mt-5
              text-4xl
              font-extralight
              tracking-[-0.04em]
              sm:text-6xl
            "
          >
            A few letters
            <span className="text-white/30">
              {" "}
              for you.
            </span>
          </motion.h2>

          <motion.p
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.3,
            }}
            className="
              mx-auto
              mt-6
              max-w-lg
              text-sm
              leading-7
              text-white/30
            "
          >
            You do not have to open them all.
            Open whichever one feels right.
          </motion.p>
        </div>

        {/* LETTER CARDS */}

        <div
          className="
            relative
            z-10
            mx-auto
            mt-20
            grid
            max-w-5xl
            gap-5
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {LETTERS.map(
            (letter, index) => (
              <motion.button
                key={letter.id}
                type="button"
                onClick={() =>
                  openLetter(letter)
                }
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -7,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-white/10
                  bg-white/[0.035]
                  p-7
                  text-left
                  backdrop-blur-xl
                  transition
                  duration-500
                  hover:border-rose-200/10
                  hover:bg-white/[0.055]
                "
              >
                {/* GLOW */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-12
                    -top-12
                    h-32
                    w-32
                    rounded-full
                    bg-rose-400/[0.04]
                    blur-3xl
                    transition
                    duration-700
                    group-hover:bg-rose-400/[0.09]
                  "
                />

                {/* ICON */}

                <div
                  className="
                    relative
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.035]
                      text-xl
                    "
                  >
                    {letter.icon}
                  </div>

                  <LockKeyhole
                    size={14}
                    strokeWidth={1}
                    className="
                      text-white/15
                      transition
                      duration-500
                      group-hover:text-rose-200/40
                    "
                  />
                </div>

                {/* LABEL */}

                <div
                  className="
                    relative
                    mt-8
                    text-[8px]
                    uppercase
                    tracking-[0.3em]
                    text-rose-200/35
                  "
                >
                  {letter.label}
                </div>

                {/* TITLE */}

                <h3
                  className="
                    relative
                    mt-3
                    text-xl
                    font-extralight
                    leading-snug
                    text-white/75
                  "
                >
                  {letter.title}
                </h3>

                {/* OPEN */}

                <div
                  className="
                    relative
                    mt-8
                    flex
                    items-center
                    gap-2
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                    text-white/25
                    transition
                    duration-500
                    group-hover:text-rose-200/55
                  "
                >
                  <Mail size={12} />

                  Open letter
                </div>
              </motion.button>
            )
          )}
        </div>

        {/* BOTTOM NOTE */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.5,
          }}
          className="
            relative
            z-10
            mx-auto
            mt-16
            flex
            items-center
            justify-center
            gap-3
            text-center
            text-[8px]
            uppercase
            tracking-[0.35em]
            text-white/20
          "
        >
          <Heart
            size={11}
            fill="currentColor"
          />

          Take your time.

          <Heart
            size={11}
            fill="currentColor"
          />
        </motion.div>
      </section>

      {/* ===================================================
          LETTER MODAL
      =================================================== */}

      <AnimatePresence>
        {activeLetter && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed
              inset-0
              z-[200]
              overflow-y-auto
              bg-[#050205]/95
              px-5
              py-10
              backdrop-blur-2xl
            "
          >
            {/* CLOSE */}

            <button
              type="button"
              onClick={closeLetter}
              className="
                fixed
                right-5
                top-5
                z-[220]
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/[0.05]
                text-white/60
                transition
                hover:bg-white/[0.08]
              "
              aria-label="Close letter"
            >
              <X size={17} />
            </button>

            {/* FLOATING SPARKLES */}

            <div
              className="
                pointer-events-none
                fixed
                inset-0
              "
            >
              {Array.from({
                length: 35,
              }).map((_, index) => (
                <motion.div
                  key={index}
                  className="
                    absolute
                    text-rose-200/30
                  "
                  style={{
                    left: `${
                      (index * 31) %
                      100
                    }%`,
                    top: `${
                      (index * 47) %
                      100
                    }%`,
                  }}
                  animate={{
                    opacity: [
                      0.05,
                      0.5,
                      0.05,
                    ],
                    y: [
                      0,
                      -18,
                      0,
                    ],
                  }}
                  transition={{
                    duration:
                      2.5 +
                      (index % 3),
                    delay:
                      index * 0.06,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles
                    size={
                      7 +
                      (index % 3) * 3
                    }
                  />
                </motion.div>
              ))}
            </div>

            {/* LETTER */}

            <div
              className="
                relative
                z-10
                mx-auto
                flex
                min-h-full
                max-w-2xl
                items-center
                justify-center
              "
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 35,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.75,
                  type: "spring",
                }}
                className="
                  my-10
                  w-full
                  rounded-[32px]
                  border
                  border-white/10
                  bg-white/[0.035]
                  p-7
                  shadow-2xl
                  shadow-rose-500/[0.06]
                  sm:p-12
                "
              >
                {/* HEADER */}

                <div className="text-center">
                  <div
                    className="
                      mx-auto
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-full
                      bg-rose-200/[0.06]
                      text-xl
                    "
                  >
                    {activeLetter.icon}
                  </div>

                  <div
                    className="
                      mt-7
                      text-[8px]
                      uppercase
                      tracking-[0.45em]
                      text-rose-200/35
                    "
                  >
                    {activeLetter.label}
                  </div>

                  <h3
                    className="
                      mt-4
                      text-3xl
                      font-extralight
                      tracking-tight
                      sm:text-4xl
                    "
                  >
                    {activeLetter.title}
                  </h3>
                </div>

                {/* DIVIDER */}

                <div
                  className="
                    mx-auto
                    mt-9
                    h-px
                    w-16
                    bg-gradient-to-r
                    from-transparent
                    via-rose-200/20
                    to-transparent
                  "
                />

                {/* LETTER CONTENT */}

                <div
                  className="
                    mt-10
                    space-y-5
                  "
                >
                  {activeLetter.lines.map(
                    (line, index) => (
                      <AnimatePresence
                        key={`${activeLetter.id}-${index}`}
                      >
                        {index <
                          visibleLines && (
                          <motion.p
                            initial={{
                              opacity: 0,
                              y: 12,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              duration: 0.55,
                            }}
                            className={`
                              ${
                                index === 0
                                  ? "text-xl text-white sm:text-2xl"
                                  : "text-base text-white/50"
                              }
                              ${
                                index ===
                                activeLetter.lines
                                  .length -
                                  1
                                  ? "text-rose-100/80"
                                  : ""
                              }
                              font-extralight
                              leading-8
                            `}
                          >
                            {line}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    )
                  )}
                </div>

                {/* END */}

                {visibleLines ===
                  activeLetter.lines.length && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.6,
                    }}
                    className="
                      mt-12
                      border-t
                      border-white/10
                      pt-8
                      text-center
                    "
                  >
                    <Heart
                      size={17}
                      fill="currentColor"
                      className="
                        mx-auto
                        text-rose-200/60
                      "
                    />

                    <div
                      className="
                        mt-4
                        text-[8px]
                        uppercase
                        tracking-[0.35em]
                        text-white/20
                      "
                    >
                      With love
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}