# VeeCap Classes — Full-Stack Course Platform (Razorpay Edition)

A complete, custom-coded course marketplace: authentication, course management, student
progress tracking, and Razorpay-powered payments (cards, UPI, netbanking).

## Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, Razorpay
- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Razorpay Checkout.js

## Project Structure

```
veecap-platform/
  server/      → Express API (auth, courses, enrollments, payments)
  client/      → React frontend
```

## 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your real values:

- `MONGO_URI` — your MongoDB connection string (free cluster at
  https://www.mongodb.com/cloud/atlas, or a local MongoDB instance).
- `JWT_SECRET` — any long random string. Generate one with:
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — from
  https://dashboard.razorpay.com/app/keys (use **Test Mode** keys while developing — toggle
  "Test Mode" on in the dashboard before generating keys).
- `RAZORPAY_WEBHOOK_SECRET` — see step 3 below.

Seed the database with sample courses and a test admin/instructor:

```bash
npm run seed
```

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## 2. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The site runs at `http://localhost:5173`. The Razorpay Checkout script is already loaded via a
`<script>` tag in `index.html` — no extra npm package needed on the frontend.

## 3. Razorpay Webhook Setup (optional but recommended)

The main payment flow doesn't strictly need a webhook — when a payment succeeds, the Razorpay
popup calls your frontend directly, which calls `/api/payments/verify` and verifies the payment
signature server-side immediately. The webhook is a backup: it confirms the payment server-to-server
in case the user closes their browser right after paying, before `/verify` gets called.

Since Razorpay webhooks need a public URL to reach your local backend, use a tunnel tool for
local development:

```bash
# Install ngrok: https://ngrok.com/download
ngrok http 5000
```

This gives you a public URL like `https://abcd1234.ngrok-free.app`. Then:

1. Go to Razorpay Dashboard → Settings → Webhooks → **Add New Webhook**.
2. Webhook URL: `https://abcd1234.ngrok-free.app/api/payments/webhook`
3. Active events: check **payment.captured** and **payment.failed**.
4. Set a secret — copy it into `RAZORPAY_WEBHOOK_SECRET` in your `.env`, then restart the backend.

In production, point this at your real domain instead of an ngrok URL.

## 4. Test a Purchase End-to-End

1. Register a student account on the site.
2. Open a paid course and click "Buy This Course" — a Razorpay popup opens.
3. In **Test Mode**, use a test card: `4111 1111 1111 1111`, any future expiry, any CVC.
   (Razorpay also supports a test UPI flow — use UPI ID `success@razorpay` to simulate a
   successful payment, or `failure@razorpay` to simulate a failure.)
4. On success, you're redirected to `/checkout/success` and the course unlocks in `/dashboard`.

## 5. Going Live

- Switch from Razorpay Test Mode keys to Live Mode keys once your Razorpay account is fully
  KYC-verified (this requires PAN, bank account details, and business/individual verification —
  see Razorpay Dashboard → Account & Settings → Activation).
- Deploy the backend (Render, Railway, AWS, etc.) and frontend (Vercel, Netlify) separately, or
  serve the built frontend from Express as static files.
- Set `CLIENT_URL` in the backend `.env` to your real frontend domain (used for CORS).
- Point your Razorpay webhook at your real production domain instead of ngrok.
- Use a managed MongoDB (Atlas) in production rather than a local instance.
- Your hosting provider should give you HTTPS automatically (Vercel, Render, Railway all do this
  by default) — Razorpay requires HTTPS in production.

## Roles

- `student` — default role on signup; can browse, buy, and take courses.
- `instructor` — can create/edit/delete their own courses via `/admin/courses/new`.
- `admin` — full access to all courses (set manually in the database, e.g. via MongoDB Atlas UI
  or by editing the `role` field on a user document).

## Extending This Further

- Add video hosting (Cloudinary/Mux) by storing a real stream URL in `lesson.videoUrl`.
- Add coupon codes by applying a discount to `finalPrice` in `createOrder` before creating the
  Razorpay order.
- Add email receipts via SendGrid, triggered inside `verifyPayment` right after marking an order
  paid.
- Add Stripe alongside Razorpay later if you expand to international students — the codebase
  structure (Order model, Enrollment auto-creation) was designed to support either gateway with
  the controller swapped out.
