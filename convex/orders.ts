import {
  mutation,
  query,
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// Public mutation: create the order in the DB, then schedule the Sheets sync action.
export const create = mutation({
  args: {
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
    paymentMethod: v.string(),
  },
  handler: async (ctx, args) => {
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      customerName: args.customerName,
      email: args.email,
      phone: args.phone,
      address: args.address,
      city: args.city,
      pincode: args.pincode,
      items: args.items,
      totalAmount: args.totalAmount,
      status: "pending",
      paymentMethod: args.paymentMethod,
      sheetSynced: false,
      createdAt: Date.now(),
    });

    // Decrement stock for each ordered item/size
    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (product) {
        const currentStock = product.stock[item.size] ?? 0;
        await ctx.db.patch(item.productId, {
          stock: {
            ...product.stock,
            [item.size]: Math.max(0, currentStock - item.quantity),
          },
        });
      }
    }

    // Fire-and-forget: sync this order to Google Sheets
    await ctx.scheduler.runAfter(0, internal.orders.syncToSheet, {
      orderId,
    });

    return { orderId, orderNumber };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Internal mutation: mark an order as synced once the Sheets API call succeeds
export const markSynced = internalMutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { sheetSynced: true });
  },
});

// Internal action: calls the Next.js API route (which holds the Google credentials)
// to append a row to the Google Sheet. Actions can make external fetch calls;
// mutations cannot.
export const syncToSheet = internalAction({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.runQuery(internal.orders.getForSync, {
      orderId: args.orderId,
    });
    if (!order) return;

    try {
      const res = await fetch(`${process.env.SITE_URL}/api/sheets-sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.orderNumber,
          customer: order.customerName,
          email: order.email,
          phone: order.phone,
          address: `${order.address}, ${order.city} - ${order.pincode}`,
          items: order.items
            .map((i) => `${i.name} (${i.size}) x${i.quantity}`)
            .join("; "),
          total: order.totalAmount,
          status: order.status,
          date: new Date(order.createdAt).toLocaleString("en-IN"),
        }),
      });

      if (res.ok) {
        await ctx.runMutation(internal.orders.markSynced, {
          orderId: args.orderId,
        });
      }
    } catch (err) {
      // Sheets sync failing should never block the order itself.
      // Order remains in DB with sheetSynced: false for manual retry/export.
      console.error("Sheet sync failed:", err);
    }
  },
});

export const getForSync = internalQuery({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});
