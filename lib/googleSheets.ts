import { google } from "googleapis";

interface OrderRow {
  orderId: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  items: string;
  total: number;
  status: string;
  date: string;
}

function getAuth() {
  return new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
}

export async function appendOrderRow(order: OrderRow) {
  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_PRIVATE_KEY ||
    !process.env.GOOGLE_SHEET_ID
  ) {
    console.warn("Google Sheets credentials missing — skipping sync.");
    return;
  }

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Orders!A:I",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          order.orderId,
          order.customer,
          order.email,
          order.phone,
          order.address,
          order.items,
          order.total,
          order.status,
          order.date,
        ],
      ],
    },
  });
}

// Call once (e.g. from a setup script) to write header row if the sheet is empty.
export async function ensureHeaderRow() {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Orders!A1:I1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          "Order ID",
          "Customer",
          "Email",
          "Phone",
          "Address",
          "Items",
          "Total (₹)",
          "Status",
          "Date",
        ],
      ],
    },
  });
}
