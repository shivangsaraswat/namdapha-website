"use client";

import React, { useEffect, useState, useRef } from "react";

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
    // cycle the array so the front card moves to the back and next card reveals
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
        // i === 0 => front (visible)
        // i === 1 => second (revealing)
        // i >= 2 => back
        const baseWidth = 300; // rectangle width
        const baseHeight = 380; // rectangle height

        const width = baseWidth - (i === 2 ? 20 : 0);
        const height = baseHeight - (i === 2 ? 40 : 0);

        const transforms = [
          `translateY(-8px) rotate(0deg) scale(1.02)`, // front
          `translateY(6px) rotate(6deg) scale(0.98)`, // second
          `translateY(26px) rotate(-6deg) scale(0.94)`, // back
        ];

        const style: React.CSSProperties = {
          width,
          height,
          zIndex: 30 - i,
          transform: transforms[i] || transforms[2],
          transition: "transform 700ms cubic-bezier(.2,.9,.2,1), opacity 700ms",
          boxShadow: "0 30px 60px rgba(20,20,20,0.25)",
          borderRadius: 18,
          overflow: "hidden",
          background: "rgba(255,255,255,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        };

        // slightly offset each card horizontally for a stacked look
        if (i === 1) style.left = 18;
        if (i === 2) style.left = -8;

        return (
          <div
            key={src}
            className={`absolute rounded-[18px] overflow-hidden border border-white/10 flex items-center justify-center`}            
            style={style}
          >
            <img src={src} alt={`gallery-${i}`} className="w-full h-full object-cover" /> {/* eslint-disable-line @next/next/no-img-element */}
          </div>
        );
      })}

      {/* subtle pulse underlay */}
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
