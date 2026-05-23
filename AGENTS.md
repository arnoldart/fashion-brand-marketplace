# 🤖 Panduan Developer AI (AGENTS.md)
## Proyek: Fashion Brand Marketplace Monorepo

Dokumen ini adalah instruksi operasional, standar arsitektur, dan panduan gaya kode (code style) untuk semua **AI Coding Agents** (seperti Antigravity, Cursor, Copilot, dll.) yang bekerja di dalam repositori **Fashion Brand Marketplace Monorepo**.

Dokumen ini membantu agen memahami struktur proyek, teknologi yang digunakan, pembagian peran, serta langkah-langkah verifikasi yang wajib dilakukan sebelum menyelesaikan tugas.

---

## 📌 1. Konteks Proyek & Tech Stack

Proyek ini adalah platform e-commerce marketplace untuk brand fashion yang memisahkan sisi frontend (Next.js) dan backend (Nest.js) menggunakan **Turborepo Monorepo** untuk orkestrasi build dan task runner.

| Sektor | Teknologi Utama | Keterangan / Versi |
| :--- | :--- | :--- |
| **Monorepo** | Turborepo | Menggunakan `pnpm` workspace (`apps/*`) |
| **Frontend** | Next.js 16.x | Menggunakan React 19, TypeScript, App Router |
| **Styling** | Tailwind CSS v4 | Dengan `@tailwindcss/postcss` untuk modern styling |
| **Backend** | Nest.js 11.x | Framework Node.js modular berbasis TypeScript |
| **Testing** | Jest | Unit testing bawaan di backend |

---

## 📂 2. Struktur Direktori Utama

Semua agen wajib mematuhi pemisahan domain dan struktur direktori berikut:

```text
fashion-brand-marketplace/
├── apps/
│   ├── frontend/         # Next.js Application (Storefront & Dashboard)
│   │   ├── app/          # Folder App Router (Halaman, Layouts, API Routes)
│   │   ├── components/   # Komponen UI Reusable
│   │   ├── public/       # Aset Statis (Gambar, Font, SVG, Ikon)
│   │   ├── package.json  # Konfigurasi package & script frontend
│   │   └── tsconfig.json # Konfigurasi TypeScript frontend
│   │
│   └── backend/          # Nest.js Application (REST API & Business Logic)
│       ├── src/          # Source code utama
│       │   ├── modules/  # Modul Fitur (auth, users, products, orders, dll)
│       │   ├── common/   # Decorators, Filters, Guards, Interceptors, Pipes
│       │   └── main.ts   # Entrypoint aplikasi backend
│       ├── test/         # Test integration / E2E
│       ├── package.json  # Konfigurasi package & script backend
│       └── tsconfig.json # Konfigurasi TypeScript backend
│
├── AGENTS.md             # Panduan Developer AI (File ini)
├── package.json          # Konfigurasi root monorepo & script global
├── pnpm-workspace.yaml   # Konfigurasi workspaces pnpm
└── turbo.json            # Konfigurasi pipeline Turborepo
```

---

## 🤖 3. Pembagian Peran AI Agent (Agent Roles)

Saat menerima instruksi, agen harus menyesuaikan pendekatannya dengan peran yang relevan:

### 🎨 A. Frontend Specialist Agent
*   **Fokus**: Merancang antarmuka pengguna (UI/UX) yang premium, responsif, dan interaktif sesuai pedoman visual yang tinggi.
*   **Panduan UI/UX**:
    *   Gunakan Tailwind CSS v4 secara konsisten. Gunakan visual aesthetic modern (seperti glassmorphism, warna harmonis, transisi halus, dan micro-animations).
    *   Desain wajib responsif di semua ukuran layar (Mobile-First).
    *   Terapkan SEO best practices: Tag `<title>` deskriptif, meta description, heading hierarchy (`<h1>` tunggal per halaman), dan tag HTML5 semantik (`<header>`, `<main>`, `<section>`, `<footer>`).
*   **Data Fetching**:
    *   Gunakan React Server Components (RSC) secara default untuk performa load yang cepat dan SEO bersahabat.
    *   Gunakan Client Components (`"use client"`) secara selektif hanya jika membutuhkan state interaktif (`useState`, `useEffect`, event handler).

### ⚙️ B. Backend Specialist Agent
*   **Fokus**: Membangun RESTful API yang aman, berkinerja tinggi, modular, dan terstruktur.
*   **Struktur Nest.js**:
    *   Kelompokkan kode dalam modul (`*.module.ts`), pengendali (`*.controller.ts`), dan layanan (`*.service.ts`).
    *   Gunakan DTO (Data Transfer Object) untuk memvalidasi request payload masuk menggunakan `class-validator` dan `class-transformer`.
*   **Error Handling**:
    *   Gunakan filter exception bawaan Nest.js (seperti `NotFoundException`, `BadRequestException`, `ForbiddenException`) daripada melempar error mentah ke client.

### 🔗 C. Integration Agent
*   **Fokus**: Menyinkronkan tipe data dan API contract antara frontend dan backend.
*   **Panduan**:
    *   Pastikan respons backend ter-type dengan baik. Buat tipe data (interface/type) TypeScript yang selaras di frontend agar type-safety terjaga.

---

## 📜 4. Standar Kode & Aturan Kerja (Code Guidelines)

1.  **Integritas Dokumentasi**:
    *   **Jangan menghapus komentar** atau JSDoc yang tidak berhubungan dengan perubahan kode Anda.
    *   Tulis docstring/JSDoc baru untuk fungsi-fungsi kompleks guna mempermudah pemahaman.
2.  **Keamanan Tipe Data (Type Safety)**:
    *   Hindari penggunaan type `any` di TypeScript. Definisikan `interface` atau `type` dengan spesifik.
    *   Aktifkan type-checking yang ketat dan pastikan tidak ada bypass compile error.
3.  **Clean Code**:
    *   Pisahkan logic bisnis (di service backend atau hooks frontend) dari presentation layer (komponen UI).
    *   Pastikan penamaan variabel dan fungsi deskriptif (misal: `getProductById` bukan `getProd`).

---

## 🚀 5. Perintah Operasional Penting (Cheatsheet)

Semua perintah dijalankan di **root direktori** monorepo menggunakan `pnpm` (disarankan) atau langsung menggunakan CLI `turbo`.

### ⚡ Perintah Global (Semua Workspace secara Paralel)
```bash
# Menginstall seluruh dependensi di semua workspace
pnpm install

# Menjalankan development server secara paralel (Frontend & Backend)
pnpm dev

# Membangun semua aplikasi untuk produksi
pnpm build

# Menjalankan linter untuk memeriksa kualitas kode di seluruh workspace
pnpm lint

# Menjalankan pengujian (Unit Tests) di seluruh workspace
pnpm test
```

### 🎯 Perintah Spesifik Aplikasi (Menggunakan Filter)
Jika Anda hanya ingin menjalankan atau membilas aplikasi tertentu:
```bash
# Menjalankan development server untuk Frontend saja
pnpm --filter frontend dev

# Menjalankan development server dengan watch mode untuk Backend saja
pnpm --filter backend start:dev

# Menjalankan test khusus di Backend saja
pnpm --filter backend test
pnpm --filter backend test:e2e
```

---

## 🛠️ 6. Alur Verifikasi Pekerjaan (Verification Checklist)

Sebelum menyelesaikan tugas atau membuat Pull Request, pastikan Anda telah menyelesaikan langkah verifikasi berikut:

1.  **TypeScript & Build Verification**:
    *   Jalankan `pnpm build` di root direktori untuk memastikan seluruh workspace Next.js dan Nest.js ter-build tanpa ada error kompilasi.
2.  **Linting**:
    *   Jalankan `pnpm lint` di root direktori untuk memverifikasi kualitas penulisan kode di seluruh workspace.
3.  **Testing**:
    *   Jika Anda merubah logika backend, jalankan unit test dengan `pnpm test` (atau `pnpm --filter backend test`) untuk memastikan fungsionalitas berjalan normal dan tidak merusak test yang sudah ada.
4.  **UI & Responsive Check (Khusus Frontend)**:
    *   Pastikan tidak ada layout breaking ketika diuji pada perangkat mobile.
    *   Setiap elemen interaktif (button, input) harus memiliki style `:hover` atau `:focus` yang intuitif.

---
> [!NOTE]
> File panduan ini wajib diperbarui oleh pengembang utama jika terdapat perubahan arsitektur besar seperti pengenalan database ORM (Prisma/TypeORM), konfigurasi monorepo dengan package bersama (shared packages), atau integrasi baru lainnya.
