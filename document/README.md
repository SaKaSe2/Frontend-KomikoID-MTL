# KomikoID MTL - Frontend Documentation

Dokumentasi frontend untuk website komik KomikoID dengan fitur Machine Translation.

## Struktur Dokumentasi

```
document/
├── README.md                    # File ini
├── Struktur Frontend.txt        # Struktur folder project
├── setup/                       # Panduan instalasi & konfigurasi
│   ├── 01_INSTALLATION.md       # Instalasi dependencies
│   ├── 02_CONFIGURATION.md      # Konfigurasi environment
│   └── 03_RUNNING.md            # Menjalankan aplikasi
└── components/                  # Dokumentasi komponen
    └── COMPONENTS.md            # Daftar komponen UI
```

## Quick Start

1. **Setup** - Baca `setup/01_INSTALLATION.md`
2. **Konfigurasi** - Baca `setup/02_CONFIGURATION.md`
3. **Jalankan** - Baca `setup/03_RUNNING.md`

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React Framework |
| React 18 | UI Library |
| Tailwind CSS | Styling |
| Axios | HTTP Client |
| Context API | State Management |
| next/image | Image Optimization |

## Features

- Browse comics dan chapters
- Read comics dengan image optimization
- Switch antara gambar original dan translated
- Dark mode / Light mode
- Responsive design
- Admin dashboard untuk manage content
- Real-time translation status

## Project Structure

```
Frontend-KomikoID-MTL/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities dan API client
│   └── styles/           # Global styles
├── public/               # Static assets
└── document/             # Documentation
```

## Support

Jika ada pertanyaan, silakan buat issue di repository.
