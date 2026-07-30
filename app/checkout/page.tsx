"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateOrder } from "@/lib/useStore";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const createOrder = useCreateOrder();
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    setCart(raw ? JSON.parse(raw) : []);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);

    try {
      const result = await createOrder({
        ...form,
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: total,
        paymentMethod: "cod",
      });

      setOrderNumber(result.orderNumber);
      localStorage.removeItem("cart");
    } catch (err) {
      console.error(err);
      alert("Something went wrong placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (orderNumber) {
    return (
      <div className="bg-ink min-h-screen pt-40 px-8 text-center">
        <p className="text-xs tracking-widest2 uppercase text-clay mb-4">
          Order Confirmed
        </p>
        <h1 className="font-display text-4xl text-bone mb-4">Thank you.</h1>
        <p className="text-bone/60 mb-2">Your order number is</p>
        <p className="font-display text-2xl text-clay mb-10">{orderNumber}</p>
        <button
          onClick={() => router.push("/shop")}
          className="px-8 py-3 border border-bone/30 text-bone text-xs tracking-widest2 uppercase hover:border-clay hover:text-clay transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-ink min-h-screen pt-32 px-8 md:px-16 pb-24">
      <h1 className="font-display text-4xl text-bone mb-12">Checkout</h1>

      {cart.length === 0 ? (
        <p className="text-center text-bone/50">Your bag is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: "customerName", label: "Full Name", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "phone", label: "Phone", type: "tel" },
              { name: "address", label: "Address", type: "text" },
              { name: "city", label: "City", type: "text" },
              { name: "pincode", label: "Pincode", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-[10px] tracking-widest2 uppercase text-bone/50 mb-2 block">
                  {field.label}
                </label>
                <input
                  required
                  type={field.type}
                  name={field.name}
                  value={(form as Record<string, string>)[field.name]}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-bone/20 py-2 text-bone focus:border-clay outline-none transition-colors"
                />
              </div>
            ))}

            <div className="pt-4">
              <p className="text-[10px] tracking-widest2 uppercase text-bone/50 mb-2">
                Payment Method
              </p>
              <p className="text-bone/70 text-sm">Cash on Delivery</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-8 py-4 bg-bone text-ink text-xs tracking-widest2 uppercase hover:bg-clay transition-colors disabled:opacity-50"
            >
              {submitting ? "Placing Order…" : "Place Order"}
            </button>
          </form>

          <div>
            <p className="text-xs tracking-widest2 uppercase text-bone/50 mb-6">
              Order Summary
            </p>
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-bone/70 py-2 border-b border-bone/10">
                <span>
                  {item.name} ({item.size}) x{item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
            <div className="flex justify-between mt-4 pt-4 border-t border-bone/20 text-bone">
              <span className="tracking-widest2 uppercase text-xs">Total</span>
              <span className="font-display text-xl">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
