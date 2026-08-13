"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cake,
  Sparkles,
  Heart,
  Wind,
} from "lucide-react";

export function BirthdayCake() {
  const [wished, setWished] =
    useState(false);

  const [showMessage, setShowMessage] =
    useState(false);

  const [showHeartReveal, setShowHeartReveal] =
    useState(false);

  const makeWish = () => {
    if (wished) return;

    setWished(true);
    setShowHeartReveal(true);

    window.setTimeout(() => {
      // The heart overlay must close after the name reveal.
      // Previously it stayed mounted forever, blocking the
      // birthday cake and the Next button underneath.
      setShowHeartReveal(false);
      setShowMessage(true);
    }, 4200);
  };

  const heartParticles = Array.from(
    { length: 72 },
    (_, index) => {
      const t =
        (2 * Math.PI * index) / 72;

      const x =
        16 * Math.pow(Math.sin(t), 3);

      const y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);

      return {
        x: x * 9,
        y: -y * 9,
      };
    }
  );

  return (
    <section
  className="
        relative
        flex
        min-h-[85vh]
        items-center
        justify-center
        overflow-hidden
        px-5
        py-32
      "
    >
      {/* =================================================
          BACKGROUND GLOW
      ================================================= */}

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.24, 0.1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[450px]
          w-[450px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-rose-500/10
          blur-[140px]
        "
      />

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-3xl
          text-center
        "
      >
        {/* LABEL */}

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

          One little wish

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
            text-4xl
            font-extralight
            tracking-[-0.04em]
            sm:text-6xl
          "
        >
          Make a wish.
          <span className="text-white/30">
            {" "}
            ✨
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
            delay: 0.35,
          }}
          className="
            mx-auto
            mt-6
            max-w-md
            text-sm
            leading-7
            text-white/30
          "
        >
          Close your eyes for a moment.
          <br />
          Think of something you really
          wish for.
        </motion.p>

        {/* =================================================
            CAKE
        ================================================= */}

        <div
          className="
            relative
            mx-auto
            mt-16
            h-[310px]
            w-[300px]
          "
        >
          {/* CAKE GLOW */}

          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [
                0.08,
                0.18,
                0.08,
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="
              absolute
              bottom-5
              left-1/2
              h-40
              w-56
              -translate-x-1/2
              rounded-full
              bg-rose-400/20
              blur-3xl
            "
          />

          {/* =================================================
              CAKE BODY
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.9,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.9,
              type: "spring",
            }}
            className="
              absolute
              bottom-10
              left-1/2
              h-32
              w-56
              -translate-x-1/2
            "
          >
            {/* TOP */}

            <div
              className="
                absolute
                left-1/2
                top-0
                h-12
                w-56
                -translate-x-1/2
                rounded-[50%]
                border
                border-rose-100/10
                bg-gradient-to-b
                from-rose-200/[0.15]
                to-rose-300/[0.04]
              "
            />

            {/* BODY */}

            <div
              className="
                absolute
                left-1/2
                top-5
                h-28
                w-56
                -translate-x-1/2
                rounded-b-[28px]
                border
                border-t-0
                border-white/10
                bg-gradient-to-b
                from-white/[0.07]
                to-white/[0.025]
              "
            />

            {/* CREAM */}

            <div
              className="
                absolute
                left-1/2
                top-4
                h-5
                w-56
                -translate-x-1/2
                rounded-[50%]
                bg-rose-100/[0.08]
              "
            />

            {/* SMALL DECORATIONS */}

            <div
              className="
                absolute
                left-10
                top-12
                h-2
                w-2
                rounded-full
                bg-rose-200/30
              "
            />

            <div
              className="
                absolute
                right-10
                top-16
                h-2
                w-2
                rounded-full
                bg-rose-200/30
              "
            />

            <div
              className="
                absolute
                left-1/2
                top-16
                h-2
                w-2
                -translate-x-1/2
                rounded-full
                bg-white/20
              "
            />
          </motion.div>

          {/* =================================================
              CANDLES
          ================================================= */}

          <div
            className="
              absolute
              bottom-[142px]
              left-1/2
              flex
              -translate-x-1/2
              gap-7
            "
          >
            {[0, 1, 2].map(
              (index) => (
                <div
                  key={index}
                  className="
                    relative
                    h-14
                    w-3
                    rounded-full
                    bg-gradient-to-b
                    from-white/30
                    to-rose-200/10
                  "
                >
                  {/* FLAME */}

                  <AnimatePresence>
                    {!wished && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0.5,
                        }}
                        animate={{
                          opacity: 1,
                          scale: [
                            1,
                            1.15,
                            0.9,
                            1,
                          ],
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0,
                          y: -20,
                        }}
                        transition={{
                          duration: 0.5,
                          delay:
                            index * 0.1,
                        }}
                        className="
                          absolute
                          -left-1
                          -top-7
                          h-6
                          w-5
                          rounded-full
                          bg-gradient-to-t
                          from-amber-300/70
                          via-orange-200/60
                          to-transparent
                          blur-[2px]
                        "
                      />
                    )}
                  </AnimatePresence>

                  {/* FLAME CORE */}

                  <AnimatePresence>
                    {!wished && (
                      <motion.div
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: [
                            0.6,
                            1,
                            0.7,
                            1,
                          ],
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                        }}
                        className="
                          absolute
                          left-1/2
                          top-[-22px]
                          h-3
                          w-2
                          -translate-x-1/2
                          rounded-full
                          bg-yellow-100/80
                          blur-[1px]
                        "
                      />
                    )}
                  </AnimatePresence>
                </div>
              )
            )}
          </div>

          {/* =================================================
              CAKE ICON
          ================================================= */}

          <motion.div
            animate={
              wished
                ? {
                    scale: 0.95,
                    opacity: 0.6,
                  }
                : {
                    y: [0, -3, 0],
                  }
            }
            transition={
              wished
                ? {
                    duration: 0.5,
                  }
                : {
                    duration: 2.5,
                    repeat: Infinity,
                  }
            }
            className="
              absolute
              bottom-[-3px]
              left-1/2
              -translate-x-1/2
              text-rose-200/20
            "
          >
            <Cake size={28} />
          </motion.div>

          {/* =================================================
              FLOATING SPARKLES
          ================================================= */}

          {!wished &&
            Array.from({
              length: 10,
            }).map((_, index) => (
              <motion.div
                key={index}
                className="
                  absolute
                  text-rose-200/40
                "
                style={{
                  left: `${
                    5 +
                    (index * 41) %
                      90
                  }%`,
                  top: `${
                    5 +
                    (index * 31) %
                      80
                  }%`,
                }}
                animate={{
                  opacity: [
                    0,
                    0.8,
                    0,
                  ],
                  scale: [
                    0.5,
                    1,
                    0.5,
                  ],
                  y: [
                    0,
                    -12,
                    0,
                  ],
                }}
                transition={{
                  duration:
                    2 +
                    (index % 3),
                  delay:
                    index * 0.15,
                  repeat: Infinity,
                }}
              >
                <Sparkles
                  size={
                    9 +
                    (index % 3) * 3
                  }
                />
              </motion.div>
            ))}
        </div>

        {/* =================================================
            BUTTON
        ================================================= */}

        <AnimatePresence mode="wait">
          {!wished ? (
            <motion.button
              key="wish-button"
              type="button"
              onClick={makeWish}
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
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.96,
              }}
              className="
                mx-auto
                flex
                items-center
                gap-3
                rounded-full
                border
                border-white/10
                bg-white
                px-7
                py-3.5
                text-sm
                font-medium
                text-black
                shadow-2xl
              "
            >
              <Wind size={16} />

              Make a Wish
            </motion.button>
          ) : (
            <motion.div
              key="wished"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                flex
                items-center
                justify-center
                gap-2
                text-sm
                font-light
                text-rose-100/60
              "
            >
              <Sparkles size={15} />

              Wish made. ✨

              <Sparkles size={15} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =================================================
          SPARKLES → HEART → NAME
      ================================================= */}

      <AnimatePresence>
        {showHeartReveal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed inset-0 z-[90]
              flex items-center justify-center
              overflow-hidden bg-[#050205]/96
              px-5 backdrop-blur-xl
            "
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: [0.3, 1.08, 1], opacity: [0, 0.32, 0.16] }}
              transition={{ duration: 3.8, ease: "easeOut" }}
              className="pointer-events-none absolute h-[460px] w-[460px] rounded-full bg-rose-500/20 blur-[120px]"
            />

            <div className="relative h-[430px] w-[430px]">
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
                    scale: [0.2, 1, 0.65],
                  }}
                  transition={{
                    duration: 3.15,
                    delay: index * 0.014,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    absolute left-1/2 top-1/2
                    -ml-[3px] -mt-[3px]
                    h-[6px] w-[6px] rounded-full
                    bg-rose-100
                    shadow-[0_0_14px_rgba(251,113,133,0.95)]
                  "
                />
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: [0, 0, 0.8, 0.35], scale: [0.7, 0.92, 1.04, 1] }}
                transition={{ duration: 3.8, times: [0, 0.72, 0.9, 1], ease: "easeOut" }}
                className="
                  pointer-events-none absolute left-1/2 top-1/2
                  h-[260px] w-[300px]
                  -translate-x-1/2 -translate-y-1/2
                  rounded-[50%] border-2 border-rose-200/20
                  shadow-[0_0_70px_rgba(251,113,133,0.3)]
                "
              />

              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 3.15,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 130,
                  damping: 14,
                }}
                className="absolute inset-0 flex items-center justify-center text-center"
              >
                <div>
                  <div className="text-[9px] uppercase tracking-[0.55em] text-rose-100/45">
                    Happy Birthday
                  </div>
                  <div className="mt-3 text-4xl font-extralight tracking-[-0.04em] text-white drop-shadow-[0_0_25px_rgba(251,113,133,0.45)] sm:text-6xl">
                    Anbu Arasi
                  </div>
                  <div className="mt-2 text-sm text-rose-100/60">❤️</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================================================
          WISH MESSAGE
      ================================================= */}

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
              bg-[#050205]/95
              px-5
              backdrop-blur-xl
            "
          >
            {/* PARTICLES */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
              "
            >
              {Array.from({
                length: 45,
              }).map((_, index) => (
                <motion.div
                  key={index}
                  className="
                    absolute
                    text-rose-200/40
                  "
                  style={{
                    left: `${
                      (index * 29) %
                      100
                    }%`,
                    top: `${
                      (index * 53) %
                      100
                    }%`,
                  }}
                  animate={{
                    y: [
                      0,
                      -35,
                      0,
                    ],
                    opacity: [
                      0.1,
                      0.8,
                      0.1,
                    ],
                    scale: [
                      0.6,
                      1.2,
                      0.6,
                    ],
                  }}
                  transition={{
                    duration:
                      2 +
                      (index % 4),
                    delay:
                      index * 0.04,
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

            {/* MESSAGE */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 25,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
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
                  delay: 0.3,
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
                  bg-rose-200/[0.06]
                  text-rose-200/80
                "
              >
                <Heart
                  size={26}
                  fill="currentColor"
                />
              </motion.div>

              <div
                className="
                  mt-8
                  text-[9px]
                  uppercase
                  tracking-[0.45em]
                  text-rose-200/35
                "
              >
                Your wish
              </div>

              <h3
                className="
                  mt-5
                  text-3xl
                  font-extralight
                  tracking-tight
                  sm:text-4xl
                "
              >
                I hope it comes true. ✨
              </h3>

              <p
                className="
                  mx-auto
                  mt-7
                  max-w-md
                  text-sm
                  font-extralight
                  leading-8
                  text-white/40
                "
              >
                Whatever you wished for,
                I hope life finds a way
                to bring it closer to you.
              </p>

              <p
                className="
                  mt-8
                  text-base
                  font-light
                  text-rose-100/60
                "
              >
                You deserve beautiful
                things, Mah. ❤️
              </p>

              <motion.button
                type="button"
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 1.2,
                  duration: 0.6,
                }}
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                onClick={() => {
                  setShowMessage(false);

                  window.setTimeout(() => {
                    const nextSection =
                      document.querySelector(
                        '[data-section="secret-letters"]'
                      );

                    nextSection?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 350);
                }}
                className="
                  mx-auto
                  mt-10
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  border
                  border-white/10
                  bg-white
                  px-7
                  py-3.5
                  text-sm
                  font-medium
                  text-black
                  transition
                  hover:bg-rose-50
                "
              >
                Continue
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