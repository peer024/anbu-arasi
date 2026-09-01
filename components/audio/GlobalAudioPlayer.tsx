"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  Disc3,
  Music2,
} from "lucide-react";
import { sounds } from "@/lib/soundEffects";

const DEFAULT_PLAYLIST = [
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

type GlobalAudioPlayerProps = {
  customSong?: { title: string; src: string };
  autoPlay?: boolean;
};

export function GlobalAudioPlayer({
  customSong,
  autoPlay = true,
}: GlobalAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const playlist = customSong ? [customSong, ...DEFAULT_PLAYLIST] : DEFAULT_PLAYLIST;
  const currentSong = playlist[currentTrackIndex % playlist.length];

  // Initialize and handle automatic playback
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = currentSong.src;
    audio.volume = 1;
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

    const handleTimeUpdate = () => {
      if (!audio.duration) return;
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      // Auto play next song in cycle
      setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    // 1. Attempt immediate autoplay
    if (autoPlay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay was prevented by browser policy.
            // Setup one-time global user-gesture listeners to unlock audio instantly on first interaction.
            const unlockAudio = () => {
              if (!audioRef.current) return;
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                })
                .catch(() => {});

              // Clean up listeners once unlocked
              window.removeEventListener("pointerdown", unlockAudio);
              window.removeEventListener("touchstart", unlockAudio);
              window.removeEventListener("click", unlockAudio);
              window.removeEventListener("keydown", unlockAudio);
            };

            window.addEventListener("pointerdown", unlockAudio, { once: true, passive: true });
            window.addEventListener("touchstart", unlockAudio, { once: true, passive: true });
            window.addEventListener("click", unlockAudio, { once: true });
            window.addEventListener("keydown", unlockAudio, { once: true });
          });
      }
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  }, []);

  // Update track when track index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const newSong = playlist[currentTrackIndex % playlist.length];
    if (audio.src !== window.location.origin + newSong.src && !audio.src.endsWith(newSong.src)) {
      audio.src = newSong.src;
      audio.currentTime = 0;
      if (isPlaying) {
        audio.play().catch(() => {});
      }
    }
  }, [currentTrackIndex, playlist, isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      sounds.playChime(750, 0.25);
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const playNextTrack = () => {
    sounds.playChime(850, 0.2);
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = percent * audio.duration;
    setProgress(percent * 100);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="
          relative mx-auto w-full sm:w-[350px] overflow-hidden rounded-[26px]
          border border-white/[0.14]
          bg-gradient-to-r from-[#140c12]/95 via-[#0e070c]/90 to-[#160a12]/95
          p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_35px_rgba(251,113,133,0.18)]
          backdrop-blur-3xl transition-all
        "
      >
        {/* Top Mini Bar / Controls */}
        <div className="flex items-center justify-between gap-3">
          {/* Spinning Vinyl Record Icon */}
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-rose-300/40 bg-gradient-to-br from-neutral-900 via-rose-950/70 to-neutral-950 text-rose-200 shadow-md"
            >
              <Disc3 size={18} className="text-rose-200" />
              <div className="absolute h-2 w-2 rounded-full bg-rose-400/80 shadow-[0_0_6px_#f43f5e]" />
            </motion.div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.25em] text-rose-300/70 font-medium">
                <Music2 size={9} />
                <span>Track {currentTrackIndex + 1} of {playlist.length}</span>
              </div>
              <div className="truncate font-serif text-xs sm:text-sm font-light text-rose-100/90">
                {currentSong.title}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Live Equalizer Bars */}
            <div className="hidden sm:flex h-5 items-end gap-0.5 px-1">
              {[0.5, 1, 0.35, 0.85, 0.6].map((scale, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isPlaying ? ["20%", `${scale * 100}%`, "30%"] : "20%",
                  }}
                  transition={{
                    duration: 0.5 + i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-1 rounded-full bg-rose-400/80"
                />
              ))}
            </div>

            {/* Play / Pause */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause music" : "Play music"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-md hover:bg-rose-50"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
            </motion.button>

            {/* Next Track */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={playNextTrack}
              aria-label="Next track"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
            >
              <SkipForward size={13} />
            </motion.button>

            {/* Mute Toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </motion.button>
          </div>
        </div>

        {/* Scrub Progress Bar */}
        <div
          onClick={handleSeek}
          className="group relative mt-2.5 h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-white/10"
        >
          <div
            className="h-full bg-gradient-to-r from-rose-400 via-rose-300 to-amber-200 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default GlobalAudioPlayer;

