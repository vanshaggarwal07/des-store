export type Product = {
  _id: string;
  name: string;
  designer: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  sizes: string[];
  category: string;
  stock: Record<string, number>;
  featured?: boolean;
  createdAt: number;
};

export const SAMPLE_PRODUCTS: Product[] = [
  {
    _id: "prod_draped_wool_coat",
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
    createdAt: Date.now(),
  },
  {
    _id: "prod_silk_column_gown",
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
    createdAt: Date.now(),
  },
  {
    _id: "prod_structured_leather_tote",
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
    createdAt: Date.now(),
  },
  {
    _id: "prod_tailored_wide_leg_trouser",
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
    createdAt: Date.now(),
  },
];

const PRODUCTS_KEY = "maison_products";
const ORDERS_KEY = "maison_orders";

function readProducts(): Product[] {
  if (typeof window === "undefined") return SAMPLE_PRODUCTS;
  const raw = localStorage.getItem(PRODUCTS_KEY);
  if (!raw) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SAMPLE_PRODUCTS));
    return SAMPLE_PRODUCTS.map((p) => ({ ...p, stock: { ...p.stock } }));
  }
  return JSON.parse(raw) as Product[];
}

function writeProducts(products: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function listLocalProducts(category?: string): Product[] {
  const products = readProducts();
  if (!category) return products;
  return products.filter((p) => p.category === category);
}

export function getLocalFeatured(): Product[] {
  return readProducts().filter((p) => p.featured);
}

export function getLocalProduct(id: string): Product | null {
  return readProducts().find((p) => p._id === id) ?? null;
}

export type LocalOrderInput = {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  items: Array<{
    productId: string;
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentMethod: string;
};

export async function createLocalOrder(input: LocalOrderInput) {
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
  const orderId = `order_${Date.now()}`;

  const products = readProducts();
  for (const item of input.items) {
    const product = products.find((p) => p._id === item.productId);
    if (!product) continue;
    const current = product.stock[item.size] ?? 0;
    product.stock = {
      ...product.stock,
      [item.size]: Math.max(0, current - item.quantity),
    };
  }
  writeProducts(products);

  const order = {
    _id: orderId,
    orderNumber,
    ...input,
    status: "pending",
    sheetSynced: false,
    createdAt: Date.now(),
  };

  const existing = localStorage.getItem(ORDERS_KEY);
  const orders = existing ? JSON.parse(existing) : [];
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

  // Best-effort Sheets sync when Google credentials are configured locally.
  try {
    await fetch("/api/sheets-sync", {
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
  } catch {
    // Sheets sync is optional in local mode.
  }

  return { orderId, orderNumber };
}

export function isConvexConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
}
