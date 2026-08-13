"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { motion, AnimatePresence } from "framer-motion";
import { MemoryTimeline } from "./MemoryTimeline";
import { WhySpecial } from "./WhySpecial";
import { SecretGift } from "./SecretGift";
import { BirthdayCake } from "./BirthdayCake";
import { SecretLetters } from "./SecretLetters";
import { BirthdayNight } from "./BirthdayNight";

import {
  Cake,
  Heart,
  Sparkles,
  Star,
  Music2,
  Volume2,
  VolumeX,
  Mail,
  ArrowDown,
  X,
} from "lucide-react";

/* =========================================================
   BIRTHDAY SONGS
========================================================= */

const BIRTHDAY_SONGS = [
  {
    title: "A little song for you",
    src: "/music/birthday-01.mp3",
  },
  {
    title: "Another little memory",
    src: "/music/birthday-02.mp3",
  },
  {
    title: "For your special day",
    src: "/music/birthday-03.mp3",
  },
];

/* =========================================================
   BIRTHDAY PHOTOS
========================================================= */

const BIRTHDAY_PHOTOS = Array.from(
  { length: 60 },
  (_, index) =>
    `/photos/photo-${String(index + 1).padStart(2, "0")}.png`
);

/* =========================================================
   LETTER
========================================================= */

const LETTER_LINES = [
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
];

/* =========================================================
   COMPONENT
========================================================= */

type BirthdayExperienceProps = {
  photoSrc?: string;
};

export function BirthdayExperience({
  photoSrc,
}: BirthdayExperienceProps) {
  const [started, setStarted] =
    useState(false);

  // Immediately shown after "Open your surprise" is clicked.
  const [showHeartIntro, setShowHeartIntro] =
    useState(false);

  const [showLetter, setShowLetter] =
    useState(false);

  const [showFinal, setShowFinal] =
    useState(false);

  const [photoIndex, setPhotoIndex] =
    useState(0);

  const [songIndex, setSongIndex] =
    useState(0);

  const songIndexRef =
    useRef(0);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [isMuted, setIsMuted] =
    useState(false);

  const [visibleLines, setVisibleLines] =
    useState(0);

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  /* =======================================================
     PHOTO
  ======================================================= */

  const activePhoto =
    photoSrc ||
    BIRTHDAY_PHOTOS[photoIndex];

  const heartParticles = useMemo(
    () =>
      Array.from(
        { length: 84 },
        (_, index) => {
          const t =
            (Math.PI * 2 * index) / 84;
          const x =
            16 * Math.pow(Math.sin(t), 3);
          const y =
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t);

          return {
            id: index,
            startX: (index * 47) % 100,
            startY: (index * 83) % 100,
            x: x * 9,
            y: -y * 9,
            delay: (index / 84) * 1.6,
          };
        }
      ),
    []
  );

  /* =======================================================
     START EXPERIENCE
  ======================================================= */

  const startBirthdayExperience =
    async () => {
      setStarted(true);
      setShowHeartIntro(true);

      window.setTimeout(() => {
        setShowHeartIntro(false);
      }, 5200);

      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      songIndexRef.current = 0;
      setSongIndex(0);

      audio.pause();
      audio.src =
        BIRTHDAY_SONGS[0].src;
      audio.currentTime = 0;
      audio.muted = false;

      try {
        await audio.play();
        setIsPlaying(true);
        setIsMuted(false);
      } catch (error) {
        console.error(
          "Birthday audio could not start:",
          error
        );
      }
    };

  /* =======================================================
     NEXT SONG
  ======================================================= */

  const playNextSong = async () => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    const nextIndex =
      (songIndexRef.current + 1) %
      BIRTHDAY_SONGS.length;

    songIndexRef.current =
      nextIndex;

    setSongIndex(nextIndex);

    audio.pause();
    audio.src =
      BIRTHDAY_SONGS[nextIndex].src;
    audio.currentTime = 0;
    audio.muted = false;

    try {
      await audio.play();
      setIsPlaying(true);
      setIsMuted(false);
    } catch (error) {
      console.error(
        "Next birthday song could not play:",
        error
      );
      setIsPlaying(false);
    }
  };

  /* =======================================================
     PERSISTENT BIRTHDAY AUDIO
  ======================================================= */

  useEffect(() => {
    const audio = new Audio();

    audio.preload = "auto";
    audio.volume = 1;
    audioRef.current = audio;

    const handleEnded = () => {
      void playNextSong();
    };

    audio.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      audio.removeEventListener(
        "ended",
        handleEnded
      );
      audio.pause();
      audio.src = "";

      if (
        audioRef.current === audio
      ) {
        audioRef.current = null;
      }
    };
  }, []);

  /* =======================================================
     PHOTO ROTATION
  ======================================================= */

  useEffect(() => {
    if (!started) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setPhotoIndex((current) => {
          return (
            (current + 1) %
            BIRTHDAY_PHOTOS.length
          );
        });
      }, 6500);

    return () => {
      window.clearInterval(timer);
    };
  }, [started]);

  /* =======================================================
     LETTER ANIMATION
  ======================================================= */

  useEffect(() => {
    if (!showLetter) {
      setVisibleLines(0);
      return;
    }

    setVisibleLines(0);

    const timers: number[] = [];

    LETTER_LINES.forEach(
      (_, index) => {
        const timer =
          window.setTimeout(() => {
            setVisibleLines(
              index + 1
            );
          }, 450 * index);

        timers.push(timer);
      }
    );

    return () => {
      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [showLetter]);

  /* =======================================================
     PLAY / PAUSE
  ======================================================= */

  const togglePlayback =
    async () => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      if (audio.paused) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.error(
            "Audio playback failed:",
            error
          );
        }
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    };

  /* =======================================================
     MUTE
  ======================================================= */

  const toggleMute = () => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    const nextMuted =
      !audio.muted;

    audio.muted = nextMuted;

    setIsMuted(nextMuted);
  };

  /*
    Birthday music uses one persistent Audio instance.
    This keeps playback alive while the intro overlay
    appears and disappears.
  */
  const audioElement = null;

  /* =======================================================
     INTRO
  ======================================================= */

  if (!started) {
    return (
      <main
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-[#050205]
          text-white
        "
      >

        <BirthdayNight />
        {audioElement}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            overflow-hidden
          "
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [
                0.18,
                0.35,
                0.18,
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              left-1/2
              top-1/2
              h-[550px]
              w-[550px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-rose-500/10
              blur-[130px]
            "
          />

          <div
            className="
              absolute
              left-0
              top-0
              h-80
              w-80
              rounded-full
              bg-purple-500/10
              blur-[120px]
            "
          />

          <div
            className="
              absolute
              bottom-0
              right-0
              h-96
              w-96
              rounded-full
              bg-pink-500/10
              blur-[140px]
            "
          />
        </div>

        <div
          className="
            pointer-events-none
            absolute
            inset-0
          "
        >
          {Array.from({
            length: 40,
          }).map((_, index) => (
            <motion.div
              key={index}
              className="
                absolute
                text-white/30
              "
              style={{
                left: `${(index * 29) % 100}%`,
                top: `${(index * 47) % 100}%`,
              }}
              animate={{
                opacity: [
                  0.1,
                  0.8,
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
                  2.5 +
                  (index % 4),
                delay:
                  (index % 8) * 0.3,
                repeat: Infinity,
              }}
            >
              <Star size={8} />
            </motion.div>
          ))}
        </div>

        <section
          className="
            relative
            z-10
            flex
            min-h-screen
            items-center
            justify-center
            px-6
          "
        >
          <div
            className="
              w-full
              max-w-3xl
              text-center
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 1,
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
                bg-white/[0.04]
                shadow-2xl
                shadow-rose-500/10
                backdrop-blur-xl
              "
            >
              <Cake
                size={34}
                strokeWidth={1}
                className="text-rose-200/80"
              />
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.5,
                duration: 0.9,
              }}
              className="
                mt-10
                text-[10px]
                uppercase
                tracking-[0.5em]
                text-rose-200/45
              "
            >
              03 • 03 • 2027
            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.8,
                duration: 1,
              }}
              className="
                mt-6
                text-5xl
                font-extralight
                tracking-[-0.06em]
                sm:text-7xl
                md:text-8xl
              "
            >
              Today is

              <span
                className="
                  mt-2
                  block
                  bg-gradient-to-r
                  from-white
                  via-rose-100
                  to-pink-200/50
                  bg-clip-text
                  text-transparent
                "
              >
                your day.
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
                delay: 1.5,
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
              The countdown is over.
              <br />
              There is one more little
              world waiting for you.
            </motion.p>

            <motion.button
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 2,
              }}
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.96,
              }}
              onClick={() => {
                void startBirthdayExperience();
              }}
              className="
                group
                mx-auto
                mt-12
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
              <Sparkles size={15} />

              Open your surprise
            </motion.button>

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 2.5,
              }}
              className="
                mt-6
                flex
                items-center
                justify-center
                gap-2
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-white/20
              "
            >
              <Music2 size={12} />

              Three songs are waiting
            </motion.div>
          </div>
        </section>
      </main>
    );
  }

  /* =======================================================
     MAIN EXPERIENCE
  ======================================================= */

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#050205]
        text-white
      "
    >
      {audioElement}

      {/* ===================================================
          OPEN SURPRISE → SPARKLES → HEART → NAME
      =================================================== */}
      <AnimatePresence>
        {showHeartIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-[999]
              flex
              items-center
              justify-center
              overflow-hidden
              bg-[#050205]/96
              px-5
              backdrop-blur-xl
            "
          >
            <motion.div
              initial={{
                scale: 0.4,
                opacity: 0,
              }}
              animate={{
                scale: [0.4, 1.08, 1],
                opacity: [0, 0.32, 0.16],
              }}
              transition={{
                duration: 4,
                ease: "easeOut",
              }}
              className="
                pointer-events-none
                absolute
                h-[460px]
                w-[460px]
                rounded-full
                bg-rose-500/20
                blur-[120px]
              "
            />

            <div className="relative h-[440px] w-[440px]">
              {heartParticles.map(
                (particle) => (
                  <motion.span
                    key={particle.id}
                    initial={{
                      left: `${particle.startX}%`,
                      top: `${particle.startY}%`,
                      opacity: 0,
                      scale: 0.15,
                    }}
                    animate={{
                      left: `calc(50% + ${particle.x}px)`,
                      top: `calc(50% + ${particle.y}px)`,
                      opacity: [0, 0.8, 1],
                      scale: [0.15, 1, 0.65],
                    }}
                    transition={{
                      duration: 3.5,
                      delay: particle.delay,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    className="
                      absolute
                      -ml-[3px]
                      -mt-[3px]
                      h-[6px]
                      w-[6px]
                      rounded-full
                      bg-rose-100
                      shadow-[0_0_14px_rgba(251,113,133,0.95)]
                    "
                  />
                )
              )}

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.75,
                }}
                animate={{
                  opacity: [0, 0, 0.9, 0.45],
                  scale: [0.75, 0.92, 1.04, 1],
                }}
                transition={{
                  duration: 4.2,
                  times: [0, 0.72, 0.9, 1],
                }}
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  h-[250px]
                  w-[290px]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-[50%]
                  border
                  border-rose-200/20
                  shadow-[0_0_70px_rgba(251,113,133,0.3)]
                "
              />

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                  scale: 0.82,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  delay: 3.35,
                  duration: 0.85,
                  type: "spring",
                  stiffness: 130,
                  damping: 14,
                }}
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  text-center
                "
              >
                <div>
                  <div
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.55em]
                      text-rose-100/45
                    "
                  >
                    Happy Birthday
                  </div>
                  <div
                    className="
                      mt-3
                      text-4xl
                      font-extralight
                      tracking-[-0.04em]
                      text-white
                      drop-shadow-[0_0_25px_rgba(251,113,133,0.45)]
                      sm:text-6xl
                    "
                  >
                    Anbu Arasi
                  </div>
                  <div className="mt-2 text-sm text-rose-100/60">
                    ❤️
                  </div>
                </div>
              </motion.div>
            </div>

            <div
              className="
                pointer-events-none
                absolute
                bottom-12
                text-[9px]
                uppercase
                tracking-[0.45em]
                text-white/20
              "
            >
              A little world, made for you
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          overflow-hidden
        "
      >
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [
              0.2,
              0.35,
              0.2,
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="
            absolute
            left-1/2
            top-1/2
            h-[650px]
            w-[650px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-rose-500/10
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            left-0
            top-0
            h-96
            w-96
            rounded-full
            bg-purple-500/10
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-0
            h-96
            w-96
            rounded-full
            bg-pink-500/10
            blur-[140px]
          "
        />
      </div>

      {/* ===================================================
          TOP MUSIC PLAYER
      =================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          fixed
          right-5
          top-5
          z-50
          flex
          items-center
          gap-2
          rounded-full
          border
          border-white/10
          bg-black/30
          p-1.5
          backdrop-blur-2xl
        "
      >
        <div
          className="
            hidden
            px-3
            text-[8px]
            uppercase
            tracking-[0.25em]
            text-white/35
            sm:block
          "
        >
          {BIRTHDAY_SONGS[
            songIndex
          ].title}
        </div>

        <button
          type="button"
          onClick={() => {
            void togglePlayback();
          }}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white/[0.06]
            text-white/70
          "
          aria-label={
            isPlaying
              ? "Pause music"
              : "Play music"
          }
        >
          {isPlaying ? (
            <span className="flex gap-[3px]">
              <span className="h-4 w-[2px] bg-white/70" />
              <span className="h-4 w-[2px] bg-white/70" />
            </span>
          ) : (
            <span
              className="
                ml-0.5
                h-0
                w-0
                border-b-[6px]
                border-l-[9px]
                border-t-[6px]
                border-b-transparent
                border-l-white/70
                border-t-transparent
              "
            />
          )}
        </button>

        <button
          type="button"
          onClick={toggleMute}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white/[0.06]
            text-white/70
          "
        >
          {isMuted ? (
            <VolumeX size={15} />
          ) : (
            <Volume2 size={15} />
          )}
        </button>
      </motion.div>

      {/* ===================================================
          HERO
      =================================================== */}

      <section
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-5
          py-24
        "
      >
        <div
          className="
            w-full
            max-w-5xl
            text-center
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
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
              text-[9px]
              uppercase
              tracking-[0.45em]
              text-rose-200/45
            "
          >
            <Sparkles size={13} />
            A day worth celebrating
            <Sparkles size={13} />
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.25,
              duration: 1,
            }}
            className="
              mt-7
              text-5xl
              font-extralight
              tracking-[-0.06em]
              sm:text-7xl
              md:text-8xl
            "
          >
            Happy Birthday

            <span
              className="
                mt-3
                block
                bg-gradient-to-r
                from-white
                via-rose-100
                to-white/30
                bg-clip-text
                text-transparent
              "
            >
              ✨
            </span>
          </motion.h1>

          {/* ===============================================
              HERO PHOTO
          ================================================ */}

          <motion.div
            initial={{
              opacity: 0,
              y: 35,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              delay: 0.55,
              duration: 1,
            }}
            className="
              relative
              mx-auto
              mt-12
              h-[420px]
              w-full
              max-w-2xl
              overflow-hidden
              rounded-[36px]
              border
              border-white/10
              bg-white/[0.03]
              shadow-2xl
              shadow-rose-500/10
            "
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activePhoto}
                src={activePhoto}
                alt="Birthday memory"
                initial={{
                  opacity: 0,
                  scale: 1.1,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 1.04,
                }}
                transition={{
                  duration: 1.2,
                }}
                className="
                  h-full
                  w-full
                  object-contain
                  bg-black/20
                "
              />
            </AnimatePresence>

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-black/70
                via-transparent
                to-black/10
              "
            />

            <div
              className="
                absolute
                bottom-6
                left-1/2
                -translate-x-1/2
                whitespace-nowrap
                rounded-full
                border
                border-white/10
                bg-black/30
                px-5
                py-2.5
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-white/60
                backdrop-blur-xl
              "
            >
              A little memory for today
            </div>
          </motion.div>

          {/* ===============================================
              SCROLL INDICATOR
          ================================================ */}

          <motion.div
            animate={{
              y: [0, 7, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="
              mt-12
              flex
              flex-col
              items-center
              gap-3
              text-[8px]
              uppercase
              tracking-[0.35em]
              text-white/25
            "
          >
            Scroll slowly

            <ArrowDown size={14} />
          </motion.div>
        </div>
      </section>

      {/* ===================================================
          MEMORY GALLERY
      =================================================== */}

      <section
        className="
          relative
          z-10
          px-5
          py-28
          sm:px-8
        "
      >
        <div
          className="
            mx-auto
            max-w-6xl
          "
        >
          <div className="text-center">
            <div
              className="
                text-[9px]
                uppercase
                tracking-[0.45em]
                text-rose-200/40
              "
            >
              Little memories
            </div>

            <h2
              className="
                mt-5
                text-3xl
                font-extralight
                tracking-tight
                sm:text-5xl
              "
            >
              A few moments
              <span className="text-white/30">
                {" "}
                worth keeping.
              </span>
            </h2>
          </div>

          <div
            className="
              mt-14
              grid
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {BIRTHDAY_PHOTOS.map(
              (photo, index) => (
                <motion.div
                  key={photo}
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
                    delay:
                      index * 0.1,
                    duration: 0.7,
                  }}
                  whileHover={{
                    y: -6,
                  }}
                  className="
                    group
                    relative
                    aspect-[4/5]
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-white/10
                    bg-white/[0.03]
                  "
                >
                  <img
                    src={photo}
                    alt={`Memory ${index + 1}`}
                    className="
                      h-full
                      w-full
                      object-contain
                      bg-black/20
                      transition
                      duration-700
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/60
                      via-transparent
                      to-transparent
                    "
                  />

                  <div
                    className="
                      absolute
                      bottom-5
                      left-5
                      text-[9px]
                      uppercase
                      tracking-[0.3em]
                      text-white/45
                    "
                  >
                    Memory {String(
                      index + 1
                    ).padStart(2, "0")}
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      <MemoryTimeline />

      <WhySpecial />

      <SecretGift />

      <BirthdayCake />

      <SecretLetters />

      {/* ===================================================
          LETTER INVITATION
      =================================================== */}

      <section
        className="
          relative
          z-10
          flex
          min-h-[70vh]
          items-center
          justify-center
          px-5
          py-28
        "
      >
        <div className="text-center">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              border
              border-rose-200/10
              bg-rose-200/[0.04]
              text-rose-200/70
            "
          >
            <Mail size={28} />
          </motion.div>

          <motion.div
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
              delay: 0.2,
            }}
          >
            <div
              className="
                mt-8
                text-[9px]
                uppercase
                tracking-[0.4em]
                text-white/25
              "
            >
              There&apos;s one more thing
            </div>

            <h2
              className="
                mt-4
                text-3xl
                font-extralight
                sm:text-5xl
              "
            >
              A little letter,
              <br />
              <span className="text-white/35">
                just for you.
              </span>
            </h2>

            <button
              type="button"
              onClick={() =>
                setShowLetter(true)
              }
              className="
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
              <Mail size={16} />

              Open the letter
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===================================================
          LETTER MODAL
      =================================================== */}

      <AnimatePresence>
        {showLetter && (
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
              overflow-y-auto
              bg-[#050205]/95
              px-5
              py-10
              backdrop-blur-xl
            "
          >
            <button
              type="button"
              onClick={() =>
                setShowLetter(false)
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
              aria-label="Close letter"
            >
              <X size={17} />
            </button>

            <div
              className="
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
                  y: 30,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.8,
                }}
                className="
                  w-full
                  rounded-[32px]
                  border
                  border-white/10
                  bg-white/[0.035]
                  p-7
                  shadow-2xl
                  sm:p-12
                "
              >
                <div
                  className="
                    text-center
                    text-[9px]
                    uppercase
                    tracking-[0.45em]
                    text-rose-200/40
                  "
                >
                  A letter for you
                </div>

                <div className="mt-10 space-y-5">
                  {LETTER_LINES.map(
                    (line, index) => (
                      <AnimatePresence
                        key={line}
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
                                  ? "text-2xl sm:text-3xl"
                                  : "text-base sm:text-lg"
                              }
                              ${
                                index === 0
                                  ? "font-light text-white"
                                  : "font-extralight text-white/55"
                              }
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

                {/* =========================================
                    FINAL LOVE BUTTON
                ========================================== */}

                {visibleLines ===
                  LETTER_LINES.length && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.8,
                    }}
                    className="
                      mt-12
                      border-t
                      border-white/10
                      pt-10
                      text-center
                    "
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowLetter(false);

                        window.setTimeout(
                          () => {
                            setShowFinal(true);
                          },
                          500
                        );
                      }}
                      className="
                        inline-flex
                        items-center
                        gap-3
                        rounded-full
                        border
                        border-rose-200/10
                        bg-rose-200/[0.06]
                        px-7
                        py-3.5
                        text-sm
                        text-rose-100/80
                        transition
                        hover:bg-rose-200/[0.1]
                      "
                    >
                      <Heart
                        size={16}
                        fill="currentColor"
                      />

                      One last thing
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================
          FINAL LOVE REVEAL
      =================================================== */}

      <AnimatePresence>
        {showFinal && (
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
              z-[120]
              flex
              min-h-screen
              items-center
              justify-center
              overflow-hidden
              bg-[#050205]
              px-6
              text-center
            "
          >
            {/* =============================================
                PARTICLES
            ============================================== */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
              "
            >
              {Array.from({
                length: 70,
              }).map((_, index) => (
                <motion.div
                  key={index}
                  className="
                    absolute
                    h-1
                    w-1
                    rounded-full
                    bg-rose-200/50
                  "
                  style={{
                    left: `${(index * 31) % 100}%`,
                    top: `${(index * 53) % 100}%`,
                  }}
                  animate={{
                    y: [
                      0,
                      -30,
                      0,
                    ],
                    opacity: [
                      0.1,
                      0.8,
                      0.1,
                    ],
                    scale: [
                      0.5,
                      1.4,
                      0.5,
                    ],
                  }}
                  transition={{
                    duration:
                      2 +
                      (index % 4),
                    delay:
                      (index % 10) *
                      0.12,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>

            <div
              className="
                relative
                z-10
                max-w-3xl
              "
            >
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 1,
                  type: "spring",
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
                  border-rose-200/10
                  bg-rose-200/[0.05]
                  text-rose-200
                  shadow-2xl
                  shadow-rose-500/10
                "
              >
                <Heart
                  size={34}
                  fill="currentColor"
                />
              </motion.div>

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
                  delay: 0.6,
                  duration: 1,
                }}
                className="
                  mt-10
                  text-[9px]
                  uppercase
                  tracking-[0.5em]
                  text-white/25
                "
              >
                And finally...
              </motion.div>

              <motion.h2
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 1,
                  duration: 1,
                }}
                className="
                  mt-6
                  text-4xl
                  font-extralight
                  leading-tight
                  tracking-[-0.05em]
                  sm:text-6xl
                  md:text-7xl
                "
              >
                I LOVE YOU
                <span
                  className="
                    mt-2
                    block
                    bg-gradient-to-r
                    from-white
                    via-rose-100
                    to-pink-200/50
                    bg-clip-text
                    text-transparent
                  "
                >
                  SO MUCH, MAH. 💖
                </span>
              </motion.h2>

              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 1.8,
                  duration: 1,
                }}
                className="
                  mx-auto
                  mt-10
                  max-w-lg
                  text-sm
                  leading-7
                  text-white/30
                "
              >
                Whatever happens,
                whatever tomorrow brings,
                I&apos;ll always wish the
                happiest things for you.
              </motion.p>

              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 2.4,
                }}
                className="
                  mt-12
                  text-[9px]
                  uppercase
                  tracking-[0.4em]
                  text-rose-200/30
                "
              >
                Happy Birthday ❤️
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}