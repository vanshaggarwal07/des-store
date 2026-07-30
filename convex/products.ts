import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    }
    return await ctx.db.query("products").collect();
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("products").collect();
    return all.filter((p) => p.featured);
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    designer: v.string(),
    description: v.string(),
    price: v.number(),
    currency: v.string(),
    images: v.array(v.string()),
    sizes: v.array(v.string()),
    category: v.string(),
    stock: v.record(v.string(), v.number()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
