"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance
      gsap.fromTo(
        titleRef.current,
        { y: 80, opacity: 0, letterSpacing: "0.6em" },
        { y: 0, opacity: 1, letterSpacing: "0.35em", duration: 1.4, ease: "power3.out", delay: 0.2 }
      );

      gsap.fromTo(
        imgRef.current,
        { clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1.6,
          ease: "power4.out",
          delay: 0.1,
        }
      );

      // Scroll-driven parallax depth
      gsap.to(imgRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(titleRef.current, {
        yPercent: -40,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "60% top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-ink">
      <div ref={imgRef} className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1974&auto=format&fit=crop"
          alt="Editorial fashion"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h1
          ref={titleRef}
          className="font-display text-5xl md:text-8xl tracking-widest2 text-bone uppercase"
        >
          Maison
        </h1>
        <p className="mt-6 text-bone/70 text-sm tracking-[0.3em] uppercase">
          Autumn / Winter Collection
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-bone/50 text-[10px] tracking-widest2 uppercase animate-bounce">
        Scroll
      </div>
    </div>
  );
}
