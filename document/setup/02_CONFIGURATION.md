# Konfigurasi Environment

## Step 1: Copy Environment File

```bash
cp .env.example .env.local
```

Atau buat file `.env.local` baru.

## Step 2: Konfigurasi Backend API

Edit file `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Backend Base URL (untuk image loading)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## Step 3: Konfigurasi Next.js Image

File `next.config.js` sudah dikonfigurasi untuk load image dari backend:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },
}

module.exports = nextConfig
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `http://localhost:8000/api` |
| `NEXT_PUBLIC_BACKEND_URL` | Backend base URL | `http://localhost:8000` |

## Checklist Konfigurasi

- [ ] File `.env.local` sudah dibuat
- [ ] `NEXT_PUBLIC_API_URL` sudah dikonfigurasi
- [ ] `NEXT_PUBLIC_BACKEND_URL` sudah dikonfigurasi
- [ ] Backend sudah berjalan di URL yang dikonfigurasi

---

**Selanjutnya:** [03_RUNNING.md](03_RUNNING.md)
