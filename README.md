# 💰 FinTrack — Personal & Partner Finance Management

Aplikasi pencatatan dan pengelolaan keuangan pribadi modern dengan AI Financial Advisor, visualisasi arus kas interaktif, pelacak target tabungan (*savings goals*), dan dukungan kolaborasi pasangan (*dual-user / household mode*).

---

## 🚀 Fitur Unggulan

1. **Dashboard & Metric Cards**:
   * Total Net Worth (Akumulasi seluruh dompet aktif).
   * Pemasukan & Pengeluaran bulanan dengan batas anggaran (*budget limit bar*).
   * Total Tabungan terkumpul dari target aktif.
2. **AI Financial Intelligence Engine**:
   * **AI Financial Health Advisor**: Evaluasi kesehatan finansial (skor 1-100), analisis pola belanja, deteksi anomali/kebocoran dana, dan strategi alokasi 50/30/20.
   * **AI Smart Quick Logger**: Pencatatan transaksi secepat kilat dengan kalimat bebas (contoh: *"Makan soto 25rb bayar pake gopay"* $\rightarrow$ AI otomatis mendeteksi nominal, kategori, dan dompet).
3. **Multi-Wallet & Rekening**:
   * Rekening Bank (BCA, Mandiri, dll.), E-Wallet (GoPay, OVO), dan Kas Tunai.
   * Fitur transfer antar dompet tanpa merusak catatan arus kas.
   * Label dompet **"Pribadi"** vs **"Bersama Pasangan"**.
4. **Target Tabungan (*Savings Goals*)**:
   * Progress bar visual pencapaian dana.
   * Tenggat waktu (*target date*) & sisa nominal yang harus dikumpulkan.
5. **Visualisasi Interaktif (Recharts)**:
   * Tren Arus Kas (*Cash Flow Area Chart*): Perbandingan income vs expense 6 bulan terakhir.
   * Distribusi Pengeluaran (*Donut Chart*): Porsi pengeluaran per kategori.
6. **Desain Anti-Slop & Mobile-First**:
   * Tema *Dark-mode first* berbasis Zinc-950 elegan (*Fintech Quiet Luxury*).
   * Angka monospaced (`Geist Mono`) untuk presisi finansial.
   * Sidebar untuk desktop & *Floating Bottom Navigation Bar* di layar ponsel.

---

## 🛠️ Tech Stack

* **Frontend & Backend**: Next.js 16 (App Router, Server Actions, React 19)
* **Styling**: Tailwind CSS v4, Lucide Icons
* **Database & ORM**: PostgreSQL (Supabase) + Prisma ORM 7
* **Charts**: Recharts
* **AI Integration**: Vercel AI SDK + Google Gemini 1.5 Flash
* **Deployment**: Vercel-ready

---

## ⚙️ Panduan Menjalankan Proyek

### 1. Jalankan Server Development
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### 2. Konfigurasi Database Supabase & Gemini API
Buka file `.env` di folder proyek dan isi kredensial Anda:

```env
# Koneksi Database PostgreSQL Supabase (Transaction Pooler atau Session Pooler)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# API Key Google Gemini (Dapatkan gratis di https://aistudio.google.com/)
GEMINI_API_KEY="AIzaSy..."
```

### 3. Migrasi Skema ke Supabase
Setelah memasukkan `DATABASE_URL`, jalankan perintah berikut untuk membuat tabel-tabel di Supabase:
```bash
npx prisma db push
```

### 4. Deploy ke Vercel
1. Push repository ke GitHub:
   ```bash
   git add .
   git commit -m "feat: initial fintrack app"
   git push origin main
   ```
2. Buka dashboard [Vercel](https://vercel.com) dan pilih **Add New Project** $\rightarrow$ Import repository GitHub Anda.
3. Masukkan Environment Variables di Vercel:
   * `DATABASE_URL`
   * `GEMINI_API_KEY`
4. Klik **Deploy**!
