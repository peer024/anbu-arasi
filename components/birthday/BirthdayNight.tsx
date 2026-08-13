"use client";

import { motion } from "framer-motion";
import { Moon, Sparkles, Star } from "lucide-react";

const stars = Array.from(
  { length: 45 },
  (_, index) => ({
    id: index,
    left: `${(index * 37) % 100}%`,
    top: `${(index * 61) % 100}%`,
    size: 5 + (index % 3) * 3,
    delay: (index % 10) * 0.25,
    duration: 2.5 + (index % 4),
  })
);

const particles = Array.from(
  { length: 18 },
  (_, index) => ({
    id: index,
    left: `${(index * 53) % 100}%`,
    delay: (index % 8) * 0.4,
    duration: 7 + (index % 5),
  })
);

export function BirthdayNight() {
  return (
    <div
      className="
        pointer-events-none
        fixed
        inset-0
        z-0
        overflow-hidden
      "
      aria-hidden="true"
    >
      {/* ================================================
          DEEP NIGHT GLOW
      ================================================= */}

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.08, 0.16, 0.08],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-1/2
          top-[18%]
          h-[520px]
          w-[520px]
          -translate-x-1/2
          rounded-full
          bg-indigo-500/[0.08]
          blur-[150px]
        "
      />

      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.05, 0.12, 0.05],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          bottom-[-120px]
          left-1/2
          h-[480px]
          w-[480px]
          -translate-x-1/2
          rounded-full
          bg-rose-500/[0.07]
          blur-[140px]
        "
      />

      {/* ================================================
          MOON
      ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.5,
        }}
        className="
          absolute
          right-[8%]
          top-[10%]
          sm:right-[12%]
          sm:top-[12%]
        "
      >
        {/* OUTER GLOW */}

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.12, 0.25, 0.12],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-1/2
            top-1/2
            h-32
            w-32
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        {/* MOON */}

        <div
          className="
            relative
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-white/[0.045]
            shadow-2xl
            shadow-white/[0.04]
            backdrop-blur-sm
            sm:h-20
            sm:w-20
          "
        >
          <Moon
            size={34}
            strokeWidth={1}
            className="
              rotate-[-20deg]
              text-white/35
            "
          />
        </div>
      </motion.div>

      {/* ================================================
          STARS
      ================================================= */}

      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.span
            key={star.id}
            className="
              absolute
              rounded-full
              bg-white
            "
            style={{
              left: star.left,
              top: star.top,
              width: star.size / 2,
              height: star.size / 2,
            }}
            animate={{
              opacity: [
                0.08,
                0.65,
                0.12,
              ],
              scale: [
                0.7,
                1.2,
                0.7,
              ],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ================================================
          FLOATING PARTICLES
      ================================================= */}

      <div className="absolute inset-0">
        {particles.map(
          (particle) => (
            <motion.div
              key={particle.id}
              className="
                absolute
                bottom-[-20px]
                text-white/10
              "
              style={{
                left: particle.left,
              }}
              animate={{
                y: [
                  0,
                  "-35vh",
                  "-70vh",
                ],
                x: [
                  0,
                  particle.id % 2
                    ? 18
                    : -18,
                  particle.id % 2
                    ? -10
                    : 10,
                ],
                opacity: [
                  0,
                  0.45,
                  0,
                ],
                rotate: [
                  0,
                  90,
                  180,
                ],
              }}
              transition={{
                duration:
                  particle.duration,
                delay:
                  particle.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
            >
              <Sparkles size={8} />
            </motion.div>
          )
        )}
      </div>

      {/* ================================================
          SMALL STARS / DECOR
      ================================================= */}

      <motion.div
        animate={{
          rotate: [0, 180, 360],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          left-[10%]
          top-[25%]
          text-white/20
        "
      >
        <Star
          size={22}
          strokeWidth={1}
        />
      </motion.div>

      <motion.div
        animate={{
          rotate: [360, 180, 0],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          bottom-[18%]
          right-[12%]
          text-rose-100/20
        "
      >
        <Star
          size={18}
          strokeWidth={1}
        />
      </motion.div>

      {/* ================================================
          TOP FADE
      ================================================= */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-48
          bg-gradient-to-b
          from-[#020204]
          to-transparent
        "
      />

      {/* ================================================
          BOTTOM FADE
      ================================================= */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-48
          bg-gradient-to-t
          from-[#020204]
          to-transparent
        "
      />
    </div>
  );
}