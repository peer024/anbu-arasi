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

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const particles: SparkleParticle[] = [];
    const colors = ["#ffffff", "#ffe4e6", "#fda4af", "#fde047", "#f472b6", "#fed7aa", "#e0e7ff"];

    const addParticle = (x: number, y: number, count = 2, burst = false) => {
      for (let i = 0; i < count; i++) {
        const types: ("star" | "heart" | "diamond")[] = ["star", "heart", "diamond", "star"];
        const type = types[Math.floor(Math.random() * types.length)];
        const speed = burst ? Math.random() * 5 + 2 : Math.random() * 1.5 + 0.5;
        const angle = burst ? Math.random() * Math.PI * 2 : Math.random() * Math.PI * 2;

        particles.push({
          x: x + (Math.random() * 8 - 4),
          y: y + (Math.random() * 8 - 4),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (burst ? 0.5 : 0.8),
          size: burst ? Math.random() * 6 + 3 : Math.random() * 4.5 + 2,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.15,
          type,
        });
      }
    };

    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;

    const onPointerMove = (e: MouseEvent) => {
      const now = Date.now();
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (dist > 6 || now - lastTime > 30) {
        addParticle(e.clientX, e.clientY, 2 + Math.floor(Math.random() * 2));
        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      addParticle(e.clientX, e.clientY, 14, true);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        addParticle(touch.clientX, touch.clientY, 3);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        addParticle(touch.clientX, touch.clientY, 12, true);
      }
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("mousedown", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
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
      // top left curve
      c.bezierCurveTo(
        cx, cy, 
        cx - size / 2, cy, 
        cx - size / 2, cy + topCurveHeight
      );
      // bottom left curve
      c.bezierCurveTo(
        cx - size / 2, cy + (size + topCurveHeight) / 2, 
        cx, cy + (size + topCurveHeight) / 1.2, 
        cx, cy + size
      );
      // bottom right curve
      c.bezierCurveTo(
        cx, cy + (size + topCurveHeight) / 1.2, 
        cx + size / 2, cy + (size + topCurveHeight) / 2, 
        cx + size / 2, cy + topCurveHeight
      );
      // top right curve
      c.bezierCurveTo(
        cx + size / 2, cy, 
        cx, cy, 
        cx, cy + topCurveHeight
      );
      c.closePath();
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= 0.022;
        p.size *= 0.965;

        if (p.alpha <= 0 || p.size < 0.4) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;

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

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[300] h-full w-full"
      aria-hidden="true"
    />
  );
}

export default CursorSparkles;

