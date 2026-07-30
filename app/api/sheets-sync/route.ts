import { NextRequest, NextResponse } from "next/server";
import { appendOrderRow } from "@/lib/googleSheets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, customer, email, phone, address, items, total, status, date } = body;

    if (!orderId || !customer) {
      return NextResponse.json({ error: "Missing order data" }, { status: 400 });
    }

    await appendOrderRow({
      orderId,
      customer,
      email,
      phone,
      address,
      items,
      total,
      status,
      date,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Sheets sync route error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
