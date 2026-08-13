"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Sparkles,
  Heart,
  X,
} from "lucide-react";

export function SecretGift() {
  const [opened, setOpened] =
    useState(false);

  const [showMessage, setShowMessage] =
    useState(false);

  return (
    <section
      className="
        relative
        flex
        min-h-[80vh]
        items-center
        justify-center
        overflow-hidden
        px-5
        py-28
      "
    >
      {/* ===============================================
          BACKGROUND GLOW
      ================================================ */}

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-80
          w-80
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-rose-500/10
          blur-[120px]
        "
      />

      {/* ===============================================
          CONTENT
      ================================================ */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-2xl
          text-center
        "
      >
        {/* SMALL LABEL */}

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

          One more little surprise

          <Sparkles size={12} />
        </motion.div>

        {/* TITLE */}

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
            text-3xl
            font-extralight
            tracking-tight
            sm:text-5xl
          "
        >
          I kept something
          <span className="text-white/35">
            {" "}
            for you.
          </span>
        </motion.h2>

        {/* ===========================================
            GIFT
        ============================================ */}

        <div
          className="
            relative
            mx-auto
            mt-14
            h-72
            w-72
          "
        >
          {/* GLOW */}

          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [
                0.1,
                0.25,
                0.1,
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="
              absolute
              left-1/2
              top-1/2
              h-48
              w-48
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-rose-400/20
              blur-3xl
            "
          />

          {/* GIFT */}

          <motion.button
            type="button"
            onClick={() => {
              setOpened(true);

              window.setTimeout(() => {
                setShowMessage(true);
              }, 900);
            }}
            disabled={opened}
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            whileHover={
              opened
                ? {}
                : {
                    scale: 1.06,
                    y: -6,
                  }
            }
            whileTap={
              opened
                ? {}
                : {
                    scale: 0.96,
                  }
            }
            animate={
              opened
                ? {
                    scale: [
                      1,
                      1.05,
                      0.9,
                    ],
                    opacity: [
                      1,
                      1,
                      0,
                    ],
                  }
                : {
                    y: [0, -7, 0],
                  }
            }
            transition={
              opened
                ? {
                    duration: 0.9,
                  }
                : {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            className="
              absolute
              left-1/2
              top-1/2
              flex
              h-40
              w-40
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-[30px]
              border
              border-rose-200/10
              bg-white/[0.045]
              text-rose-200/80
              shadow-2xl
              shadow-rose-500/10
              backdrop-blur-xl
            "
          >
            <Gift
              size={62}
              strokeWidth={1}
            />
          </motion.button>

          {/* SPARKLES */}

          {!opened &&
            Array.from({
              length: 8,
            }).map((_, index) => (
              <motion.div
                key={index}
                className="
                  absolute
                  text-rose-200/50
                "
                style={{
                  left: `${
                    10 +
                    (index * 37) %
                      80
                  }%`,
                  top: `${
                    5 +
                    (index * 53) %
                      85
                  }%`,
                }}
                animate={{
                  opacity: [
                    0,
                    1,
                    0,
                  ],
                  scale: [
                    0.5,
                    1,
                    0.5,
                  ],
                }}
                transition={{
                  duration:
                    2 +
                    (index % 3),
                  delay:
                    index * 0.2,
                  repeat: Infinity,
                }}
              >
                <Sparkles
                  size={
                    10 +
                    (index % 3) * 4
                  }
                />
              </motion.div>
            ))}
        </div>

        {/* HINT */}

        {!opened && (
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
              mt-3
              text-[9px]
              uppercase
              tracking-[0.35em]
              text-white/25
            "
          >
            Tap the gift
          </motion.div>
        )}
      </div>

      {/* ===============================================
          SECRET MESSAGE
      ================================================ */}

      <AnimatePresence>
        {showMessage && (
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
              z-[100]
              flex
              items-center
              justify-center
              overflow-y-auto
              bg-[#050205]/95
              px-5
              py-10
              backdrop-blur-xl
            "
          >
            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setShowMessage(false)
              }
              className="
                fixed
                right-5
                top-5
                z-[110]
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
              "
            >
              <X size={17} />
            </button>

            {/* PARTICLES */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
              "
            >
              {Array.from({
                length: 30,
              }).map((_, index) => (
                <motion.div
                  key={index}
                  className="
                    absolute
                    text-rose-200/40
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
                    y: [
                      0,
                      -25,
                      0,
                    ],
                    opacity: [
                      0.1,
                      0.7,
                      0.1,
                    ],
                  }}
                  transition={{
                    duration:
                      2.5 +
                      (index % 3),
                    delay:
                      index * 0.05,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles
                    size={10}
                  />
                </motion.div>
              ))}
            </div>

            {/* MESSAGE CARD */}

            <motion.div
              initial={{
                opacity: 0,
                y: 40,
                scale: 0.94,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.8,
                type: "spring",
              }}
              className="
                relative
                z-10
                w-full
                max-w-xl
                rounded-[32px]
                border
                border-white/10
                bg-white/[0.04]
                p-8
                text-center
                shadow-2xl
                shadow-rose-500/10
                sm:p-12
              "
            >
              <motion.div
                initial={{
                  scale: 0,
                }}
                animate={{
                  scale: 1,
                }}
                transition={{
                  delay: 0.35,
                  type: "spring",
                }}
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-rose-200/[0.07]
                  text-rose-200
                "
              >
                <Heart
                  size={25}
                  fill="currentColor"
                />
              </motion.div>

              <div
                className="
                  mt-8
                  text-[9px]
                  uppercase
                  tracking-[0.45em]
                  text-rose-200/40
                "
              >
                Secretly kept for you
              </div>

              <motion.h3
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.55,
                }}
                className="
                  mt-5
                  text-3xl
                  font-extralight
                  sm:text-4xl
                "
              >
                You found it. ❤️
              </motion.h3>

              <motion.p
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.8,
                }}
                className="
                  mt-7
                  text-base
                  font-extralight
                  leading-8
                  text-white/50
                "
              >
                Some surprises are not
                meant to be explained.
                They are simply meant
                to make someone smile.
              </motion.p>

              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 1.3,
                }}
                className="
                  mt-8
                  text-lg
                  font-light
                  text-rose-100/70
                "
              >
                And this one was
                made especially for you. 💖
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}