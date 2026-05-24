# AGENTS.md: Panduan AI Agent untuk Monorepo Marketplace Fashion

Dokumen ini adalah panduan referensi utama bagi AI Agent (seperti Antigravity, GitHub Copilot, Cursor, dll.) serta pengembang manusia untuk memahami struktur, keputusan arsitektur, standar penulisan kode, dan alur kerja di dalam monorepo **Fashion Brand Marketplace**.

---

## 1. Gambaran Umum Proyek (Project Overview)

Proyek ini adalah platform marketplace fashion terintegrasi yang dikembangkan menggunakan arsitektur monorepo dengan pemisahan yang jelas antara frontend dan backend:

- **Frontend (`apps/frontend`)**: Aplikasi antarmuka pengguna berbasis **Next.js 16** (App Router), menggunakan **React 19**, **Tailwind CSS v4**, dan **TypeScript**.
- **Backend (`apps/backend`)**: Layanan API backend berbasis **Nest.js 11** dengan **TypeScript**, menggunakan **Prisma ORM** untuk interaksi dengan database **PostgreSQL**.

### Struktur Direktori Monorepo
```text
fashion-brand-marketplace/
├── apps/
│   ├── frontend/             # Aplikasi Client (Next.js)
│   │   ├── app/              # Routing & Layouts (App Router)
│   │   ├── public/           # Aset Statis (Gambar, Font, dll.)
│   │   └── package.json      # Dependensi Frontend
│   │
│   └── backend/              # Layanan API (Nest.js)
│       ├── src/              # Kode Sumber Backend (Modul, Controller, Service)
│       ├── prisma/           # Skema Basis Data & Migrasi (Prisma Schema)
│       └── package.json      # Dependensi Backend
│
├── package.json              # Dependensi Root & Skrip Monorepo
├── pnpm-workspace.yaml       # Konfigurasi Workspace Monorepo
├── turbo.json                # Konfigurasi Pipelines Turborepo
├── pnpm-lock.yaml            # Lockfile Tunggal Monorepo
└── AGENTS.md                 # Dokumentasi ini
```

---

## 2. Pedoman Umum untuk AI Agent

Saat bekerja di repository ini, AI Agent harus mematuhi instruksi berikut:

1. **Strict TypeScript**: Selalu gunakan TypeScript. Hindari penggunaan tipe `any`. Definisikan `interface` atau `type` secara eksplisit untuk payload API, data state, dan properti komponen.
2. **Kemandirian Folder Aplikasi**: Lakukan instalasi package dan eksekusi command pada subfolder aplikasi masing-masing (`apps/frontend` atau `apps/backend`). Jangan mencampur-adukkan dependensi di luar cakupan aplikasinya.
3. **Integritas Kode**: Pertahankan komentar (comments) dan dokumentasi (docstrings) yang ada jika tidak berkaitan langsung dengan perubahan fungsional yang Anda lakukan.
4. **Tautan Berkas (File Links)**: Ketika menyarankan atau menjelaskan perubahan kepada pengguna, selalu buat link berkas menggunakan format Markdown absolute path dengan skema `file:///` (misal: `[app/page.tsx](file:///apps/frontend/app/page.tsx)` atau `[schema.prisma](file:///apps/backend/prisma/schema.prisma)`).

---

## 3. Panduan Arsitektur & Aturan Frontend (`apps/frontend`)

Frontend menggunakan **Next.js** dengan paradigma **App Router**.

### Struktur Folder Frontend
Setiap fitur baru harus mengikuti pola pengorganisasian berikut:
- **`app/`**: Folder rute (routing).
  - Gunakan subfolder yang merepresentasikan rute aplikasi (misal: `app/products/page.tsx` untuk halaman daftar produk).
  - Gunakan *Route Groups* dengan tanda kurung (misal: `(auth)`) untuk mengelompokkan rute tanpa memengaruhi URL.
- **`components/`**: Komponen UI yang dapat digunakan kembali.
  - **`components/ui/`**: Komponen UI atomik dasar (seperti tombol, input, lencana, modal) yang berfokus pada visual.
  - **`components/shared/`**: Komponen yang lebih kompleks yang digunakan di beberapa halaman (seperti navigasi, footer, kartu produk).
- **`hooks/`**: Custom React Hooks untuk memisahkan logika komponen dan stateful logic.
- **`services/`**: API Client / Fetch Wrapper untuk berkomunikasi dengan backend Nest.js.
- **`types/`**: Definisi tipe TypeScript global (seperti `Product`, `User`, `CartItem`, `Order`).

### Aturan UI & Styling
- **Tailwind CSS v4**: Gunakan utilitas Tailwind secara konsisten. Hindari menulis CSS inline atau stylesheet kustom kecuali sangat terpaksa.
- **Tema & Warna**: Manfaatkan variabel CSS di `app/globals.css` (seperti HSL format) untuk memastikan dukungan mode gelap/terang dan tema yang konsisten.
- **Interaksi Premium**: Tambahkan transisi halus (`transition-all duration-200`) dan animasi mikro pada interaksi tombol, link, dan kartu produk untuk menghadirkan pengalaman pengguna premium.
- **SEO & Aksesibilitas**: Setiap halaman rute (`page.tsx`) harus mendefinisikan objek `metadata` atau fungsi `generateMetadata()` untuk optimasi SEO. Gunakan elemen HTML semantik (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`).

---

## 4. Panduan Arsitektur & Aturan Backend (`apps/backend`)

Backend dibangun menggunakan arsitektur modular dari **Nest.js**.

### Struktur Folder Backend
Kode sumber backend berada di dalam folder `src/` dan diatur secara modular:
- **`src/common/`**: Komponen global reusable seperti guard keamanan, interceptor respons, filter exception, decorator kustom, dan utilitas umum.
- **`src/modules/` (atau langsung di subfolder `src/`)**: Setiap domain bisnis (fitur) harus dibungkus dalam satu modul mandiri:
  - **`*.module.ts`**: Mendefinisikan penyedia layanan (providers), pengontrol (controllers), dan impor dependensi modul.
  - **`*.controller.ts`**: Menangani permintaan HTTP masuk, mendefinisikan rute, metode HTTP, dan menerapkan middleware/guard.
  - **`*.service.ts`**: Tempat utama penulisan logika bisnis (business logic) dan interaksi dengan database melalui Prisma.
  - **`dto/`**: Data Transfer Object untuk validasi tipe data request masuk (gunakan `class-validator` dan `class-transformer`). Contoh: `create-product.dto.ts`.
  - **`entities/`**: Model data internal yang menggambarkan struktur entitas untuk respons API.

### Aturan Basis Data & ORM (Prisma)
- Skema basis data dikelola dalam file [schema.prisma](file:///apps/backend/prisma/schema.prisma).
- Gunakan `PrismaService` untuk melakukan query database di dalam service Nest.js. Jangan pernah melakukan query langsung tanpa melalui instance service.

## 5. Skrip & Alur Kerja Pengembangan (Workflows & Commands)

Monorepo ini dikelola menggunakan **Turborepo**. Semua perintah pengembangan dapat dijalankan langsung dari direktori root:

### A. Perintah Utama dari Root Direktori
Jalankan perintah ini di root monorepo:
- **Instalasi Semua Dependensi**: `pnpm install`
- **Menjalankan Semua Aplikasi secara Paralel (Dev Mode)**: `pnpm dev` (Frontend berjalan di `http://localhost:3000`, Backend berjalan di port API)
- **Membangun Semua Aplikasi (Production Build)**: `pnpm build`
- **Linting Semua Berkas**: `pnpm lint`
- **Menjalankan Pengujian (Testing)**: `pnpm test`

### B. Menjalankan Perintah untuk Aplikasi Spesifik (Filtering)
Jika ingin menjalankan perintah hanya untuk satu aplikasi tertentu, gunakan filter `--filter`:
- **Hanya menjalankan Frontend (Dev Mode)**: `pnpm dev --filter frontend`
- **Hanya membangun Backend (Build)**: `pnpm build --filter backend`
- **Menjalankan E2E Testing di Backend**: `pnpm test:e2e --filter backend`

### C. Alur Kerja Prisma (Backend)
Untuk berinteraksi dengan database melalui Prisma ORM di dalam modul backend:
1. Modifikasi file [schema.prisma](file:///apps/backend/prisma/schema.prisma).
2. Jalankan perintah migrasi: `pnpm --filter backend exec prisma migrate dev --name <deskripsi_perubahan>` untuk memperbarui skema lokal.
3. Generator Prisma Client akan dijalankan secara otomatis saat melakukan instalasi atau migrasi.

## 6. Standar Penulisan Kode Spesifik (Coding Standards)

Untuk menjaga konsistensi codebase monorepo ini, AI Agent wajib mematuhi standar penulisan kode berikut:

### Backend (Nest.js & Prisma)
- **Validasi Payload**: Selalu pasang `ValidationPipe` secara global atau lokal pada controller. Gunakan decorator seperti `@IsString()`, `@IsNumber()`, `@IsNotEmpty()`, dan `@IsOptional()` pada berkas DTO.
- **Exception Handling**: Jangan biarkan error mentah database bocor ke client. Tangkap error menggunakan blok `try-catch` di service dan lemparkan HTTP Exception Nest.js yang sesuai (misal: `NotFoundException`, `BadRequestException`, `ForbiddenException`).
- **Penyimpanan Password**: Sandi pengguna harus di-hash menggunakan algoritma aman (seperti `bcrypt` atau `argon2`) sebelum disimpan ke database. Jangan pernah menyimpan plain-text password.

### Frontend (Next.js & Tailwind)
- **Rendering Strategy**: Pahami perbedaan antara Server Component (default di Next.js App Router) dan Client Component.
  - Gunakan **Server Component** untuk halaman yang berfokus pada data fetching awal (lebih cepat, ramah SEO).
  - Gunakan **Client Component** (`"use client"`) hanya jika halaman/komponen membutuhkan event listener (klik, submit), React hooks (`useState`, `useEffect`), atau state management klien.
- **API Requests**: Jangan memanggil database secara langsung dari Client Component. Gunakan Next.js Server Actions atau panggil endpoint API backend Nest.js melalui API client terpadu di folder `services/`.
- **Responsive Web Design**: Desain UI harus responsif secara mobile-first. Gunakan prefix Tailwind seperti `md:`, `lg:`, dan `xl:` untuk menyusun tata letak desktop.
