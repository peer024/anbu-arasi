"use client";

import { useEffect, useRef } from "react";

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  rotation: number;
  vRot: number;
  type: "star" | "heart" | "diamond";
}

export function CursorSparkles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number | null = null;
    let isRunning = false;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const isMobile = window.innerWidth < 768;
    const maxParticles = isMobile ? 20 : 50;
    const particles: SparkleParticle[] = [];
    const colors = ["#ffffff", "#ffe4e6", "#fda4af", "#fde047", "#f472b6", "#fed7aa", "#e0e7ff"];

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(loop);
      }
    };

    const addParticle = (x: number, y: number, count = 2, burst = false) => {
      if (particles.length >= maxParticles) return;

      const spawnCount = Math.min(count, maxParticles - particles.length);
      for (let i = 0; i < spawnCount; i++) {
        const types: ("star" | "heart" | "diamond")[] = ["star", "heart", "diamond", "star"];
        const type = types[Math.floor(Math.random() * types.length)];
        const speed = burst ? Math.random() * 4 + 1.5 : Math.random() * 1.4 + 0.4;
        const angle = Math.random() * Math.PI * 2;

        particles.push({
          x: x + (Math.random() * 6 - 3),
          y: y + (Math.random() * 6 - 3),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (burst ? 0.4 : 0.6),
          size: burst ? Math.random() * 4.5 + 2.5 : Math.random() * 3.5 + 1.8,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.12,
          type,
        });
      }
      startLoop();
    };

    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;

    const onPointerMove = (e: MouseEvent) => {
      const now = Date.now();
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (dist > 8 || now - lastTime > 40) {
        addParticle(e.clientX, e.clientY, 2);
        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      addParticle(e.clientX, e.clientY, isMobile ? 8 : 12, true);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        addParticle(touch.clientX, touch.clientY, 8, true);
      }
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("mousedown", onPointerDown, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    // Draw 4-point sparkle star
    const drawStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      c.beginPath();
      c.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < 4; i++) {
        const rot = (Math.PI / 2) * i;
        c.lineTo(cx + Math.cos(rot - Math.PI / 2) * outerRadius, cy + Math.sin(rot - Math.PI / 2) * outerRadius);
        c.lineTo(cx + Math.cos(rot - Math.PI / 4) * innerRadius, cy + Math.sin(rot - Math.PI / 4) * innerRadius);
      }
      c.closePath();
    };

    // Draw Romantic Heart
    const drawHeart = (c: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
      const topCurveHeight = size * 0.3;
      c.beginPath();
      c.moveTo(cx, cy + topCurveHeight);
      c.bezierCurveTo(cx, cy, cx - size / 2, cy, cx - size / 2, cy + topCurveHeight);
      c.bezierCurveTo(cx - size / 2, cy + (size + topCurveHeight) / 2, cx, cy + (size + topCurveHeight) / 1.2, cx, cy + size);
      c.bezierCurveTo(cx, cy + (size + topCurveHeight) / 1.2, cx + size / 2, cy + (size + topCurveHeight) / 2, cx + size / 2, cy + topCurveHeight);
      c.bezierCurveTo(cx + size / 2, cy, cx, cy, cx, cy + topCurveHeight);
      c.closePath();
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= 0.026;
        p.size *= 0.96;

        if (p.alpha <= 0 || p.size < 0.4) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;

        if (p.type === "heart") {
          drawHeart(ctx, 0, -p.size * 0.5, p.size);
        } else if (p.type === "diamond") {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.7, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.7, 0);
          ctx.closePath();
        } else {
          drawStar(ctx, 0, 0, p.size, p.size * 0.32);
        }
        ctx.fill();
        ctx.restore();
      }

      if (particles.length > 0) {
        animId = requestAnimationFrame(loop);
      } else {
        isRunning = false;
        ctx.clearRect(0, 0, width, height);
      }
    };

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("touchstart", onTouchStart);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[300] h-full w-full"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    />
  );
}

export default CursorSparkles;


