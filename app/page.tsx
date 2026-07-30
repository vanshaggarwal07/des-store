"use client";

import HeroReveal from "@/components/HeroReveal";
import ProductCard from "@/components/ProductCard";
import { useFeaturedProducts } from "@/lib/useStore";

export default function Home() {
  const featured = useFeaturedProducts();

  return (
    <div className="bg-ink min-h-screen">
      <HeroReveal />

      <section className="px-8 md:px-16 py-24">
        <div className="mb-14 text-center">
          <p className="text-xs tracking-widest2 uppercase text-clay mb-3">
            Curated
          </p>
          <h2 className="font-display text-4xl text-bone">Featured Pieces</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured === undefined && (
            <p className="text-bone/50 col-span-full text-center">Loading collection…</p>
          )}
          {featured?.length === 0 && (
            <p className="text-bone/50 col-span-full text-center">
              No products yet — add some from the Convex dashboard.
            </p>
          )}
          {featured?.map((product, i) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              designer={product.designer}
              price={product.price}
              currency={product.currency}
              image={product.images[0]}
              index={i}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
