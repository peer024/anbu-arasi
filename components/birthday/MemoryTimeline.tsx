"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
} from "lucide-react";

/*
  =========================================================
  PHOTO SYSTEM
  =========================================================

  60 photos are available.

  After photo-60.png,
  the same 60 photos automatically repeat.
*/

const PHOTO_COUNT = 60;

const MEMORY_PHOTOS = Array.from(
  { length: PHOTO_COUNT },
  (_, index) =>
    `/photos/photo-${String(index + 1).padStart(
      2,
      "0"
    )}.png`
);

/*
  =========================================================
  TIMELINE CONTENT
  =========================================================
*/

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

/*
  =========================================================
  COMPONENT
  =========================================================
*/

export function MemoryTimeline() {
  return (
    <section
      className="
        relative
        overflow-hidden
        px-5
        py-28
        sm:px-8
        sm:py-36
      "
    >
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
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
          bg-rose-500/[0.045]
          blur-[130px]
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

          Little moments

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
            text-3xl
            font-extralight
            tracking-tight
            sm:text-5xl
          "
        >
          A little journey
          <span className="text-white/30">
            {" "}
            through time.
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
            mt-5
            max-w-lg
            text-sm
            leading-7
            text-white/30
          "
        >
          Not every day needs a photograph.
          Sometimes a little thought is
          enough to keep a moment alive.
        </motion.p>
      </div>

      {/* =================================================
          TIMELINE
      ================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          mt-20
          max-w-5xl
        "
      >
        {/* CENTER LINE */}

        <div
          className="
            absolute
            bottom-0
            left-4
            top-0
            w-px
            bg-gradient-to-b
            from-transparent
            via-white/10
            to-transparent
            md:left-1/2
            md:-translate-x-1/2
          "
        />

        <div className="space-y-20 sm:space-y-28">
          {MEMORY_ITEMS.map(
            (memory, index) => {
              /*
                IMPORTANT:

                We use % here so the 9 timeline
                cards cycle through all 60 photos.

                If later you add more timeline
                cards, the photos still won't
                become blank.
              */

              const photo =
                MEMORY_PHOTOS[
                  index % PHOTO_COUNT
                ];

              const isRight =
                index % 2 === 1;

              return (
                <motion.div
                  key={memory.day}
                  initial={{
                    opacity: 0,
                    y: 40,
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
                    duration: 0.75,
                    delay: 0.05,
                  }}
                  className="
                    relative
                    grid
                    grid-cols-[32px_1fr]
                    gap-5
                    md:grid-cols-2
                    md:gap-16
                  "
                >
                  {/* MOBILE DOT */}

                  <div
                    className="
                      absolute
                      left-[9px]
                      top-7
                      z-20
                      flex
                      h-3
                      w-3
                      items-center
                      justify-center
                      rounded-full
                      bg-rose-200/60
                      shadow-lg
                      shadow-rose-300/20
                      md:hidden
                    "
                  />

                  {/* DESKTOP LEFT */}

                  <div
                    className={`
                      hidden
                      md:block
                      ${
                        isRight
                          ? "md:order-2"
                          : "md:order-1"
                      }
                    `}
                  >
                    <MemoryCard
                      photo={photo}
                      day={memory.day}
                      title={memory.title}
                      text={memory.text}
                      align={
                        isRight
                          ? "left"
                          : "right"
                      }
                    />
                  </div>

                  {/* DESKTOP CENTER DOT */}

                  <div
                    className="
                      absolute
                      left-1/2
                      top-7
                      z-20
                      hidden
                      h-3
                      w-3
                      -translate-x-1/2
                      rounded-full
                      bg-rose-200/70
                      shadow-lg
                      shadow-rose-300/20
                      md:block
                    "
                  />

                  {/* DESKTOP RIGHT */}

                  <div
                    className={`
                      hidden
                      md:block
                      ${
                        isRight
                          ? "md:order-1"
                          : "md:order-2"
                      }
                    `}
                  >
                    <MemoryCard
                      photo={photo}
                      day={memory.day}
                      title={memory.title}
                      text={memory.text}
                      align={
                        isRight
                          ? "right"
                          : "left"
                      }
                    />
                  </div>

                  {/* MOBILE CARD
                      IMPORTANT:
                      The timeline uses a 32px + 1fr grid on mobile
                      for the timeline line. The mobile card must span
                      the full grid; otherwise it gets trapped inside
                      the 32px timeline column.
                  */}

                  <div
                    className="
                      md:hidden
                      col-span-2
                      min-w-0
                      pl-8
                    "
                  >
                    <MemoryCard
                      photo={photo}
                      day={memory.day}
                      title={memory.title}
                      text={memory.text}
                      align="left"
                    />
                  </div>
                </motion.div>
              );
            }
          )}
        </div>
      </div>

      {/* =================================================
          END
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
          delay: 0.3,
        }}
        className="
          relative
          z-10
          mx-auto
          mt-24
          flex
          max-w-md
          items-center
          justify-center
          gap-3
          text-center
          text-[9px]
          uppercase
          tracking-[0.35em]
          text-white/20
        "
      >
        <Heart
          size={12}
          fill="currentColor"
        />

        More memories are still waiting

        <Heart
          size={12}
          fill="currentColor"
        />
      </motion.div>
    </section>
  );
}

/* =========================================================
   MEMORY CARD
========================================================= */

function MemoryCard({
  photo,
  day,
  title,
  text,
  align,
}: {
  photo: string;
  day: string;
  title: string;
  text: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={`
        ${
          align === "right"
            ? "md:text-right"
            : "md:text-left"
        }
      `}
    >
      <div
        className="
          overflow-hidden
          rounded-[28px]
          border
          border-white/10
          bg-white/[0.035]
          shadow-2xl
          shadow-black/10
        "
      >
        {/* IMAGE */}

        <div
          className="
            relative
            w-full
            overflow-hidden
            bg-black/20
          "
        >
          <img
            src={photo}
            alt={title}
            className="
              block
              h-auto
              w-full
              object-contain
              transition
              duration-1000
            "
            loading="lazy"
          />

          {/* IMAGE OVERLAY */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/60
              via-transparent
              to-transparent
            "
          />

          {/* DAY */}

          <div
            className="
              absolute
              bottom-4
              left-4
              rounded-full
              border
              border-white/10
              bg-black/25
              px-3
              py-1.5
              text-[8px]
              uppercase
              tracking-[0.25em]
              text-white/55
              backdrop-blur-xl
            "
          >
            {day}
          </div>
        </div>

        {/* TEXT */}

        <div className="p-6 sm:p-7">
          <div
            className="
              text-[9px]
              uppercase
              tracking-[0.35em]
              text-rose-200/35
            "
          >
            {day}
          </div>

          <h3
            className="
              mt-3
              text-xl
              font-extralight
              text-white/80
              sm:text-2xl
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-4
              text-sm
              font-extralight
              leading-7
              text-white/35
            "
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}