"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: string;
  name: string;
  designer: string;
  price: number;
  currency: string;
  image: string;
  index: number;
}

export default function ProductCard({
  id,
  name,
  designer,
  price,
  currency,
  image,
  index,
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 6;
    const rotateX = -((y - centerY) / centerY) * 6;
    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`
    );
  }

  function handleMouseLeave() {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/product/${id}`}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transform }}
          className="tilt-card group relative overflow-hidden bg-[#141414] rounded-sm cursor-pointer"
        >
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="p-5">
            <p className="text-[10px] tracking-widest2 uppercase text-clay mb-1">
              {designer}
            </p>
            <h3 className="font-display text-lg text-bone mb-1">{name}</h3>
            <p className="text-sm text-bone/60">
              {currency} {price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
