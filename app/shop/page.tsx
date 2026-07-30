"use client";

import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Suspense } from "react";
import { useProductList } from "@/lib/useStore";

function ShopGrid() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const products = useProductList(category);

  return (
    <div className="bg-ink min-h-screen pt-32 px-8 md:px-16 pb-24">
      <div className="mb-14">
        <p className="text-xs tracking-widest2 uppercase text-clay mb-3">
          {category ?? "Full Collection"}
        </p>
        <h1 className="font-display text-4xl text-bone">Shop</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products === undefined && (
          <p className="text-bone/50 col-span-full text-center">Loading…</p>
        )}
        {products?.length === 0 && (
          <p className="text-bone/50 col-span-full text-center">No products found.</p>
        )}
        {products?.map((product, i) => (
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
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="bg-ink min-h-screen" />}>
      <ShopGrid />
    </Suspense>
  );
}
