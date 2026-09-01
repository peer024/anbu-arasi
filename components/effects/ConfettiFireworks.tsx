"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  rotation: number;
  vRot: number;
  gravity: number;
  shape: "circle" | "heart" | "ribbon";
  decay: number;
}

interface ConfettiFireworksProps {
  active: boolean;
  onComplete?: () => void;
}

export function ConfettiFireworks({ active, onComplete }: ConfettiFireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

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

    const particles: Particle[] = [];
    const colors = [
      "#fb7185", // rose-400
      "#f43f5e", // rose-500
      "#ec4899", // pink-500
      "#e879f9", // fuchsia-400
      "#facc15", // yellow-400 gold
      "#ffffff",
      "#fef08a", // soft gold
    ];

    // Helper: Burst fireworks from specific point
    const burst = (cx: number, cy: number, count = 60) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 3;
        const shapes: ("circle" | "heart" | "ribbon")[] = ["heart", "ribbon", "circle"];
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: Math.random() * 8 + 4,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
          gravity: 0.15,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          decay: Math.random() * 0.008 + 0.006,
        });
      }
    };

    // Staggered multiple firework launches
    burst(width * 0.5, height * 0.45, 90);
    setTimeout(() => burst(width * 0.25, height * 0.35, 60), 300);
    setTimeout(() => burst(width * 0.75, height * 0.35, 60), 600);
    setTimeout(() => burst(width * 0.5, height * 0.3, 100), 1100);

    const drawHeart = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      // top left curve
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      // bottom left curve
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
      // bottom right curve
      c.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      // top right curve
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
    };

    const startTime = Date.now();
    const duration = 6000;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > height + 50) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.shape === "heart") {
          drawHeart(ctx, p.size);
          ctx.fill();
        } else if (p.shape === "ribbon") {
          ctx.fillRect(-p.size / 2, -p.size / 6, p.size, p.size / 3);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (Date.now() - startTime < duration || particles.length > 0) {
        animId = requestAnimationFrame(render);
      } else {
        if (onComplete) onComplete();
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[120] h-full w-full"
      aria-hidden="true"
    />
  );
}
