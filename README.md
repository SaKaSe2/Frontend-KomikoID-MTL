# KomikoID-MTL Frontend

Frontend untuk website komik dengan fitur Machine Translation (MTL).

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React Framework |
| React | 18.x | UI Library |
| Tailwind CSS | 3.x | Styling |
| Axios | - | HTTP Client |
| Context API | - | State Management |

## Quick Start

```bash
# 1. Clone dan install
git clone <repository-url>
cd Frontend-KomikoID-MTL
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local dengan backend URL

# 3. Jalankan
npm run dev
```

Buka `http://localhost:3000`

## Documentation

Dokumentasi lengkap tersedia di folder `document/`:

- [Setup Guide](document/setup/) - Instalasi dan konfigurasi
- [Components](document/components/) - Dokumentasi komponen UI

Baca [document/README.md](document/README.md) untuk panduan lengkap.

## Project Structure

```
Frontend-KomikoID-MTL/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utilities dan API client
├── public/               # Static assets
└── document/             # Documentation
```

## Features

- Browse dan search comics
- Read chapters dengan image optimization
- Switch original/translated images
- Dark mode / Light mode
- Responsive design
- Admin dashboard

## License

MIT License
