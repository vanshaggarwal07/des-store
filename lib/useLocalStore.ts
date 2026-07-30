"use client";

import { useEffect, useState } from "react";
import {
  createLocalOrder,
  getLocalFeatured,
  getLocalProduct,
  listLocalProducts,
  type LocalOrderInput,
  type Product,
} from "@/lib/catalog";

export function useFeaturedProducts(): Product[] | undefined {
  const [local, setLocal] = useState<Product[] | undefined>(undefined);

  useEffect(() => {
    setLocal(getLocalFeatured());
  }, []);

  return local;
}

export function useProductList(category?: string): Product[] | undefined {
  const [local, setLocal] = useState<Product[] | undefined>(undefined);

  useEffect(() => {
    setLocal(listLocalProducts(category));
  }, [category]);

  return local;
}

export function useProduct(id: string): Product | null | undefined {
  const [local, setLocal] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    setLocal(getLocalProduct(id));
  }, [id]);

  return local;
}

export function useCreateOrder() {
  return async (input: LocalOrderInput) => createLocalOrder(input);
}
