This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Supabase backend

Copy `.env.example` to `.env.local` and set the Supabase project URL and publishable key. The application uses Supabase Auth for email/password, Google, and Facebook sign-in, and the Supabase Data API for customer orders and chat history.

Before deploying, enable Email, Google, Facebook, and Phone sign-in in Supabase Auth and add the local and production `/auth/confirm` URLs to the Auth redirect URL allow list. For Google and Facebook, configure their OAuth client credentials in Supabase Auth; both providers use the Supabase callback URL shown in the provider settings (`https://<project-ref>.supabase.co/auth/v1/callback`). For WhatsApp phone OTP, configure a Twilio or Twilio Verify SMS provider with WhatsApp delivery enabled in Supabase Auth. Passwords are handled by Supabase Auth and are never stored by the application.

Instagram is not supported as a general-purpose customer OAuth provider by Supabase Auth and remains a contact channel. WhatsApp sign-in uses a phone one-time-password flow; it will not deliver codes until the Twilio/WhatsApp provider is configured.

Apply the database migration to the linked Supabase project:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase migration up --remote
```

The migrations create user-owned `customer_orders`, `customer_chat_messages`, and `customer_cart_items` tables with Row Level Security, without modifying the existing `orders` table. Every read and write is scoped to the signed-in Supabase user; carts are saved per account, while signed-out carts stay in that browser until sign-in. Pakistani Wear products support S, M, L, and XL. `product_inventory` starts every product/size at zero, and orders are rejected unless an atomic database-side stock reservation succeeds. The API recalculates order prices from the server-side catalog before saving.

To make products orderable, restock the required variants from the Supabase SQL Editor using an authorized project owner account, for example:

```sql
update public.product_inventory
set stock = 5
where product_id = 1 and size = 'S';
```

Non-apparel products use an empty size (`size = ''`). Do not grant the public or authenticated roles permission to update inventory.
