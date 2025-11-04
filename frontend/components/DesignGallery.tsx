"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

const initialImages = [
  "/_MG_0268.jpg",
  "/_MG_0296.jpg",
  "/_MG_0303.jpg",
  "/_MG_0307.jpg",
  "/_MG_0312.jpg",
  "/_MG_0336.jpg",
  "/_MG_0354.jpg",
  "/_MG_0355.jpg",
];

export default function DesignGallery() {
  const [images, setImages] = useState(initialImages);
  const timer = useRef<number | null>(null);
  const delay = 2800;

  useEffect(() => {
    timer.current = window.setInterval(() => {
      setImages((prev) => {
        if (prev.length <= 1) return prev;
        const next = [...prev.slice(1), prev[0]];
        return next;
      });
    }, delay);

    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    };
  }, []);

  return (
    <div className="w-full max-w-[480px] h-[360px] md:h-[460px] relative flex items-center justify-center">
      {images.map((src, i) => {
        const baseWidth = 300;
        const baseHeight = 380;

        const width = baseWidth - (i === 2 ? 20 : 0);
        const height = baseHeight - (i === 2 ? 40 : 0);

        const transforms = [
          `translate3d(0, -8px, 0) rotate(0deg) scale(1.02)`,
          `translate3d(0, 6px, 0) rotate(6deg) scale(0.98)`,
          `translate3d(0, 26px, 0) rotate(-6deg) scale(0.94)`,
        ];

        const style: React.CSSProperties = {
          width,
          height,
          zIndex: 30 - i,
          transform: transforms[i] || transforms[2],
          transition: "transform 700ms cubic-bezier(.2,.9,.2,1)",
          boxShadow: "0 30px 60px rgba(20,20,20,0.25)",
          borderRadius: 18,
          overflow: "hidden",
          background: "rgba(255,255,255,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform",
        };

        if (i === 1) style.left = 18;
        if (i === 2) style.left = -8;

        return (
          <div
            key={src}
            className="absolute rounded-[18px] overflow-hidden border border-white/10 flex items-center justify-center"
            style={style}
          >
            <Image src={src} alt={`gallery-${i}`} fill className="object-cover" style={{ pointerEvents: 'none' }} />
          </div>
        );
      })}

      <div
        aria-hidden
        className="absolute rounded-[22px]"
        style={{
          width: 360,
          height: 240,
          bottom: -18,
          right: 10,
          background: "linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0))",
          filter: "blur(22px)",
          zIndex: 0,
        }}
      />
    </div>
  );
}
