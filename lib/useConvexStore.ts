"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import type { LocalOrderInput, Product } from "@/lib/catalog";

export function useFeaturedProducts(): Product[] | undefined {
  return useQuery(api.products.getFeatured) as Product[] | undefined;
}

export function useProductList(category?: string): Product[] | undefined {
  return useQuery(api.products.list, { category }) as Product[] | undefined;
}

export function useProduct(id: string): Product | null | undefined {
  return useQuery(api.products.getById, {
    id: id as Id<"products">,
  }) as Product | null | undefined;
}

export function useCreateOrder() {
  const remoteCreate = useMutation(api.orders.create);

  return async (input: LocalOrderInput) =>
    remoteCreate({
      ...input,
      items: input.items.map((item) => ({
        ...item,
        productId: item.productId as Id<"products">,
      })),
    });
}
