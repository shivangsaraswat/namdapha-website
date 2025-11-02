"use client";
import { useEffect, useRef } from "react";

export default function GlowingBackground() {
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

    class GlowOrb {
      x: number;
      y: number;
      radius: number;
      baseRadius: number;
      color: string;
      speed: number;
      angle: number;
      pulseSpeed: number;
      pulsePhase: number;

      constructor() {
        const centerX = width / 2;
        const centerY = height / 2;
        const distance = Math.random() * 150 + 50;
        this.angle = Math.random() * Math.PI * 2;
        
        this.x = centerX + Math.cos(this.angle) * distance;
        this.y = centerY + Math.sin(this.angle) * distance;
        this.baseRadius = Math.random() * 40 + 30;
        this.radius = this.baseRadius;
        
        const colors = [
          "rgba(138, 43, 226, 0.3)",  // Purple
          "rgba(75, 0, 130, 0.3)",    // Indigo
          "rgba(147, 112, 219, 0.3)", // Medium Purple
          "rgba(186, 85, 211, 0.3)",  // Medium Orchid
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        this.speed = Math.random() * 0.002 + 0.001;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      draw() {
        const gradient = ctx!.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        
        gradient.addColorStop(0, this.color.replace("0.3", "0.6"));
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, this.color.replace("0.3", "0"));

        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx!.fillStyle = gradient;
        ctx!.fill();
      }

      update() {
        this.angle += this.speed;
        this.pulsePhase += this.pulseSpeed;
        
        const centerX = width / 2;
        const centerY = height / 2;
        const distance = Math.random() * 150 + 50;
        
        this.x = centerX + Math.cos(this.angle) * distance;
        this.y = centerY + Math.sin(this.angle) * distance;
        
        this.radius = this.baseRadius + Math.sin(this.pulsePhase) * 10;
        
        this.draw();
      }
    }

    const orbs: GlowOrb[] = [];
    for (let i = 0; i < 8; i++) {
      orbs.push(new GlowOrb());
    }

    function animate() {
      ctx!.clearRect(0, 0, width, height);

      orbs.forEach(orb => orb.update());

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
