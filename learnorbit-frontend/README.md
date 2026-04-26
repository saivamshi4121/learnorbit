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

## 🚀 Production Readiness & Features

This project has been optimized for production with the following enhancements:

### 📱 Full Responsiveness
- **Adaptive Layouts**: Every page (Landing, Dashboard, Pricing, Contact) is fully responsive from mobile to ultra-wide displays.
- **Dynamic Navbar**: Modern side-drawer for mobile and glassmorphism desktop navigation.
- **Certificate Preview**: Responsive scale-based preview for certificates on mobile devices.
- **Hero Sections**: Centered and optimized content for mobile readability.

### 🛠️ Backend Stability (Production Grade)
- **Security**: Implemented `helmet`, `cors` (with origin validation), `xss-clean`, and `rate-limiting`.
- **Performance**: Added `compression` for faster payload delivery.
- **Logging**: Robust `winston` logging with request tracking.
- **Health Checks**: Dedicated `/api/health` endpoint for monitoring.
- **Graceful Shutdown**: Handles SIGTERM/SIGINT for zero-downtime potential.

### 🌐 SEO & Frontend Stability
- **Metadata**: Comprehensive SEO metadata and OpenGraph tags in `layout.tsx`.
- **Global States**: Custom `loading.tsx` and `error.tsx` for premium user experience.
- **SEO Assets**: Included `robots.txt` and optimized asset paths.

## 🚢 Deployment Guide

### Backend (Render/Heroku/DigitalOcean)
1. Set `NODE_ENV=production`.
2. Configure environment variables in the dashboard (refer to `.env`).
3. Build command: `npm install` (no build step needed for Node.js).
4. Start command: `npm start`.

### Frontend (Vercel/Netlify)
1. Set `NEXT_PUBLIC_BASE_URL` to your backend URL.
2. Build command: `npm run build`.
3. Start command: `npm run start`.

