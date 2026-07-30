"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";

interface CartItem {
  productId: string;
  name: string;
  designer: string;
  price: number;
  currency: string;
  image: string;
  size: string;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    setCart(raw ? JSON.parse(raw) : []);
  }, []);

  function removeItem(index: number) {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-ink min-h-screen pt-32 px-8 md:px-16 pb-24">
      <h1 className="font-display text-4xl text-bone mb-12">Your Bag</h1>

      {cart.length === 0 ? (
        <div className="text-center text-bone/50 py-20">
          <p className="mb-6">Your bag is empty.</p>
          <Link href="/shop" className="text-clay underline underline-offset-4">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {cart.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-6 border-b border-bone/10 py-6"
            >
              <div className="w-20 h-24 bg-[#141414] overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] tracking-widest2 uppercase text-clay mb-1">
                  {item.designer}
                </p>
                <p className="font-display text-lg text-bone">{item.name}</p>
                <p className="text-sm text-bone/50">
                  Size {item.size} · Qty {item.quantity}
                </p>
              </div>
              <p className="text-bone/80">
                {item.currency} {(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
              <button
                onClick={() => removeItem(i)}
                className="text-bone/40 hover:text-rust transition-colors"
              >
                <Trash2 size={18} strokeWidth={1.5} />
              </button>
            </div>
          ))}

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-bone/20">
            <p className="text-bone/70 tracking-widest2 uppercase text-xs">Total</p>
            <p className="font-display text-2xl text-bone">
              {cart[0]?.currency} {total.toLocaleString("en-IN")}
            </p>
          </div>

          <Link href="/checkout">
            <button className="w-full mt-8 py-4 bg-bone text-ink text-xs tracking-widest2 uppercase hover:bg-clay transition-colors">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
