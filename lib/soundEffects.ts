// Web Audio API procedural sound synthesizer for subtle luxury sound effects
// 100% self-contained, no external asset load failures!

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  // Soft romantic celesta / music box chime
  public playChime(freq = 587.33, duration = 1.2) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.01, now + duration);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore audio errors silently
    }
  }

  // Gentle stardust sparkle twinkle
  public playSparkle() {
    if (this.isMuted) return;
    const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq, 0.6);
      }, idx * 60);
    });
  }

  // Soft air whoosh / candle puff
  public playCandleBlow() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.4);
    } catch {}
  }

  // Wax seal breaking pop / snap
  public playWaxSeal() {
    if (this.isMuted) return;
    this.playChime(440, 0.4);
    setTimeout(() => {
      this.playSparkle();
    }, 150);
  }

  // Romantic grand harp arpeggio for celebration
  public playCelebration() {
    if (this.isMuted) return;
    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // C major 7 arpeggio
    chord.forEach((freq, i) => {
      setTimeout(() => {
        this.playChime(freq, 1.8);
      }, i * 90);
    });
  }
}

export const sounds = new SoundEngine();
