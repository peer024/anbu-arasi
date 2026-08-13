"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Heart,
  Music2,
  Pause,
  Play,
  Quote,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type DailyExperienceProps = {
  day: number;
  daysRemaining: number;
  photoSrc?: string;
  songSrc?: string;
  songTitle?: string;
  quote?: string;
};

/* =========================================================
   COMPONENT
========================================================= */

export function DailyExperience({
  day,
  daysRemaining,
  photoSrc,
  songSrc,
  songTitle = "Today's little song",
  quote = "Some people make ordinary days feel a little less ordinary.",
}: DailyExperienceProps) {
  /* =======================================================
     AUDIO
  ======================================================= */

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const musicCardRef =
    useRef<HTMLDivElement | null>(null);

  const autoPlayAttemptedRef =
    useRef(false);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [isMuted, setIsMuted] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  /* =======================================================
     DAY DISPLAY
  ======================================================= */

  const formattedDay = day
    .toString()
    .padStart(3, "0");

  /* =======================================================
     AUDIO EVENTS
  ======================================================= */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleLoadedMetadata = () => {
      setDuration(
        Number.isFinite(audio.duration)
          ? audio.duration
          : 0
      );
    };

    const handleTimeUpdate = () => {
      if (!audio.duration) {
        return;
      }

      setProgress(
        (audio.currentTime /
          audio.duration) *
          100
      );
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate
    );

    audio.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );

      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );
    };
  }, [songSrc]);

  /* =======================================================
     AUTO PLAY WHEN TODAY'S SOUND CARD APPEARS
  ======================================================= */

  useEffect(() => {
    autoPlayAttemptedRef.current = false;

    if (!songSrc) {
      return;
    }

    const card = musicCardRef.current;
    const audio = audioRef.current;

    if (!card || !audio) {
      return;
    }

    let interactionStarted = false;
    let cardIsVisible = false;

    const startSong = async () => {
      if (
        !cardIsVisible ||
        interactionStarted ||
        autoPlayAttemptedRef.current
      ) {
        return;
      }

      if (!audio.paused) {
        setIsPlaying(true);
        autoPlayAttemptedRef.current = true;
        return;
      }

      interactionStarted = true;
      autoPlayAttemptedRef.current = true;

      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        /*
          Browsers can block unmuted autoplay.
          If that happens, the first tap/click
          anywhere on the page starts the song.
        */
        autoPlayAttemptedRef.current = false;
        interactionStarted = false;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        cardIsVisible =
          Boolean(
            entry?.isIntersecting
          ) &&
          (entry?.intersectionRatio ?? 0) >= 0.35;

        if (cardIsVisible) {
          void startSong();
        }
      },
      {
        threshold: [0.35],
      }
    );

    observer.observe(card);

    const handleFirstInteraction = () => {
      if (
        autoPlayAttemptedRef.current
      ) {
        return;
      }

      void startSong();
    };

    document.addEventListener(
      "pointerdown",
      handleFirstInteraction,
      {
        once: true,
      }
    );

    return () => {
      observer.disconnect();

      document.removeEventListener(
        "pointerdown",
        handleFirstInteraction
      );

      interactionStarted = true;
    };
  }, [songSrc]);

  /* =======================================================
     PLAY / PAUSE
  ======================================================= */

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio || !songSrc) {
      return;
    }

    try {
      if (audio.paused) {
        await audio.play();

        setIsPlaying(true);
      } else {
        audio.pause();

        setIsPlaying(false);
      }
    } catch (error) {
      console.error(
        "Audio playback failed:",
        error
      );

      setIsPlaying(false);
    }
  };

  /* =======================================================
     MUTE
  ======================================================= */

  const toggleMute = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const nextMuted = !audio.muted;

    audio.muted = nextMuted;

    setIsMuted(nextMuted);
  };

  /* =======================================================
     PROGRESS CLICK
  ======================================================= */

  const handleProgressClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const audio = audioRef.current;

    if (!audio || !duration) {
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    const clickPosition =
      (event.clientX - rect.left) /
      rect.width;

    audio.currentTime =
      clickPosition * duration;
  };

  /* =======================================================
     FORMAT AUDIO TIME
  ======================================================= */

  const formatTime = (
    seconds: number
  ) => {
    if (!Number.isFinite(seconds)) {
      return "00:00";
    }

    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      Math.floor(seconds % 60);

    return `${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      className="
        relative
        mx-auto
        w-full
        max-w-6xl
        px-5
        pb-28
        pt-16
        sm:px-8
      "
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
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
          duration: 0.8,
        }}
        className="text-center"
      >
        <div
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
          <Sparkles size={13} />

          <span>
            Today&apos;s little world
          </span>

          <Sparkles size={13} />
        </div>

        {/* REAL DAY */}

        <motion.h2
          key={day}
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="
            mt-5
            text-4xl
            font-extralight
            tracking-[-0.05em]
            text-white
            sm:text-5xl
          "
        >
          Day {formattedDay}
        </motion.h2>

        <p
          className="
            mt-4
            text-xs
            text-white/30
          "
        >
          {daysRemaining} days until her birthday
        </p>
      </motion.div>

      {/* ===================================================
          MAIN EXPERIENCE
      =================================================== */}

      <div
        className="
          mt-12
          grid
          gap-5
          lg:grid-cols-[1.35fr_0.65fr]
        "
      >
        {/* =================================================
            PHOTO MEMORY
        ================================================= */}

        <motion.div
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
            duration: 0.9,
          }}
          className="
            group
            relative
            min-h-[480px]
            overflow-hidden
            rounded-[34px]
            border
            border-white/[0.09]
            bg-[#09070b]
          "
        >
          {/* Ambient glow */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              z-0
              h-80
              w-80
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-rose-500/[0.08]
              blur-[120px]
            "
          />

          {/* =================================================
              PHOTO
          ================================================= */}

          {photoSrc ? (
            <motion.img
              key={photoSrc}
              src={photoSrc}
              alt={`Memory from day ${day}`}
              initial={{
                opacity: 0,
                scale: 1.08,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 1.2,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="
                absolute
                inset-0
                h-full
                w-full
                object-contain
                bg-black
                transition
                duration-[1200ms]
                group-hover:scale-[1.015]
              "
            />
          ) : (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              <div className="relative text-center">
                <motion.div
                  animate={{
                    scale: [
                      1,
                      1.08,
                      1,
                    ],
                    opacity: [
                      0.4,
                      0.8,
                      0.4,
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    mx-auto
                    flex
                    h-24
                    w-24
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.035]
                    backdrop-blur-xl
                  "
                >
                  <Heart
                    size={30}
                    strokeWidth={1}
                    className="text-rose-200/50"
                  />
                </motion.div>

                <p
                  className="
                    mt-6
                    text-sm
                    font-light
                    text-white/40
                  "
                >
                  Today&apos;s memory
                </p>

                <p
                  className="
                    mt-2
                    text-[9px]
                    uppercase
                    tracking-[0.35em]
                    text-white/20
                  "
                >
                  Your photo will appear here
                </p>
              </div>
            </div>
          )}

          {/* Photo gradient */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black
              via-black/15
              to-transparent
            "
          />

          {/* =================================================
              DAY BADGE
          ================================================= */}

          <div
            className="
              absolute
              left-5
              top-5
              z-20
              rounded-full
              border
              border-white/10
              bg-black/25
              px-4
              py-2
              backdrop-blur-xl
            "
          >
            <span
              className="
                text-[8px]
                uppercase
                tracking-[0.35em]
                text-white/50
              "
            >
              Memory {formattedDay}
            </span>
          </div>

          {/* =================================================
              BOTTOM MEMORY INFO
          ================================================= */}

          <div
            className="
              absolute
              inset-x-0
              bottom-0
              z-20
              p-5
              sm:p-7
            "
          >
            <div
              className="
                rounded-[24px]
                border
                border-white/10
                bg-black/35
                p-5
                backdrop-blur-2xl
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[8px]
                  uppercase
                  tracking-[0.35em]
                  text-white/35
                "
              >
                <Sparkles size={12} />

                <span>
                  Today&apos;s memory
                </span>
              </div>

              <p
                className="
                  mt-3
                  text-xl
                  font-extralight
                  tracking-tight
                  text-white/85
                "
              >
                A little moment worth
                remembering.
              </p>

              <p
                className="
                  mt-2
                  text-[10px]
                  text-white/25
                "
              >
                Day {formattedDay}
              </p>
            </div>
          </div>
        </motion.div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="grid gap-5">
          {/* ===============================================
              QUOTE
          ================================================ */}

          <motion.div
            ref={musicCardRef}
            initial={{
              opacity: 0,
              x: 25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              delay: 0.15,
              duration: 0.8,
            }}
            className="
              relative
              overflow-hidden
              rounded-[32px]
              border
              border-white/[0.09]
              bg-white/[0.035]
              p-7
              backdrop-blur-2xl
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-48
                w-48
                rounded-full
                bg-purple-500/[0.08]
                blur-[90px]
              "
            />

            <div className="relative">
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-rose-200/40
                "
              >
                <Quote size={16} />

                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.4em]
                  "
                >
                  Today&apos;s thought
                </span>
              </div>

              <motion.p
                key={`${day}-${quote}`}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                }}
                className="
                  mt-7
                  text-[21px]
                  font-extralight
                  leading-9
                  tracking-[-0.02em]
                  text-white/75
                "
              >
                &quot;{quote}&quot;
              </motion.p>

              <div
                className="
                  mt-7
                  h-px
                  w-12
                  bg-white/10
                "
              />

              <p
                className="
                  mt-4
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  text-white/20
                "
              >
                A little thought for you
              </p>
            </div>
          </motion.div>

          {/* ===============================================
              MUSIC
          ================================================ */}

          <motion.div
            initial={{
              opacity: 0,
              x: 25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              delay: 0.25,
              duration: 0.8,
            }}
            className="
              relative
              overflow-hidden
              rounded-[32px]
              border
              border-white/[0.09]
              bg-white/[0.035]
              p-7
              backdrop-blur-2xl
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -bottom-20
                -right-20
                h-48
                w-48
                rounded-full
                bg-pink-500/[0.08]
                blur-[90px]
              "
            />

            <div className="relative">
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-rose-200/40
                "
              >
                <Music2 size={16} />

                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.4em]
                  "
                >
                  Today&apos;s sound
                </span>
              </div>

              <div className="mt-6">
                <p
                  className="
                    text-lg
                    font-light
                    text-white/80
                  "
                >
                  {songTitle}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-white/25
                  "
                >
                  A little song for today
                </p>
              </div>

              {/* AUDIO */}

              {songSrc && (
                <audio
                  ref={audioRef}
                  src={songSrc}
                  preload="auto"
                />
              )}

              {/* PLAYER */}

              <div
                className="
                  mt-7
                  flex
                  items-center
                  gap-4
                "
              >
                <motion.button
                  type="button"
                  whileHover={{
                    scale: 1.06,
                  }}
                  whileTap={{
                    scale: 0.94,
                  }}
                  onClick={togglePlay}
                  disabled={!songSrc}
                  aria-label={
                    isPlaying
                      ? "Pause song"
                      : "Play song"
                  }
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-black
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  {isPlaying ? (
                    <Pause size={17} />
                  ) : (
                    <Play
                      size={17}
                      className="ml-0.5"
                    />
                  )}
                </motion.button>

                <div className="min-w-0 flex-1">
                  <div
                    role="slider"
                    aria-label="Song progress"
                    tabIndex={0}
                    onClick={
                      handleProgressClick
                    }
                    className="
                      group/progress
                      cursor-pointer
                      py-2
                    "
                  >
                    <div
                      className="
                        relative
                        h-1
                        overflow-hidden
                        rounded-full
                        bg-white/10
                      "
                    >
                      <motion.div
                        className="
                          absolute
                          left-0
                          top-0
                          h-full
                          rounded-full
                          bg-white/60
                        "
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="
                      flex
                      justify-between
                      text-[8px]
                      text-white/20
                    "
                  >
                    <span>
                      {formatTime(
                        audioRef.current
                          ?.currentTime || 0
                      )}
                    </span>

                    <span>
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleMute}
                  disabled={!songSrc}
                  aria-label={
                    isMuted
                      ? "Unmute song"
                      : "Mute song"
                  }
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    text-white/35
                    transition
                    hover:border-white/20
                    hover:text-white/70
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  {isMuted ? (
                    <VolumeX size={15} />
                  ) : (
                    <Volume2 size={15} />
                  )}
                </button>
              </div>

              {!songSrc && (
                <p
                  className="
                    mt-5
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                    text-white/20
                  "
                >
                  Your selected song will
                  appear here
                </p>
              )}

              {/* EQUALIZER */}

              {isPlaying && (
                <div
                  className="
                    mt-5
                    flex
                    h-5
                    items-end
                    justify-center
                    gap-1
                  "
                >
                  {Array.from({
                    length: 18,
                  }).map((_, index) => (
                    <motion.span
                      key={index}
                      className="
                        w-[2px]
                        rounded-full
                        bg-rose-200/40
                      "
                      animate={{
                        height: [
                          4,
                          8 +
                            (index % 5) * 2,
                          5,
                          12,
                          4,
                        ],
                      }}
                      transition={{
                        duration:
                          0.55 +
                          (index % 4) *
                            0.08,
                        repeat: Infinity,
                        repeatType:
                          "mirror",
                        delay:
                          index * 0.03,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===================================================
          FOOTER
      =================================================== */}

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
        transition={{
          delay: 0.4,
          duration: 0.8,
        }}
        className="
          mt-14
          text-center
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-lg
            items-center
            gap-4
            text-[9px]
            uppercase
            tracking-[0.3em]
            text-white/20
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
            Come back tomorrow
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

        <p
          className="
            mt-5
            text-xs
            text-white/15
          "
        >
          Another little memory will
          be waiting.
        </p>
      </motion.div>
    </section>
  );
}