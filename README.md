# Êñiola Collections

A luxury digital fashion showroom — cinematic storefront, full e-commerce, and a
separate admin dashboard. Three apps, one MongoDB Atlas database.

```
client/   React + Vite storefront (cinematic, dark)   → port 5173
admin/    React + Vite admin dashboard (light)         → port 5174
server/   Node + Express + Mongoose API                → port 5000
```

## Quick start

```bash
# 1. API
cd server
cp .env.example .env          # set MONGODB_URI + JWT_SECRET
npm install
npm run seed                  # creates admin, categories, products
npm run dev                   # http://localhost:5000

# 2. Storefront
cd ../client
cp .env.example .env
npm install
npm run dev                   # http://localhost:5173

# 3. Admin
cd ../admin
cp .env.example .env
npm install
npm run dev                   # http://localhost:5174
```

**Admin login:** `admin@eniola.com` / `Admin123!` (from the seed; change in production).

## Stack

- **Frontend:** React, Vite, Tailwind, Framer Motion, Lenis (smooth scroll)
- **Backend:** Node, Express, Mongoose → MongoDB Atlas
- **Auth:** JWT + bcrypt
- **Deploy:** Render (see `render.yaml`)

## MongoDB Atlas note

The API accepts either connection form. Use `mongodb+srv://…` in production
(Render resolves SRV DNS). If your environment can't resolve SRV records, use the
standard `mongodb://host1,host2,host3/db?ssl=true&replicaSet=…&authSource=admin`
form instead — both are documented in `server/.env.example`.

## Features

**Storefront** — cinematic hero (admin-editable), infinite product gallery,
category browse, shop with filters/sort/search, product pages (gallery, sizes,
colours, reviews, related, WhatsApp order), cart, wishlist, checkout (Paystack /
Flutterwave / COD / bank transfer + promo codes), customer auth.

**Admin** — dashboard, products (CRUD, images, publish/draft/archive, duplicate),
categories, inventory, orders, customers, reviews, coupons, homepage manager,
analytics, media library, notifications, settings.

## Payments

Checkout records orders and supports Cash on Delivery / Bank Transfer out of the
box. Paystack / Flutterwave are wired as selectable methods; add your live gateway
keys and redirect logic to enable online capture.
