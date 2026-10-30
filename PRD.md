# Product Requirements Document (PRD)
## Project Name: FinTrack (Personal & Partner Finance Management)
**Status:** Approved / In Planning  
**Target Deployment:** Vercel  
**Database:** Supabase (PostgreSQL) via Prisma ORM  
**Framework:** Next.js (App Router, Server Actions, TypeScript)  
**Location:** `E:\fintrack`

---

## 1. Executive Summary & Objectives

FinTrack adalah aplikasi web pencatatan dan pengelolaan keuangan pribadi modern yang dirancang untuk penggunaan personal dengan dukungan kolaborasi pasangan (*dual-user / household mode*). 

Sistem ini tidak hanya berfungsi sebagai buku kas digital (*income & expense tracker*), tetapi juga sebagai asisten finansial cerdas (*AI Financial Advisor*) yang menganalisis kebiasaan belanja, memberikan evaluasi kesehatan finansial, memantau batas anggaran (*budgeting*), dan mengawal target tabungan (*savings goals*) secara visual dan terukur.

### Tujuan Utama:
1. **Transparansi Arus Kas**: Mencatat setiap rupiah yang masuk dan keluar secara granular dan real-time.
2. **Kolaborasi Finansial**: Memfasilitasi pencatatan bersama antara pengguna dan pasangan tanpa kehilangan kepemilikan data dompet privat.
3. **Pencapaian Target Tabungan**: Menetapkan target tabungan dengan milestone, proyeksi waktu pencapaian, dan alokasi terencana.
4. **Insight Berbasis AI**: Memberikan rekomendasi actionable, mendeteksi kebocoran pengeluaran (*lifestyle inflation*), dan fitur input transaksi berbasis bahasa alami (*natural language transaction logging*).
5. **Kemudahan Akses & Deploy**: Responsif di desktop maupun mobile (PWA-ready), dideploy secara serverless di Vercel dengan database Supabase.

---

## 2. User Personas & Ruang Lingkup Pengguna

* **Primary User (Pemilik Utama)**:
  * Mengelola seluruh dompet pribadi, tabungan, dan melihat seluruh ringkasan kekayaan bersih (*Net Worth*).
  * Menetapkan budget bulanan dan target tabungan bersama.
* **Secondary User (Pasangan)**:
  * Memiliki akses ke dompet bersama (*Shared Household Wallet*) atau dompet tertentu yang diizinkan.
  * Mampu mencatat pengeluaran/pemasukan harian secara instan.
  * Melihat progress tabungan bersama (misal: "Dana Pernikahan", "Liburan Akhir Tahun", "Renovasi").

---

## 3. Fitur & Kebutuhan Fungsional (Functional Requirements)

### 3.1. Multi-Wallet & Account Management
* **Tipe Akun/Dompet**:
  * Bank Rekening (BCA, Mandiri, Jago, dll.)
  * E-Wallet (GoPay, OVO, ShopeePay, Dana)
  * Cash / Dompet Fisik
  * Tabungan / Deposito / Reksadana (Investment Pool)
* **Kategori Visibilitas**:
  * *Private Wallet* (Hanya terlihat oleh pemilik)
  * *Shared Wallet* (Dapat dilihat dan dicatat oleh pasangan)
* **Fitur Transfer Antar Dompet**:
  * Pemindahan dana antar rekening tanpa dihitung sebagai pengeluaran/pemasukan baru.
  * Pencatatan biaya admin transaksi jika ada.

### 3.2. Pencatatan Transaksi Granular (Income & Expense Engine)
* **Form Transaksi Detail**:
  * Jenis: Pemasukan (*Income*), Pengeluaran (*Expense*), Transfer (*Transfer*).
  * Jumlah Nominal (Format Rupiah IDR).
  * Dompet Sumber / Dompet Tujuan.
  * Tanggal & Waktu Transaksi.
  * Kategori Utama & Sub-kategori (misal: Kategori `Makan & Minum` $\rightarrow$ Sub-kategori `Kopi / Cafe`, `Bahan Masak`, `Dine-out`).
  * Catatan / Deskripsi.
  * Tagar (*Tags*, misal: `#weekend`, `#hobi`, `#urgent`).
  * Lampiran Bukti / Struk (*Receipt Upload* ke Supabase Storage).
* **Transaksi Berulang (*Recurring Transactions*)**:
  * Otomatisasi pengeluaran rutin bulanan (Tagihan Wifi, Netflix, Listrik PLN, Kos/Sewa, Cicilan).
  * Pengingat tanggal jatuh tempo pembayaran (*Bill Due Reminder*).

### 3.3. Target Tabungan & Budgeting (Savings Goals & Allocations)
* **Savings Goals**:
  * Target nominal (Target Amount).
  * Nominal terkumpul saat ini (Current Saved Amount).
  * Tanggal tenggat waktu target (*Target Date*).
  * Fitur Setor / Tarik tabungan secara manual maupun alokasi terjadwal.
  * Visualisasi progress bar & kalkulasi sisa waktu serta rekomendasi tabungan per hari/minggu/bulan.
* **Kategori Budgeting Bulanan**:
  * Penentuan batas pengeluaran per kategori (misal: Hiburan max Rp 800.000/bulan).
  * Progress indikator (*Safe*, *Warning > 80%*, *Exceeded*).
  * Notifikasi visual saat pengeluaran mendekati atau melebihi batas.

### 3.4. Visualisasi & Analisis Grafik (Analytics & Reporting)
* **Cash Flow Trend**: Grafik garis/area perbandingan arus kas pemasukan vs pengeluaran (harian, mingguan, bulanan, tahunan).
* **Category Breakdown**: Donut / Pie chart interaktif untuk melihat porsi pengeluaran per kategori.
* **Net Worth Tracker**: Grafik pertumbuhan akumulasi aset/saldo dari seluruh dompet aktif.
* **Kalender Pengeluaran**: Heatmap pengeluaran harian untuk melacak hari-hari dengan pengeluaran terbesar (*impulse buying days*).
* **Laporan & Ekspor**:
  * Filter rentang tanggal fleksibel (Custom Date Range).
  * Ekspor data ke format CSV / Excel / PDF Summary.

### 3.5. AI Financial Intelligence Engine
* **AI Financial Advisor / Coach**:
  * Evaluasi kesehatan keuangan bulanan (Rasio Tabungan terhadap Pemasukan, Rasio Kebutuhan vs Keinginan 50/30/20).
  * Deteksi anomali pengeluaran (misal: lonjakan pengeluaran makan di luar dibanding 3 bulan sebelumnya).
  * Saran konkret dan realistis (misal: *"Jika Anda mengurangi jajan kopi 3x seminggu, target tabungan Laptop Anda akan tercapai 1.5 bulan lebih cepat"*).
* **AI Quick Natural Language Logger**:
  * Input transaksi instan via prompt teks singkat (Contoh: *"Makan soto 25rb bayar pake gopay tadi siang"*).
  * AI mengekstrak: nominal, tipe (`Expense`), kategori (`Makan & Minum`), akun (`GoPay`), dan tanggal/jam.
* **AI Receipt OCR (Opsional Fase Lanjutan)**:
  * Pemindaian foto struk belanjaan untuk diekstrak menjadi item dan total transaksi otomatis.

### 3.6. Autentikasi & Kolaborasi Pengguna
* Login aman menggunakan Supabase Auth (Email Password atau Magic Link / OAuth Google).
* Role & Household Pairing:
  * Fitur Invite Partner via kode/email unik.
  * Izin akses data: Dompet Bersama (*Shared*) dapat diakses bersama, dompet privat tetap terisolasi.

---

## 4. Arsitektur Teknis & Tech Stack

| Komponen | Pilihan Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router, Server Actions) | Full-stack React, SSR/SSG teroptimasi, native di Vercel |
| **Language** | TypeScript | Type safety end-to-end |
| **Styling & UI** | Tailwind CSS + Radix UI (shadcn/ui) | Desain modular, modern, dan sangat ringan |
| **Database & Auth** | Supabase (PostgreSQL + Auth + Storage) | Serverless Postgres, autentikasi aman, file storage bukti struk |
| **ORM** | Prisma ORM | Manajemen skema database, migrasi otomatis, query type-safe |
| **Visualisasi Data** | Recharts | Visualisasi grafik interaktif & responsif |
| **AI Integration** | Vercel AI SDK + Google Gemini 1.5 Flash API | Cepat, efisien biaya, dan latensi rendah |
| **Deployment** | Vercel | Automated CI/CD, Edge network global |

---

## 5. Rencana Skema Database (Prisma Preview)

```prisma
model User {
  id             String         @id @default(uuid())
  email          String         @unique
  name           String?
  householdId    String?
  household      Household?     @relation(fields: [householdId], references: [id])
  wallets        Wallet[]
  transactions   Transaction[]
  budgets        Budget[]
  savingsGoals   SavingsGoal[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
}

model Household {
  id             String         @id @default(uuid())
  name           String
  users          User[]
  sharedWallets  Wallet[]
  sharedGoals    SavingsGoal[]
  createdAt      DateTime       @default(now())
}

model Wallet {
  id             String         @id @default(uuid())
  name           String         // misal: BCA, GoPay, Dompet Tunai
  type           WalletType     // BANK, EWALLET, CASH, INVESTMENT
  balance        Decimal        @default(0)
  currency       String         @default("IDR")
  isShared       Boolean        @default(false)
  userId         String
  user           User           @relation(fields: [userId], references: [id])
  householdId    String?
  household      Household?     @relation(fields: [householdId], references: [id])
  transactions   Transaction[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
}

model Category {
  id             String         @id @default(uuid())
  name           String
  type           TransactionType // INCOME or EXPENSE
  icon           String?
  color          String?
  transactions   Transaction[]
  budgets        Budget[]
}

model Transaction {
  id             String          @id @default(uuid())
  type           TransactionType // INCOME, EXPENSE, TRANSFER
  amount         Decimal
  date           DateTime        @default(now())
  description    String?
  tags           String[]
  receiptUrl     String?
  
  walletId       String
  wallet         Wallet          @relation(fields: [walletId], references: [id])
  
  categoryId     String?
  category       Category?       @relation(fields: [categoryId], references: [id])
  
  destinationWalletId String?   // Khusus transfer antar dompet
  
  userId         String
  user           User            @relation(fields: [userId], references: [id])
  
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}

model Budget {
  id             String          @id @default(uuid())
  amount         Decimal         // Batas maksimum nominal per bulan
  periodMonth    Int             // 1 - 12
  periodYear     Int             // misal: 2026
  categoryId     String
  category       Category        @relation(fields: [categoryId], references: [id])
  userId         String
  user           User            @relation(fields: [userId], references: [id])
}

model SavingsGoal {
  id             String          @id @default(uuid())
  title          String
  targetAmount   Decimal
  currentAmount  Decimal         @default(0)
  targetDate     DateTime?
  isShared       Boolean         @default(false)
  userId         String
  user           User            @relation(fields: [userId], references: [id])
  householdId    String?
  household      Household?      @relation(fields: [householdId], references: [id])
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}

enum WalletType {
  BANK
  EWALLET
  CASH
  INVESTMENT
}

enum TransactionType {
  INCOME
  EXPENSE
  TRANSFER
}
```

---

## 6. Roadmap Pengembangan

* **Fase 1: Fondasi Sistem (Core MVP)**
  * Inisialisasi Next.js 15 + Prisma + Supabase setup.
  * Autentikasi Pengguna & skema database inti.
  * Modul Dompet (*Wallets*) & Kategori bawaan.
  * CRUD Transaksi Pengeluaran & Pemasukan dengan kalkulasi saldo otomatis.
* **Fase 2: Target Finansial & Grafik Analitik**
  * Modul Savings Goals (Target Tabungan) dengan progress tracker.
  * Modul Budget Limit per Kategori.
  * Halaman Statistik: Grafik Arus Kas, Donut Distribusi Kategori, dan Ringkasan Bulanan.
* **Fase 3: Household Sharing & Fitur AI**
  * Fitur Household / Invite Partner (Berbagi dompet dan tabungan tertentu).
  * Integrasi Vercel AI SDK + Gemini API:
    * Rekomendasi keuangan & deteksi anomali belanja.
    * Input transaksi teks bebas (*Natural Language Logging*).
* **Fase 4: Polishing & Deployment**
  * Audit UX, responsivitas mobile-first, dan micro-interactions.
  * Deployment ke Vercel dan sinkronisasi database production Supabase.
