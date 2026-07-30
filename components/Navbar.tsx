"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 md:px-16 py-6 transition-all duration-500 ${
        scrolled ? "bg-ink/90 backdrop-blur-md py-4" : "bg-transparent"
      }`}
    >
      <Link href="/" className="font-display text-2xl tracking-widest2 text-bone">
        MAISON
      </Link>

      <div className="hidden md:flex gap-10 text-xs tracking-widest2 uppercase text-bone/80">
        <Link href="/shop" className="hover:text-clay transition-colors">
          Collection
        </Link>
        <Link href="/shop?category=Outerwear" className="hover:text-clay transition-colors">
          Outerwear
        </Link>
        <Link href="/shop?category=Accessories" className="hover:text-clay transition-colors">
          Accessories
        </Link>
      </div>

      <Link href="/cart" className="text-bone hover:text-clay transition-colors">
        <ShoppingBag size={20} strokeWidth={1.5} />
      </Link>
    </nav>
  );
}
