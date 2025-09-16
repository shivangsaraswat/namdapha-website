"use client";
import { useEffect, useRef } from "react";

export default function LightningBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);

    function random(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    class Ray {
      x: number;
      y: number;
      length: number;
      path: { x: number; y: number }[];
      life: number;

      constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.length = random(80, 180);
        this.path = [{ x: this.x, y: this.y }];
        this.life = 0;

        let angle = random(0, Math.PI * 2);
        let curX = this.x;
        let curY = this.y;

        for (let i = 0; i < this.length; i++) {
          curX += Math.cos(angle) * 4;
          curY += Math.sin(angle) * 4;

          angle += random(-0.3, 0.3); // jagged lightning
          this.path.push({ x: curX, y: curY });
        }
      }

      draw() {
        ctx!.beginPath();
        ctx!.moveTo(this.path[0].x, this.path[0].y);

        for (let i = 1; i < this.path.length; i++) {
          ctx!.lineTo(this.path[i].x, this.path[i].y);
        }

        const alpha = 1 - this.life / 20;
        ctx!.strokeStyle = `rgba(180,100,255,${alpha})`; // purple glow
        ctx!.lineWidth = 2;
        ctx!.shadowBlur = 20;
        ctx!.shadowColor = "white";
        ctx!.stroke();
      }

      update() {
        this.life++;
        this.draw();
      }

      isDead() {
        return this.life > 20;
      }
    }

    let rays: Ray[] = [];

    function animate() {
      ctx!.clearRect(0, 0, width, height);

      if (Math.random() < 0.2) {
        rays.push(new Ray());
      }

      rays.forEach((ray, i) => {
        ray.update();
        if (ray.isDead()) {
          rays.splice(i, 1);
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
