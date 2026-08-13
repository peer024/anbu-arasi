"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
  Star,
} from "lucide-react";

const SPECIAL_POINTS = [
  {
    number: "01",
    title: "Your smile",
    text: "There is something about your smile that can make an ordinary moment feel a little different.",
  },
  {
    number: "02",
    title: "The way you talk",
    text: "Even simple conversations with you somehow become memories that stay a little longer.",
  },
  {
    number: "03",
    title: "The little things",
    text: "Sometimes it is not the big things. It is the tiny little moments that quietly become special.",
  },
  {
    number: "04",
    title: "The way you make me feel",
    text: "Some people simply make life feel a little happier. Somehow, you are one of those people.",
  },
];

export function WhySpecial() {
  return (
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
      {/* =================================================
          BACKGROUND GLOW
      ================================================= */}

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.12, 0.24, 0.12],
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
          h-[550px]
          w-[550px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-rose-500/[0.08]
          blur-[150px]
        "
      />

      {/* =================================================
          HEADER
      ================================================= */}

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

          A few things

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
            amount: 0.3,
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
          Why you&apos;re
          <span className="text-white/30">
            {" "}
            special.
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
            max-w-lg
            text-sm
            leading-7
            text-white/30
          "
        >
          I could probably write a hundred
          reasons. But these little things
          are enough to start.
        </motion.p>
      </div>

      {/* =================================================
          CARDS
      ================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          mt-20
          grid
          max-w-5xl
          gap-5
          sm:mt-24
          md:grid-cols-2
        "
      >
        {SPECIAL_POINTS.map(
          (item, index) => (
            <motion.div
              key={item.number}
              initial={{
                opacity: 0,
                y: 35,
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
                delay: index * 0.12,
              }}
              whileHover={{
                y: -5,
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
                backdrop-blur-xl
                transition
                duration-500
                hover:border-rose-200/10
                hover:bg-white/[0.05]
                sm:p-9
              "
            >
              {/* CARD GLOW */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  h-40
                  w-40
                  rounded-full
                  bg-rose-400/[0.04]
                  blur-3xl
                  transition
                  duration-700
                  group-hover:bg-rose-400/[0.08]
                "
              />

              {/* NUMBER */}

              <div
                className="
                  relative
                  flex
                  items-center
                  justify-between
                "
              >
                <span
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.35em]
                    text-rose-200/35
                  "
                >
                  {item.number}
                </span>

                <Star
                  size={15}
                  strokeWidth={1}
                  className="
                    text-white/15
                    transition
                    duration-500
                    group-hover:rotate-45
                    group-hover:text-rose-200/40
                  "
                />
              </div>

              {/* TITLE */}

              <h3
                className="
                  relative
                  mt-10
                  text-2xl
                  font-extralight
                  tracking-tight
                  text-white/80
                  sm:text-3xl
                "
              >
                {item.title}
              </h3>

              {/* DIVIDER */}

              <div
                className="
                  relative
                  mt-5
                  h-px
                  w-12
                  bg-gradient-to-r
                  from-rose-200/30
                  to-transparent
                  transition-all
                  duration-500
                  group-hover:w-20
                "
              />

              {/* TEXT */}

              <p
                className="
                  relative
                  mt-5
                  text-sm
                  font-extralight
                  leading-7
                  text-white/35
                "
              >
                {item.text}
              </p>
            </motion.div>
          )
        )}
      </div>

      {/* =================================================
          FINAL CARD
      ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
          scale: 0.97,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.25,
        }}
        transition={{
          duration: 1,
          delay: 0.2,
        }}
        className="
          relative
          z-10
          mx-auto
          mt-6
          max-w-5xl
          overflow-hidden
          rounded-[32px]
          border
          border-rose-200/10
          bg-gradient-to-br
          from-rose-200/[0.07]
          via-white/[0.025]
          to-transparent
          p-8
          text-center
          shadow-2xl
          shadow-rose-500/[0.04]
          sm:p-14
        "
      >
        {/* DECORATION */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-48
            w-48
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-rose-400/[0.06]
            blur-[80px]
          "
        />

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            relative
            mx-auto
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            border
            border-rose-200/10
            bg-rose-200/[0.05]
            text-rose-200/70
          "
        >
          <Heart
            size={24}
            fill="currentColor"
          />
        </motion.div>

        <div
          className="
            relative
            mt-8
            text-[9px]
            uppercase
            tracking-[0.4em]
            text-rose-200/35
          "
        >
          And then there is this
        </div>

        <h3
          className="
            relative
            mt-5
            text-3xl
            font-extralight
            tracking-[-0.03em]
            sm:text-5xl
          "
        >
          Simply...
          <span
            className="
              block
              bg-gradient-to-r
              from-white
              via-rose-100
              to-white/30
              bg-clip-text
              text-transparent
            "
          >
            You. ❤️
          </span>
        </h3>

        <p
          className="
            relative
            mx-auto
            mt-6
            max-w-xl
            text-sm
            font-extralight
            leading-7
            text-white/35
          "
        >
          I don&apos;t really need a reason
          to explain why you are special.
          Somehow, you just are.
        </p>
      </motion.div>

      {/* =================================================
          BOTTOM HEART
      ================================================= */}

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
          mt-20
          flex
          items-center
          justify-center
          gap-3
          text-[8px]
          uppercase
          tracking-[0.4em]
          text-white/20
        "
      >
        <Heart
          size={11}
          fill="currentColor"
        />

        Some things are better felt
        than explained.

        <Heart
          size={11}
          fill="currentColor"
        />
      </motion.div>
    </section>
  );
}