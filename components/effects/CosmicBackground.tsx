"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number; // For parallax depth
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
  isCross: boolean;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  color: string;
  active: boolean;
}

interface FloatingDust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  color: string;
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePosRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Palette of celestial luxury tones
    const starColors = [
      "#ffffff",
      "#ffe4e6", // Rose
      "#fed7aa", // Amber/Gold
      "#fbcfe8", // Pink
      "#e0e7ff", // Violet
      "#fde047", // Pure Gold
    ];

    // 1. Generate 220 3D Depth Stars
    const stars: Star[] = Array.from({ length: 220 }, (_, i) => {
      const isCross = i % 14 === 0;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5,
        size: isCross ? Math.random() * 2 + 1.8 : Math.random() * 1.6 + 0.5,
        baseAlpha: Math.random() * 0.7 + 0.25,
        alpha: 0.5,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        isCross,
      };
    });

    // 2. Floating Romantic Stardust Particles (60 particles)
    const dustParticles: FloatingDust[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.4 - 0.15,
      size: Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.6 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.2,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));

    // 3. Meteors Pool
    const meteors: Meteor[] = [];
    const meteorColors = ["#ffffff", "#fda4af", "#fde047", "#f472b6"];

    const createMeteor = () => {
      meteors.push({
        x: Math.random() * width * 1.3,
        y: Math.random() * (height * 0.4),
        length: Math.random() * 100 + 60,
        speed: Math.random() * 9 + 8,
        angle: Math.PI / 4 + (Math.random() * 0.25 - 0.12),
        alpha: 1,
        color: meteorColors[Math.floor(Math.random() * meteorColors.length)],
        active: true,
      });
    };

    let lastMeteorTime = Date.now();

    // Helper: Draw 4-point cross star
    const drawCrossStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      color: string,
      alpha: number
    ) => {
      c.save();
      c.globalAlpha = alpha;
      c.strokeStyle = color;
      c.fillStyle = color;
      c.lineWidth = 1;

      // Outer glow
      c.beginPath();
      c.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
      c.shadowBlur = 12;
      c.shadowColor = color;
      c.fill();

      // Horizontal ray
      c.beginPath();
      c.moveTo(cx - size * 2.5, cy);
      c.lineTo(cx + size * 2.5, cy);
      c.stroke();

      // Vertical ray
      c.beginPath();
      c.moveTo(cx, cy - size * 2.5);
      c.lineTo(cx, cy + size * 2.5);
      c.stroke();

      c.restore();
    };

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // ===============================================
      // 1. DYNAMIC NEBULA CLOUDS & DEEP SPACE BACKGROUND
      // ===============================================
      const bgGrad = ctx.createRadialGradient(
        width * 0.5 + Math.sin(time * 0.2) * 100,
        height * 0.4 + Math.cos(time * 0.15) * 80,
        80,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.9
      );
      bgGrad.addColorStop(0, "#100618"); // Deep celestial violet
      bgGrad.addColorStop(0.35, "#09030e"); // Romantic midnight
      bgGrad.addColorStop(0.7, "#040207");
      bgGrad.addColorStop(1, "#020104");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Flowing Romantic Nebula Orbs
      const nebulaOrbs = [
        { x: width * 0.2 + Math.sin(time * 0.2) * 60, y: height * 0.3 + Math.cos(time * 0.3) * 50, r: 350, c: "rgba(244, 63, 94, 0.06)" },
        { x: width * 0.8 + Math.cos(time * 0.18) * 80, y: height * 0.6 + Math.sin(time * 0.25) * 60, r: 400, c: "rgba(217, 70, 239, 0.05)" },
        { x: width * 0.5 + Math.sin(time * 0.3) * 70, y: height * 0.8 + Math.cos(time * 0.2) * 40, r: 320, c: "rgba(251, 191, 36, 0.04)" },
      ];

      for (const orb of nebulaOrbs) {
        const nGrad = ctx.createRadialGradient(orb.x, orb.y, 10, orb.x, orb.y, orb.r);
        nGrad.addColorStop(0, orb.c);
        nGrad.addColorStop(1, "transparent");
        ctx.fillStyle = nGrad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ===============================================
      // 2. FLOATING STARDUST MAGIC PARTICLES
      // ===============================================
      for (const dust of dustParticles) {
        dust.x += dust.vx;
        dust.y += dust.vy;

        if (dust.y < -10) {
          dust.y = height + 10;
          dust.x = Math.random() * width;
        }
        if (dust.x < -10) dust.x = width + 10;
        if (dust.x > width + 10) dust.x = -10;

        const pulse = Math.sin(time * 2 + dust.x) * 0.2;
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
        ctx.fillStyle = dust.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(0.8, dust.baseAlpha + pulse));
        ctx.shadowBlur = 10;
        ctx.shadowColor = dust.color;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // ===============================================
      // 3. STARS & INTERACTIVE CONSTELLATION WEB
      // ===============================================
      const mouse = mousePosRef.current;
      const mouseRadius = 160;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Slight drift based on depth
        star.y += star.z * 0.08;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        star.alpha =
          star.baseAlpha +
          Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.35;
        star.alpha = Math.max(0.15, Math.min(1, star.alpha));

        if (star.isCross) {
          drawCrossStar(ctx, star.x, star.y, star.size, star.color, star.alpha);
        } else {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha;
          if (star.size > 1.3) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = star.color;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Interactive constellation line to mouse
        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius) {
          const lineAlpha = (1 - dist / mouseRadius) * 0.35;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(251, 113, 133, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Connect with adjacent stars nearby
          for (let j = i + 1; j < Math.min(i + 5, stars.length); j++) {
            const s2 = stars[j];
            const d2 = Math.hypot(star.x - s2.x, star.y - s2.y);
            if (d2 < 70) {
              ctx.beginPath();
              ctx.moveTo(star.x, star.y);
              ctx.lineTo(s2.x, s2.y);
              ctx.strokeStyle = `rgba(251, 191, 36, ${lineAlpha * 0.3})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;

      // ===============================================
      // 4. METEORS / SHOOTING STARS (FREQUENT & GLOWING)
      // ===============================================
      if (Date.now() - lastMeteorTime > 2800 && Math.random() < 0.05) {
        createMeteor();
        lastMeteorTime = Date.now();
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        if (!m.active) continue;

        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= 0.014;

        if (m.alpha <= 0 || m.x > width + 150 || m.y > height + 150) {
          m.active = false;
          meteors.splice(i, 1);
          continue;
        }

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const meteorGrad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        meteorGrad.addColorStop(0, "transparent");
        meteorGrad.addColorStop(0.6, `rgba(251, 113, 133, ${m.alpha * 0.6})`);
        meteorGrad.addColorStop(0.9, `rgba(251, 191, 36, ${m.alpha * 0.8})`);
        meteorGrad.addColorStop(1, `rgba(255, 255, 255, ${m.alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#f43f5e";
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Meteor Head Glow
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = "#fde047";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-95 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
}

export default CosmicBackground;

