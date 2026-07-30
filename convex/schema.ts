import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    designer: v.string(),
    description: v.string(),
    price: v.number(),
    currency: v.string(), // "INR" | "USD" etc
    images: v.array(v.string()),
    sizes: v.array(v.string()), // ["XS","S","M","L","XL"]
    category: v.string(), // "Outerwear" | "Dresses" | "Accessories" ...
    stock: v.record(v.string(), v.number()), // { "M": 4, "L": 2 }
    featured: v.optional(v.boolean()),
    createdAt: v.number(),
  }).index("by_category", ["category"]),

  orders: defineTable({
    orderNumber: v.string(),
    customerName: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    pincode: v.string(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        size: v.string(),
        quantity: v.number(),
        price: v.number(),
      })
    ),
    totalAmount: v.number(),
    status: v.string(), // "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
    paymentMethod: v.string(), // "cod" for now
    sheetSynced: v.boolean(),
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  carts: defineTable({
    sessionId: v.string(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        size: v.string(),
        quantity: v.number(),
      })
    ),
    updatedAt: v.number(),
  }).index("by_session", ["sessionId"]),
});
