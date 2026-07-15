# Êñiola Collections — Client

Luxury digital showroom frontend. React + Vite + Tailwind + Framer Motion + Lenis.

## Run

```bash
cd client
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## What's built (Slice 1 — Homepage)

| Section | File |
| --- | --- |
| Floating glass nav (shrinks on scroll, hides down / reveals up) | `src/components/navigation/Navbar.jsx` |
| Cinematic layered hero video | `src/sections/Hero/Hero.jsx` |
| Category grid (editorial hover zoom) | `src/sections/Categories/Categories.jsx` |
| Infinite moving gallery (3 seamless rows, hover to pause + reveal) | `src/sections/InfiniteGallery/` |
| Alternating editorial collection stories | `src/sections/CollectionStory/CollectionStory.jsx` |
| Brand story | `src/sections/AboutBrand/AboutBrand.jsx` |
| Reviews | `src/sections/Reviews/Reviews.jsx` |
| Newsletter + footer | `src/sections/Footer/Footer.jsx` |
| Floating WhatsApp button | `src/components/ui/WhatsAppButton.jsx` |

## Design tokens

Defined in `tailwind.config.js` — obsidian `#050505`, gold `#C8A96A`, 32px image
radius (`rounded-luxe`), 1440px container (`max-w-container`), Geist font.

## Data

Placeholder catalogue in `src/constants/products.js`, wired to the real studio
assets in `public/images/products/`. This is replaced by the Node/Express +
MongoDB Atlas API in a later slice.

## Not yet built

Backend API, admin dashboard, product/shop/cart/checkout pages, auth. These are
the next slices.
