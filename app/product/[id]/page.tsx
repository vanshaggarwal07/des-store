"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useProduct } from "@/lib/useStore";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = useProduct(params.id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const router = useRouter();

  if (product === undefined) {
    return <div className="bg-ink min-h-screen pt-32 text-center text-bone/50">Loading…</div>;
  }
  if (product === null) {
    return <div className="bg-ink min-h-screen pt-32 text-center text-bone/50">Product not found.</div>;
  }

  function handleAddToCart() {
    if (!selectedSize) return;
    const cartRaw = localStorage.getItem("cart");
    const cart = cartRaw ? JSON.parse(cartRaw) : [];
    cart.push({
      productId: product!._id,
      name: product!.name,
      designer: product!.designer,
      price: product!.price,
      currency: product!.currency,
      image: product!.images[0],
      size: selectedSize,
      quantity: 1,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/cart");
  }

  return (
    <div className="bg-ink min-h-screen pt-28 px-8 md:px-16 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 max-w-6xl mx-auto">
        <div>
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="aspect-[3/4] overflow-hidden rounded-sm bg-[#141414] mb-4"
          >
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-20 rounded-sm overflow-hidden border ${
                  selectedImage === i ? "border-clay" : "border-transparent opacity-60"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs tracking-widest2 uppercase text-clay mb-2">
            {product.designer}
          </p>
          <h1 className="font-display text-4xl text-bone mb-4">{product.name}</h1>
          <p className="text-xl text-bone/80 mb-8">
            {product.currency} {product.price.toLocaleString("en-IN")}
          </p>
          <p className="text-bone/60 leading-relaxed mb-10">{product.description}</p>

          <div className="mb-10">
            <p className="text-xs tracking-widest2 uppercase text-bone/50 mb-3">Size</p>
            <div className="flex gap-3 flex-wrap">
              {product.sizes.map((size) => {
                const inStock = (product.stock[size] ?? 0) > 0;
                return (
                  <button
                    key={size}
                    disabled={!inStock}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border text-sm transition-colors ${
                      selectedSize === size
                        ? "border-clay bg-clay text-ink"
                        : inStock
                        ? "border-bone/30 text-bone hover:border-clay"
                        : "border-bone/10 text-bone/20 cursor-not-allowed line-through"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="w-full py-4 bg-bone text-ink text-xs tracking-widest2 uppercase hover:bg-clay transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {selectedSize ? "Add to Bag" : "Select a Size"}
          </button>
        </div>
      </div>
    </div>
  );
}
