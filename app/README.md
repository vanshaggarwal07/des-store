# MAISON — Designer Fashion E-Commerce

Full-stack starter: Next.js 14 + Convex (real-time DB) + Google Sheets live order sync + GSAP/Framer Motion animations + 3D tilt product cards.

## What's already built

- Homepage with GSAP scroll-driven hero (fade/parallax/clip-path reveal)
- Shop grid with category filtering, 3D tilt-on-hover product cards
- Product detail page with size selection + stock awareness
- Cart (localStorage-based) → Checkout → Convex order mutation
- **Every order placed automatically appends a row to your Google Sheet** (no manual export needed)
- Convex schema for products, orders, carts

## Quick start (no Convex / Google account needed)

```bash
npm install
cp .env.local.example .env.local   # leave NEXT_PUBLIC_CONVEX_URL empty
npm run dev
```

With an empty `NEXT_PUBLIC_CONVEX_URL`, the app runs in **local catalog mode**: sample products are seeded in `localStorage`, and checkout works without a Convex deployment. Google Sheets sync is skipped until credentials are added.

## Full setup (Convex + Sheets)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Convex
```bash
npx convex dev
```
This will prompt you to log in / create a Convex project. It regenerates `convex/_generated/` files and gives you a `NEXT_PUBLIC_CONVEX_URL` — copy that into `.env.local`.

**Leave this running in its own terminal tab** — it watches your `convex/` folder and pushes schema/function changes live.

### 3. Set up Google Sheets sync

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → create a project
2. Enable the **Google Sheets API** (APIs & Services → Library → search "Google Sheets API" → Enable)
3. Create credentials → **Service Account** → give it any name → Create
4. Open the service account → Keys tab → Add Key → JSON → download it
5. Create a new Google Sheet, add a tab named exactly `Orders`
6. Share that Sheet with the service account's email (found in the JSON as `client_email`) — give it **Editor** access
7. Copy the Sheet ID from its URL: `https://docs.google.com/spreadsheets/d/THIS_PART_IS_THE_ID/edit`

### 4. Fill in `.env.local`
Copy `.env.local.example` → `.env.local` and fill in:
- `NEXT_PUBLIC_CONVEX_URL` (from step 2)
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` (the `client_email` field from the downloaded JSON)
- `GOOGLE_PRIVATE_KEY` (the `private_key` field — keep the `\n` characters as-is, wrap in quotes)
- `GOOGLE_SHEET_ID` (from step 3.7)
- `SITE_URL` (`http://localhost:3000` for local dev)

### 5. Seed sample products
With `npx convex dev` running in one tab, in another tab run:
```bash
npx convex run seed:seedProducts
```

### 6. Run the app
```bash
npm run dev
```
Visit `http://localhost:3000`.

### 7. Test the full loop
Add a product to cart → checkout with any test details → Place Order → check your Google Sheet. A new row should appear within a second or two.

## Adding your real products

Easiest path for now: open the Convex dashboard (`npx convex dashboard`) → `products` table → Add Document, matching the schema in `convex/schema.ts`. Later you can build an admin form page for this.

## Deploying

- Frontend: Vercel (connect this repo, add all the same env vars in Vercel's dashboard, set `SITE_URL` to your live domain)
- Convex: `npx convex deploy` for production deployment

## Where to extend next in Cursor

- **Payments**: swap the "Cash on Delivery" block in `app/checkout/page.tsx` for Razorpay/Stripe Checkout
- **3D garments**: if you want literal 3D (not just tilt/parallax), add Three.js + react-three-fiber and swap `ProductCard`'s `<img>` for a rotating GLB model viewer
- **Admin dashboard**: a `/admin` route reading `api.orders.list` to manage order status
- **shadcn/ui + 21st.dev Magic MCP**: use these to generate additional polished components (filters, size guide modal, etc.) — configure both as MCP servers in Cursor settings, then prompt the agent directly for new components matching the existing `ink/bone/clay` palette in `tailwind.config.ts`
