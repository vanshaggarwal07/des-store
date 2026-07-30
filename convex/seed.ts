import { mutation } from "./_generated/server";

// Run via `npx convex run seed:seedProducts` after `npx convex dev` is running.
export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const sample: Array<{
      name: string;
      designer: string;
      description: string;
      price: number;
      currency: string;
      images: string[];
      sizes: string[];
      category: string;
      stock: Record<string, number>;
      featured: boolean;
    }> = [
      {
        name: "Draped Wool Coat",
        designer: "ATELIER NOIR",
        description:
          "A structured silhouette in double-faced wool, finished with hand-stitched horn buttons and a fully lined interior.",
        price: 48500,
        currency: "₹",
        images: [
          "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        category: "Outerwear",
        stock: { XS: 2, S: 4, M: 5, L: 3, XL: 1 },
        featured: true,
      },
      {
        name: "Silk Column Gown",
        designer: "MAISON VERT",
        description:
          "Bias-cut silk charmeuse that skims the body in a single fluid line. Fully lined, invisible back zip.",
        price: 62000,
        currency: "₹",
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
        ],
        sizes: ["XS", "S", "M", "L"],
        category: "Dresses",
        stock: { XS: 1, S: 3, M: 2, L: 0 },
        featured: true,
      },
      {
        name: "Structured Leather Tote",
        designer: "ATELIER NOIR",
        description:
          "Full-grain Italian leather, hand-burnished edges, brushed brass hardware.",
        price: 34000,
        currency: "₹",
        images: [
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop",
        ],
        sizes: ["One Size"],
        category: "Accessories",
        stock: { "One Size": 6 },
        featured: true,
      },
      {
        name: "Tailored Wide-Leg Trouser",
        designer: "MAISON VERT",
        description:
          "High-waisted wool-blend trouser with a sharp center crease and clean side pockets.",
        price: 21500,
        currency: "₹",
        images: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop",
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        category: "Bottoms",
        stock: { XS: 3, S: 5, M: 4, L: 2, XL: 2 },
        featured: false,
      },
    ];

    for (const product of sample) {
      await ctx.db.insert("products", { ...product, createdAt: Date.now() });
    }

    return { inserted: sample.length };
  },
});
