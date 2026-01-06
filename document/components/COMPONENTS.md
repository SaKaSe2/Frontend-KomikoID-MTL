# Komponen UI

Daftar komponen yang digunakan di frontend KomikoID.

## Layout Components

### Navbar
- File: `src/components/Navbar.jsx`
- Deskripsi: Navigation bar dengan search, theme toggle, dan user menu

### Footer
- File: `src/components/Footer.jsx`
- Deskripsi: Footer dengan links dan copyright

### Sidebar
- File: `src/components/admin/Sidebar.jsx`
- Deskripsi: Sidebar untuk admin dashboard

## Comic Components

### ComicCard
- File: `src/components/ComicCard.jsx`
- Deskripsi: Card untuk menampilkan comic di list
- Props: `comic`, `showRating`

### ComicGrid
- File: `src/components/ComicGrid.jsx`
- Deskripsi: Grid layout untuk comic cards
- Props: `comics`, `loading`

### ChapterList
- File: `src/components/ChapterList.jsx`
- Deskripsi: List chapter di comic detail page
- Props: `chapters`, `comicSlug`

## Reader Components

### ChapterReader
- File: `src/components/ChapterReader.jsx`
- Deskripsi: Image viewer untuk baca chapter
- Features:
  - Scroll mode
  - Image zoom
  - Next/prev navigation
  - Original/Translated toggle

### ImageToggle
- File: `src/components/ImageToggle.jsx`
- Deskripsi: Toggle button antara original dan translated image

## Admin Components

### ComicForm
- File: `src/components/admin/ComicForm.jsx`
- Deskripsi: Form untuk create/edit comic

### ChapterForm
- File: `src/components/admin/ChapterForm.jsx`
- Deskripsi: Form untuk create/edit chapter dengan upload images

### TranslationStatus
- File: `src/components/admin/TranslationStatus.jsx`
- Deskripsi: Status indicator untuk translation progress

## Common Components

### Button
- File: `src/components/ui/Button.jsx`
- Deskripsi: Reusable button component
- Variants: `primary`, `secondary`, `danger`

### Loading
- File: `src/components/Loading.jsx`
- Deskripsi: Loading spinner/skeleton

### Toast
- File: `src/components/Toast.jsx`
- Deskripsi: Notification toast
- Types: `success`, `error`, `warning`, `info`

## Context Providers

### AuthContext
- File: `src/context/AuthContext.jsx`
- Deskripsi: Authentication state management
- Provides: `user`, `login`, `logout`, `isAdmin`

### ThemeContext
- File: `src/context/ThemeContext.jsx`
- Deskripsi: Dark/Light mode toggle
- Provides: `theme`, `toggleTheme`

### ToastContext
- File: `src/context/ToastContext.jsx`
- Deskripsi: Toast notification management
- Provides: `showToast`, `hideToast`

## Custom Hooks

### useAuth
- File: `src/hooks/useAuth.js`
- Deskripsi: Hook untuk access auth context

### useComics
- File: `src/hooks/useComics.js`
- Deskripsi: Hook untuk fetch comics data

### useDebounce
- File: `src/hooks/useDebounce.js`
- Deskripsi: Hook untuk debounce input (search)
