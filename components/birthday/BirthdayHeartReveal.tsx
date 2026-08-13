"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const BIRTHDAY_NAME = "Anbu Arasi";

/*
  Birthday:
  March 3

  The check is done using India time
  so the animation starts according to
  the birthday's intended timezone.
*/

const BIRTHDAY_MONTH = 3;
const BIRTHDAY_DAY = 3;

/*
  Temporary testing switch.

  false = real birthday only
  true  = show animation immediately

  Keep this FALSE for the final website.
*/
const FORCE_PREVIEW = false;

type Particle = {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  delay: number;
  size: number;
};

/*
  Heart mathematical points.
  These points create the heart outline
  that the sparkles slowly build.
*/
function createHeartPoints(
  count: number
): Particle[] {
  return Array.from(
    { length: count },
    (_, index) => {
      const t =
        (Math.PI * 2 * index) /
        count;

      const x =
        16 *
        Math.pow(Math.sin(t), 3);

      const y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);

      /*
        Convert mathematical coordinates
        into percentage coordinates.
      */

      const targetX =
        50 + x * 1.8;

      const targetY =
        49 - y * 1.8;

      /*
        Random starting position around
        the entire screen.
      */

      const startX =
        Math.random() * 100;

      const startY =
        Math.random() * 100;

      return {
        id: index,
        startX,
        startY,
        targetX,
        targetY,
        delay:
          (index / count) * 1.8 +
          Math.random() * 0.7,
        size:
          2 +
          Math.random() * 3,
      };
    }
  );
}

function isBirthdayToday() {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: "Asia/Kolkata",
        month: "numeric",
        day: "numeric",
      }
    );

  const parts =
    formatter.formatToParts(
      new Date()
    );

  const month = Number(
    parts.find(
      (part) =>
        part.type === "month"
    )?.value
  );

  const day = Number(
    parts.find(
      (part) =>
        part.type === "day"
    )?.value
  );

  return (
    month === BIRTHDAY_MONTH &&
    day === BIRTHDAY_DAY
  );
}

export function BirthdayHeartReveal() {
  const [visible, setVisible] =
  useState(false);

const [complete, setComplete] =
  useState(false);

const [exiting, setExiting] =
  useState(false);

  const particles = useMemo(
    () =>
      createHeartPoints(72),
    []
  );

  useEffect(() => {
  if (
    FORCE_PREVIEW ||
    isBirthdayToday()
  ) {
    setVisible(true);

    // Heart completes
    const completeTimer =
      window.setTimeout(() => {
        setComplete(true);
      }, 4800);

    // Start leaving after the name
    // has been visible for a while
    const exitTimer =
      window.setTimeout(() => {
        setExiting(true);
      }, 7800);

    // Completely remove the overlay
    const hideTimer =
      window.setTimeout(() => {
        setVisible(false);
      }, 9000);

    return () => {
      window.clearTimeout(
        completeTimer
      );

      window.clearTimeout(
        exitTimer
      );

      window.clearTimeout(
        hideTimer
      );
    };
  }
}, []);

  if (!visible) {
    return null;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1.2,
      }}
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        overflow-hidden
        bg-[#020204]/95
        backdrop-blur-md
      "
    >
      {/* =================================================
          SOFT BACKGROUND GLOW
      ================================================= */}

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [
            0.05,
            0.14,
            0.05,
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[420px]
          w-[420px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-rose-400/10
          blur-[120px]
        "
      />

      {/* =================================================
          PARTICLE FIELD
      ================================================= */}

      <div className="absolute inset-0">
        {particles.map(
          (particle) => (
            <motion.span
              key={particle.id}
              className="
                absolute
                rounded-full
                bg-rose-100
                shadow-[0_0_12px_rgba(251,207,232,0.7)]
              "
              style={{
                width: particle.size,
                height: particle.size,
              }}
              initial={{
                left: `${particle.startX}%`,
                top: `${particle.startY}%`,
                opacity: 0,
                scale: 0.2,
              }}
              animate={{
                left: `${particle.targetX}%`,
                top: `${particle.targetY}%`,
                opacity: [
                  0,
                  0.45,
                  1,
                  0.9,
                ],
                scale: [
                  0.2,
                  0.8,
                  1.25,
                  1,
                ],
              }}
              transition={{
                duration: 3.8,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          )
        )}
      </div>

      {/* =================================================
          EXTRA FLOATING SPARKLES
      ================================================= */}

      <motion.div
        animate={{
          opacity: [
            0,
            0.6,
            0,
          ],
          scale: [
            0.5,
            1,
            0.5,
          ],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          delay: 0.4,
        }}
        className="
          absolute
          left-[22%]
          top-[25%]
          text-sm
          text-white/60
        "
      >
        ✦
      </motion.div>

      <motion.div
        animate={{
          opacity: [
            0,
            0.7,
            0,
          ],
          scale: [
            0.5,
            1.2,
            0.5,
          ],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          delay: 1.2,
        }}
        className="
          absolute
          right-[20%]
          top-[30%]
          text-lg
          text-rose-100/60
        "
      >
        ✧
      </motion.div>

      <motion.div
        animate={{
          opacity: [
            0,
            0.5,
            0,
          ],
          scale: [
            0.5,
            1,
            0.5,
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 0.8,
        }}
        className="
          absolute
          bottom-[28%]
          left-[20%]
          text-xs
          text-white/50
        "
      >
        ✦
      </motion.div>

      {/* =================================================
          HEART COMPLETION
      ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.7,
        }}
        animate={
          complete
            ? {
                opacity: 1,
                scale: 1,
              }
            : {
                opacity: 0,
                scale: 0.7,
              }
        }
        transition={{
          duration: 1.4,
          ease: "easeOut",
        }}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          flex
          -translate-x-1/2
          -translate-y-1/2
          items-center
          justify-center
        "
      >
        {/* Heart glow */}

        <motion.div
          animate={{
            scale: [
              1,
              1.12,
              1,
            ],
            opacity: [
              0.15,
              0.3,
              0.15,
            ],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            h-[190px]
            w-[190px]
            rounded-full
            bg-rose-400/20
            blur-[65px]
            sm:h-[260px]
            sm:w-[260px]
          "
        />

        {/* Heart */}

        <motion.div
          animate={
            complete
              ? {
                  scale: [
                    1,
                    1.05,
                    1,
                  ],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            relative
            flex
            h-[150px]
            w-[150px]
            items-center
            justify-center
            sm:h-[210px]
            sm:w-[210px]
          "
        >
          <svg
            viewBox="0 0 200 200"
            className="
              absolute
              inset-0
              h-full
              w-full
              overflow-visible
            "
          >
            <path
              d="
                M100 165
                C88 154 35 123 35 76
                C35 50 53 34 76 34
                C88 34 98 40 100 52
                C102 40 112 34 124 34
                C147 34 165 50 165 76
                C165 123 112 154 100 165
                Z
              "
              fill="rgba(244,114,182,0.06)"
              stroke="rgba(251,207,232,0.65)"
              strokeWidth="1.4"
            />
          </svg>

          {/* =================================================
              NAME
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 10,
              scale: 0.8,
            }}
            animate={
              complete
                ? {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }
                : {
                    opacity: 0,
                    y: 10,
                    scale: 0.8,
                  }
            }
            transition={{
              duration: 1.1,
              delay: 0.5,
              ease: "easeOut",
            }}
            className="
              relative
              z-10
              text-center
            "
          >
            <div
              className="
                text-[8px]
                uppercase
                tracking-[0.45em]
                text-white/35
              "
            >
              Happy Birthday
            </div>

            <div
              className="
                mt-2
                text-2xl
                font-extralight
                tracking-[0.08em]
                text-white
                drop-shadow-[0_0_15px_rgba(251,207,232,0.45)]
                sm:text-3xl
              "
            >
              {BIRTHDAY_NAME}
            </div>

            <motion.div
              animate={{
                opacity: [
                  0.25,
                  0.65,
                  0.25,
                ],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
              }}
              className="
                mx-auto
                mt-3
                text-[8px]
                uppercase
                tracking-[0.5em]
                text-rose-200/50
              "
            >
              With love
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* =================================================
          FINAL SMALL SPARKLES
      ================================================= */}

      {complete && (
        <>
          <motion.span
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [
                0,
                1,
                0,
              ],
              scale: [
                0,
                1.4,
                0.6,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.2,
            }}
            className="
              absolute
              left-[calc(50%-125px)]
              top-[calc(50%-95px)]
              text-lg
              text-rose-100
            "
          >
            ✦
          </motion.span>

          <motion.span
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [
                0,
                1,
                0,
              ],
              scale: [
                0,
                1.3,
                0.5,
              ],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              delay: 0.7,
            }}
            className="
              absolute
              left-[calc(50%+105px)]
              top-[calc(50%-75px)]
              text-sm
              text-white/80
            "
          >
            ✧
          </motion.span>
        </>
      )}
    </motion.div>
  );
}