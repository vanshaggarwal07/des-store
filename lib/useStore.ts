"use client";

import * as localStore from "@/lib/useLocalStore";
import * as convexStore from "@/lib/useConvexStore";

const useConvex = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);

export const useFeaturedProducts = useConvex
  ? convexStore.useFeaturedProducts
  : localStore.useFeaturedProducts;

export const useProductList = useConvex
  ? convexStore.useProductList
  : localStore.useProductList;

export const useProduct = useConvex
  ? convexStore.useProduct
  : localStore.useProduct;

export const useCreateOrder = useConvex
  ? convexStore.useCreateOrder
  : localStore.useCreateOrder;
