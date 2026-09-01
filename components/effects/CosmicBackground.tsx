"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
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
    const isMobile = window.innerWidth < 768;

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

    const starColors = [
      "#ffffff",
      "#ffe4e6",
      "#fed7aa",
      "#fbcfe8",
      "#e0e7ff",
      "#fde047",
    ];

    const starCount = isMobile ? 55 : 140;
    const stars: Star[] = Array.from({ length: starCount }, (_, i) => {
      const isCross = i % (isMobile ? 20 : 12) === 0;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1.6 + 0.5,
        size: isCross ? Math.random() * 1.8 + 1.4 : Math.random() * 1.4 + 0.5,
        baseAlpha: Math.random() * 0.6 + 0.25,
        alpha: 0.5,
        twinkleSpeed: Math.random() * 0.025 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        isCross,
      };
    });

    const dustCount = isMobile ? 12 : 30;
    const dustParticles: FloatingDust[] = Array.from({ length: dustCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.3 - 0.1,
      size: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.5 + 0.2,
      baseAlpha: Math.random() * 0.5 + 0.2,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));

    const meteors: Meteor[] = [];
    const meteorColors = ["#ffffff", "#fda4af", "#fde047", "#f472b6"];

    const createMeteor = () => {
      meteors.push({
        x: Math.random() * width * 1.2,
        y: Math.random() * (height * 0.35),
        length: Math.random() * 80 + 50,
        speed: Math.random() * 8 + 7,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        alpha: 1,
        color: meteorColors[Math.floor(Math.random() * meteorColors.length)],
        active: true,
      });
    };

    let lastMeteorTime = Date.now();

    const drawCrossStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      color: string,
      alpha: number
    ) => {
      c.globalAlpha = alpha;
      c.strokeStyle = color;
      c.fillStyle = color;
      c.lineWidth = 1;

      c.beginPath();
      c.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
      c.fill();

      c.beginPath();
      c.moveTo(cx - size * 2.2, cy);
      c.lineTo(cx + size * 2.2, cy);
      c.stroke();

      c.beginPath();
      c.moveTo(cx, cy - size * 2.2);
      c.lineTo(cx, cy + size * 2.2);
      c.stroke();
    };

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // 1. DUST
      for (let i = 0; i < dustParticles.length; i++) {
        const dust = dustParticles[i];
        dust.x += dust.vx;
        dust.y += dust.vy;

        if (dust.y < -10) {
          dust.y = height + 10;
          dust.x = Math.random() * width;
        }
        if (dust.x < -10) dust.x = width + 10;
        if (dust.x > width + 10) dust.x = -10;

        const pulse = Math.sin(time * 2 + dust.x) * 0.15;
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
        ctx.fillStyle = dust.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(0.7, dust.baseAlpha + pulse));
        ctx.fill();
      }

      // 2. STARS
      const mouse = mousePosRef.current;
      const mouseRadius = 140;
      const mouseRadiusSq = mouseRadius * mouseRadius;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        star.y += star.z * 0.06;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        star.alpha =
          star.baseAlpha +
          Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.3;
        star.alpha = Math.max(0.15, Math.min(0.95, star.alpha));

        if (star.isCross) {
          drawCrossStar(ctx, star.x, star.y, star.size, star.color, star.alpha);
        } else {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha;
          ctx.fill();
        }

        // Desktop Interactive Constellations
        if (!isMobile) {
          const dx = mouse.x - star.x;
          const dy = mouse.y - star.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRadiusSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / mouseRadius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(251, 113, 133, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            if (i + 1 < stars.length) {
              const s2 = stars[i + 1];
              const d2Sq = (star.x - s2.x) ** 2 + (star.y - s2.y) ** 2;
              if (d2Sq < 3600) {
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
      }

      ctx.globalAlpha = 1;

      // 3. METEORS
      if (Date.now() - lastMeteorTime > 3400 && Math.random() < 0.04) {
        createMeteor();
        lastMeteorTime = Date.now();
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        if (!m.active) continue;

        m.x -= Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= 0.016;

        if (m.alpha <= 0 || m.x < -100 || m.y > height + 100) {
          m.active = false;
          meteors.splice(i, 1);
          continue;
        }

        const tailX = m.x + Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, m.color);
        grad.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = m.alpha;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }

      ctx.globalAlpha = 1;
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
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

export default CosmicBackground;



