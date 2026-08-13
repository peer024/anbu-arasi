"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { DailyExperience } from "@/components/daily/DailyExperience";
import { BirthdayExperience } from "@/components/birthday/BirthdayExperience";
import { getDailyContent } from "@/data/daily";

/* =========================================================
   SETTINGS
========================================================= */

/*
  FINAL WEBSITE:
  false

  TESTING:
  change PREVIEW_MODE below only when you want
  to preview a fixed day.
*/
const PREVIEW_MODE = false;

/*
  While PREVIEW_MODE is true,
  this is the day shown on the website.
*/
const PREVIEW_DAY = 4;

/*
  Birthday testing:

  true  = immediately show BirthdayExperience
  false = use the real birthday date

  IMPORTANT:
  For final deployment:
  TEST_BIRTHDAY_MODE = false
*/
const TEST_BIRTHDAY_MODE = false;

/*
  Birthday:
  03 March 2027
  12:00 AM IST
*/
const BIRTHDAY_DATE = new Date(
  "2027-03-03T00:00:00+05:30"
);

/* =========================================================
   TYPES
========================================================= */

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/* =========================================================
   COUNTDOWN CALCULATOR
========================================================= */

function calculateTimeLeft(): TimeLeft {
  const difference =
    BIRTHDAY_DATE.getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(
      difference /
        (1000 * 60 * 60 * 24)
    ),

    hours: Math.floor(
      (difference /
        (1000 * 60 * 60)) %
        24
    ),

    minutes: Math.floor(
      (difference /
        (1000 * 60)) %
        60
    ),

    seconds: Math.floor(
      (difference / 1000) % 60
    ),
  };
}

/* =========================================================
   FORMAT NUMBER
========================================================= */

function formatNumber(value: number) {
  return value
    .toString()
    .padStart(2, "0");
}

/* =========================================================
   STAR DATA
========================================================= */

const stars = Array.from(
  { length: 60 },
  (_, index) => ({
    id: index,
    left: `${(index * 37) % 100}%`,
    top: `${(index * 61) % 100}%`,
    delay: (index % 10) * 0.2,
  })
);

/* =========================================================
   COUNTDOWN CARD
========================================================= */

function CountdownCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
      }}
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        px-5
        py-8
        backdrop-blur-xl
      "
    >
      <div
        className="
          absolute
          left-1/2
          top-0
          h-24
          w-24
          -translate-x-1/2
          rounded-full
          bg-rose-400/10
          blur-3xl
        "
      />

      <div className="relative">
        <motion.div
          key={value}
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="
            text-5xl
            font-light
            tracking-tight
            sm:text-6xl
          "
        >
          {formatNumber(value)}
        </motion.div>

        <div
          className="
            mt-3
            text-[10px]
            uppercase
            tracking-[0.35em]
            text-white/30
          "
        >
          {label}
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   HOME
========================================================= */

export default function Home() {
  /* =======================================================
     DAILY CONTENT
  ======================================================= */

  const dailyContent = getDailyContent(
    PREVIEW_MODE
      ? PREVIEW_DAY
      : undefined
  );

  /* =======================================================
     INTRO STATE
  ======================================================= */

  const [entered, setEntered] =
    useState(false);

  /* =======================================================
     LIVE TIME STATE
  ======================================================= */

  const [timeLeft, setTimeLeft] =
    useState<TimeLeft>(
      calculateTimeLeft()
    );

  /* =======================================================
     BIRTHDAY STATE

     IMPORTANT:

     This is STATE, not just Date.now()
     inside render.

     Therefore when midnight arrives,
     React re-renders and switches to
     BirthdayExperience without refresh.
  ======================================================= */

  const [birthdayStarted, setBirthdayStarted] =
    useState(
      TEST_BIRTHDAY_MODE ||
        Date.now() >=
          BIRTHDAY_DATE.getTime()
    );

  /* =======================================================
     REAL-TIME COUNTDOWN + BIRTHDAY CHECK
  ======================================================= */

  useEffect(() => {
    /*
      TEST MODE
      -----------------------------------
      Birthday is forced manually.
    */

    if (TEST_BIRTHDAY_MODE) {
      setBirthdayStarted(true);

      return;
    }

    /*
      Check immediately when component mounts.
    */

    const checkBirthday =
      () => {
        const now =
          Date.now();

        const difference =
          BIRTHDAY_DATE.getTime() -
          now;

        /*
          Update countdown.
        */

        setTimeLeft(
          calculateTimeLeft()
        );

        /*
          Birthday reached.
        */

        if (difference <= 0) {
          setBirthdayStarted(true);
        }
      };

    /*
      Run immediately.
    */

    checkBirthday();

    /*
      Run every second.

      This means:

      11:59:59
           ↓
      12:00:00
           ↓
      Birthday automatically unlocks.
    */

    const timer =
      window.setInterval(
        checkBirthday,
        1000
      );

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, []);

  /* =======================================================
     BIRTHDAY EXPERIENCE
  ======================================================= */

  if (birthdayStarted) {
    return (
      <BirthdayExperience
        photoSrc={
          dailyContent.memory?.image
        }
      />
    );
  }

  /* =======================================================
     COUNTDOWN

     Preview mode gets a fake large
     countdown so you can see the UI.

     Real mode uses actual countdown.
  ======================================================= */

  const countdown =
    PREVIEW_MODE
      ? {
          days: 999,
          hours: 23,
          minutes: 59,
          seconds: 59,
        }
      : timeLeft;

  /* =======================================================
     NORMAL DAILY WEBSITE
  ======================================================= */

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#020204]
        text-white
      "
    >
      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
        "
      >
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[600px]
            w-[600px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-rose-500/[0.06]
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            left-[10%]
            top-[15%]
            h-64
            w-64
            rounded-full
            bg-purple-500/[0.05]
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            bottom-[5%]
            right-[5%]
            h-72
            w-72
            rounded-full
            bg-pink-500/[0.04]
            blur-[130px]
          "
        />
      </div>

      {/* ===================================================
          STARS
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
        "
      >
        {stars.map((star) => (
          <motion.span
            key={star.id}
            className="
              absolute
              h-[2px]
              w-[2px]
              rounded-full
              bg-white
            "
            style={{
              left: star.left,
              top: star.top,
            }}
            animate={{
              opacity: [
                0.1,
                0.7,
                0.1,
              ],
              scale: [
                0.7,
                1.2,
                0.7,
              ],
            }}
            transition={{
              duration:
                3 + (star.id % 3),
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ===================================================
          DATE
      =================================================== */}

      <div
        className="
          absolute
          left-1/2
          top-8
          z-20
          -translate-x-1/2
          text-[9px]
          uppercase
          tracking-[0.45em]
          text-white/25
        "
      >
        03 • 03 • 2027
      </div>

      {/* ===================================================
          INTRO
      =================================================== */}

      {!entered ? (
        <motion.section
          className="
            relative
            z-10
            flex
            min-h-screen
            items-center
            justify-center
            px-6
          "
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 1,
          }}
        >
          <div
            className="
              w-full
              max-w-4xl
              text-center
            "
          >
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
                delay: 0.4,
                duration: 0.8,
              }}
              className="
                mb-8
                flex
                items-center
                justify-center
                gap-2
                text-[10px]
                uppercase
                tracking-[0.4em]
                text-white/35
              "
            >
              <Sparkles size={13} />

              A little world made for you

              <Sparkles size={13} />
            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.7,
                duration: 1,
              }}
              className="
                text-5xl
                font-extralight
                tracking-[-0.05em]
                sm:text-7xl
                md:text-8xl
              "
            >
              Something

              <span
                className="
                  mt-2
                  block
                  bg-gradient-to-r
                  from-white
                  via-rose-100
                  to-white/40
                  bg-clip-text
                  text-transparent
                "
              >
                special awaits.
              </span>
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 1.4,
                duration: 0.8,
              }}
              className="
                mx-auto
                mt-8
                max-w-md
                text-sm
                leading-7
                text-white/35
              "
            >
              I made a little world for you.
              <br />
              Maybe you&apos;ll understand why
              when you enter.
            </motion.p>

            <motion.button
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.9,
                duration: 0.8,
              }}
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={() =>
                setEntered(true)
              }
              className="
                group
                mx-auto
                mt-12
                flex
                items-center
                gap-4
                rounded-full
                border
                border-white/10
                bg-white/[0.04]
                px-6
                py-3
                pl-7
                backdrop-blur-xl
                transition
                hover:border-white/20
                hover:bg-white/[0.07]
              "
            >
              <span
                className="
                  text-sm
                  text-white/75
                "
              >
                Enter your little world
              </span>

              <span
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-black
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              >
                <ArrowRight size={15} />
              </span>
            </motion.button>
          </div>
        </motion.section>
      ) : (
        <>
          {/* =================================================
              COUNTDOWN
          ================================================= */}

          <motion.section
            className="
              relative
              z-10
              flex
              min-h-screen
              items-center
              justify-center
              px-5
              pt-24
            "
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1,
            }}
          >
            <div
              className="
                w-full
                max-w-6xl
                text-center
              "
            >
              <div
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.45em]
                  text-rose-200/40
                "
              >
                Until your birthday
              </div>

              <h2
                className="
                  mt-5
                  text-4xl
                  font-extralight
                  tracking-tight
                  sm:text-6xl
                "
              >
                03 March 2027
              </h2>

              <p
                className="
                  mx-auto
                  mt-5
                  max-w-md
                  text-sm
                  leading-6
                  text-white/25
                "
              >
                One day at a time.
                <br />
                One little memory at a time.
              </p>

              {/* COUNTDOWN */}

              <div
                className="
                  mt-12
                  grid
                  grid-cols-2
                  gap-3
                  sm:mt-16
                  sm:grid-cols-4
                  sm:gap-5
                "
              >
                <CountdownCard
                  label="Days"
                  value={countdown.days}
                />

                <CountdownCard
                  label="Hours"
                  value={countdown.hours}
                />

                <CountdownCard
                  label="Minutes"
                  value={countdown.minutes}
                />

                <CountdownCard
                  label="Seconds"
                  value={countdown.seconds}
                />
              </div>

              {/* DIVIDER */}

              <div
                className="
                  mx-auto
                  mt-12
                  flex
                  max-w-xl
                  items-center
                  gap-3
                  text-xs
                  text-white/25
                "
              >
                <span
                  className="
                    h-px
                    flex-1
                    bg-gradient-to-r
                    from-transparent
                    to-white/10
                  "
                />

                <span>
                  Every day, something new
                  will be waiting here.
                </span>

                <span
                  className="
                    h-px
                    flex-1
                    bg-gradient-to-l
                    from-transparent
                    to-white/10
                  "
                />
              </div>

              {/* PREVIEW */}

              {PREVIEW_MODE && (
                <div
                  className="
                    mt-8
                    inline-flex
                    rounded-full
                    border
                    border-amber-200/10
                    bg-amber-100/[0.03]
                    px-5
                    py-2.5
                    text-[8px]
                    uppercase
                    tracking-[0.35em]
                    text-amber-100/30
                  "
                >
                  Preview Mode — Day{" "}
                  {PREVIEW_DAY}
                </div>
              )}
            </div>
          </motion.section>

          {/* =================================================
              DAILY EXPERIENCE
          ================================================= */}

          <DailyExperience
            day={dailyContent.day}
            daysRemaining={
              dailyContent.daysRemaining
            }
            photoSrc={
              dailyContent.memory?.image
            }
            quote={
              dailyContent.quote?.text
            }
            songSrc={
              dailyContent.song?.src
            }
            songTitle={
              dailyContent.song?.title
            }
          />
        </>
      )}

      {/* ===================================================
          BOTTOM GLOW
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/2
          h-px
          w-2/3
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-rose-200/10
          to-transparent
        "
      />
    </main>
  );
}