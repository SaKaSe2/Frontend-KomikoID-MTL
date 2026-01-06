# Menjalankan Aplikasi

## Development Server

```bash
npm run dev
```

Aplikasi berjalan di: `http://localhost:3000`

## Pastikan Backend Berjalan

Frontend membutuhkan backend untuk berfungsi dengan baik. Pastikan:

1. Backend API berjalan di `http://localhost:8000`
2. Queue worker berjalan (untuk translation)
3. OCR service berjalan (untuk text detection)

## Testing Koneksi

### 1. Buka Browser

Akses `http://localhost:3000`

### 2. Test API Connection

Buka DevTools (F12) > Network tab, refresh halaman dan pastikan request ke backend berhasil.

### 3. Test Image Loading

Pastikan gambar komik tampil dengan benar dari backend.

## Available Scripts

```bash
# Development mode
npm run dev

# Build production
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Pages Overview

| Route | Description |
|-------|-------------|
| `/` | Homepage - Featured comics |
| `/comics` | Browse all comics |
| `/comics/[slug]` | Comic detail page |
| `/comics/[slug]/chapter/[number]` | Chapter reader |
| `/search` | Search comics |
| `/admin` | Admin dashboard |
| `/admin/comics` | Manage comics |
| `/admin/chapters` | Manage chapters |

## Production

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Troubleshooting

### Error: API Connection Failed

```
1. Pastikan backend berjalan di http://localhost:8000
2. Check NEXT_PUBLIC_API_URL di .env.local
3. Pastikan CORS sudah dikonfigurasi di backend
```

### Error: Image Not Loading

```
1. Pastikan backend storage:link sudah dijalankan
2. Check next.config.js remotePatterns
3. Pastikan image path correct
```

### Error: Hydration Mismatch

```
1. Clear browser cache
2. Restart dev server
3. Check for client/server render differences
```

---

**Dokumentasi lainnya:** [../components/COMPONENTS.md](../components/COMPONENTS.md)
