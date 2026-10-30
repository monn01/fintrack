# FinTrack Design System (DESIGN.md)
**Single Source of Truth for FinTrack UI/UX Architecture**  
*Aligned with Anti-Slop & Semantic Design System Directives*

---

## 1. Visual Atmosphere & Philosophy

* **Atmosphere Archetype:** "Daily App Balanced" (Density: 6/10, Variance: 6/10, Motion: 5/10).
* **Core Philosophy:** *Fintech Clarity & Quiet Luxury*. Pengelolaan keuangan membutuhkan rasa aman, presisi numerik, dan keterbacaan tinggi. Tampilan harus terasa seperti instrumen finansial modern (mirip Stripe atau Linear), bukan dashboard AI generik penuh warna neon atau template murahan.
* **Theme Strategy:** Dark Mode First dengan kontras terkalibrasi tinggi, dipasangkan dengan opsi Light Mode yang hangat (Off-white / Warm Zinc, bukan putih menyilaukan `#ffffff`).

---

## 2. Color Calibration & Palette

| Role | Descriptive Name | Hex Code | Token | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Dark** | Zinc 950 (Off-Black) | `#09090b` | `bg-background` | Latar utama dashboard dark mode |
| **Surface Dark** | Zinc 900 (Deep Slate) | `#18181b` | `bg-card` | Kartu metrics, form container, modal |
| **Border Dark** | Zinc 800 (Subtle Line) | `#27272a` | `border-border` | Garis pemisah komponen & tabel |
| **Canvas Light** | Warm Alabaster | `#f8fafc` | `bg-background-light` | Latar mode terang |
| **Surface Light** | Crisp White | `#ffffff` | `bg-card-light` | Kartu & container mode terang |
| **Border Light** | Zinc 200 | `#e2e8f0` | `border-border-light`| Garis pemisah mode terang |
| **Text Primary** | Zinc 50 / Slate 900 | `#fafafa` / `#0f172a` | `text-foreground` | Judul, angka saldo, label utama |
| **Text Muted** | Zinc 400 / Slate 500 | `#a1a1aa` / `#64748b` | `text-muted-foreground` | Tanggal, sub-kategori, keterangan |
| **Primary Accent** | Emerald 500 (Vibrant Mint) | `#10b981` | `text-accent` / `bg-accent` | Indikator Pemasukan, pertumbuhan, CTA utama |
| **Expense Accent** | Rose 500 (Clean Crimson) | `#f43f5e` | `text-destructive` | Indikator Pengeluaran, peringatan over-budget |
| **Transfer / Neutral** | Sky 500 (Muted Cyan) | `#0ea5e9` | `text-info` | Indikator Transfer antar dompet, target milestone |

### ⛔ Color Anti-Patterns:
* **DILARANG** menggunakan warna dasar hitam murni `#000000`.
* **DILARANG** menggunakan efek "AI Neon Purple/Blue Glow" atau gradien ungu fuchsia klise.
* Semua aksen warna fungsional (hijau untuk pemasukan, merah untuk pengeluaran) harus memiliki saturasi di bawah 80% agar tidak melelahkan mata.

---

## 3. Typographic Architecture

FinTrack menggunakan kombinasi tipografi presisi untuk teks naratif dan angka tabular monospaced untuk seluruh data finansial.

* **Primary Font (UI & Headlines):** `Geist` atau `Satoshi` (Sans-Serif modern berkarakter kuat).
  * *Headings:* `font-semibold tracking-tight`. Kontras hirarki ditentukan oleh ukuran dan ketebalan bobot, bukan screaming caps.
  * *Body Text:* `font-normal leading-relaxed`, batas lebar baris maks 65 karakter untuk kenyamanan membaca.
* **Financial Numbers & Figures Font:** `Geist Mono` atau `JetBrains Mono` (Monospaced).
  * **Wajib** digunakan untuk seluruh nominal mata uang (`Rp 1.450.000`), tanggal transaksi, dan persentase target tabungan. Angka monospaced memastikan penyelarasan desimal vertikal yang rapi pada tabel dan kartu saldo.

### ⛔ Typography Anti-Patterns:
* DILARANG menggunakan font `Inter` (terlalu generik / AI default).
* DILARANG menggunakan font Serif jadul (`Times New Roman`, `Georgia`, dll.) pada komponen data finansial.
* DILARANG menggunakan huruf kapital penuh (*ALL CAPS*) pada kalimat deskripsi transaksi.

---

## 4. Component Stylings & Interaction Rules

### A. Kartu Ringkasan Finansial (Metric Cards)
* **Visual:** Latar `Zinc-900`, border halus `1px solid Zinc-800`, sudut membulat `rounded-xl` (12px).
* **Elevation:** Menggunakan bayangan lembut bertint gelap (`shadow-sm shadow-zinc-950/40`), bukan drop-shadow buram tebal.
* **Nominal Display:** Ukuran teks `text-2xl` atau `text-3xl`, `font-mono font-bold tracking-tight`. Dilengkapi indikator persentase perubahan arus kas dibanding periode sebelumnya.

### B. Tombol Aksi (Buttons & CTAs)
* **Primary Button:** Latar `Zinc-50` (pada Dark mode) dengan teks `Zinc-950` tebal, memberikan kontras taktil instan.
* **Tactile Feedback:** Efek aktif `active:scale-[0.98] transition-all duration-150` memberikan rasa ketukan fisik (*push feedback*).
* **Destructive Button:** Latar `Rose-500/10` dengan teks `Rose-400`, border `Rose-500/20`.

### C. Daftar Transaksi (Transaction Feed)
* Bentuk baris horizontal bersih dengan separator border-bottom tipis `border-zinc-800/60`.
* Ikon kategori di sebelah kiri dengan latar kontras lembut (misal: ikon sendok-garpu dalam lingkaran `bg-zinc-800`).
* Informasi ringkas: Nama merchant/transaksi & dompet di baris atas, jam & kategori di baris bawah.
* Nominal di sebelah kanan rata kanan (`text-right font-mono`), berwarna hijau bertanda `+` untuk pemasukan dan merah bertanda `-` untuk pengeluaran.

### D. Target Tabungan (Savings Goals Progress Bar)
* Progress bar berdesain ramping (`h-2.5 bg-zinc-800 rounded-full overflow-hidden`).
* Isi progress bar menggunakan gradien halus satu nada (*mono-tone gradient*) dari `Emerald-600` ke `Emerald-400`.
* Label persentase pencapaian ditampilkan dengan badge kecil di pojok kanan kartu.

### E. AI Financial Insight Banner
* Bukan modal pop-up yang mengganggu, melainkan widget terintegrasi di dashboard.
* Background: Gradien aksen sangat subtil `from-emerald-950/20 via-zinc-900 to-zinc-900` dengan border tipis `border-emerald-500/30`.
* Dilengkapi ikon bintang/sparkle minimalis, judul ringkasan insight, dan tombol *"Lihat Rekomendasi"* atau *"Terapkan ke Budget"*.

### F. Loading & Empty States
* **Skeletal Loaders:** Menggunakan skeleton abu-abu beranimasi pulse halus dengan dimensi persis sesuai elemen yang dimuat. DILARANG menggunakan spinner lingkaran berputar generik di tengah layar.
* **Empty State:** Menampilkan ilustrasi garis monokrom minimalis atau tipografi informatif tentang langkah pertama yang perlu dilakukan (misal: *"Belum ada transaksi di dompet ini. Tekan tombol Tambah Transaksi di bawah"*).

---

## 5. Layout Architecture & Responsive Strategy

```
+---------------------------------------------------------------------------------+
| TOPBAR: Greeting, Active Period Selector (Bulan Ini), Quick Add Button (+)     |
+-------------------+-------------------------------------------------------------+
| SIDEBAR (Desktop) | MAIN CONTENT AREA                                           |
|                   |                                                             |
| - Dashboard       | [ Net Worth ]  [ Pemasukan Bln Ini ]  [ Pengeluaran Bln Ini]|
| - Transaksi       |                                                             |
| - Target Tabungan | [ AI Insight Widget: Evaluasi Keuangan & Anomali Belanja ]  |
| - Budgeting       |                                                             |
| - Analitik        | [ Cash Flow Area Chart (60%) ]   [ Kategori Donut (40%) ]   |
| - Pengaturan      |                                                             |
|                   | [ Target Tabungan Progress ]     [ Transaksi Terbaru Feed ] |
+-------------------+-------------------------------------------------------------+
| BOTTOM NAV (Mobile Only < 768px): [Home]  [Transaksi]  [(+)]  [Goals]  [Laporan]|
+---------------------------------------------------------------------------------+
```

### Aturan Responsif:
1. **Mobile-First Navigation:** Pada layar di bawah `768px`, sidebar desktop disembunyikan dan digantikan oleh **Floating Bottom Navigation Bar** dengan tombol tengah `(+)` cepat untuk mencatat transaksi saat bepergian.
2. **Zero Horizontal Scroll:** Seluruh tabel dan kartu transaksi harus dapat mengecil secara proporsional atau berubah menjadi kartu tumpuk (*stacked cards*) di layar ponsel pintar.
3. **Touch Targets:** Semua tombol interaktif pada perangkat sentuh memiliki area klik minimal `44px x 44px`.

---

## 6. Motion Philosophy & Micro-Interactions

* **Physics Baseline:** Spring transitions dengan parameter `stiffness: 120, damping: 18` untuk interaksi modal, drawer, dan filter menu.
* **Number Count-Up:** Ketika dashboard pertama kali dibuka, angka saldo utama melakukan transisi hitung cepat (*smooth count-up animation*) selama 400ms.
* **Chart Reveal:** Grafik Recharts melakukan animasi *draw-in* halus saat viewport dimuat.
* **Hardware Acceleration:** Seluruh animasi CSS hanya memanipulasi properti `transform` dan `opacity` untuk menjamin 60-120 FPS tanpa frame drop.

---

## 7. Explicit Anti-Patterns & AI Tells (NEVER DO)

1. **NO EMOJIS:** DILARANG menggunakan emoji (misal: 💰, 🚀, 📈, 🍔) sebagai ikon resmi di tombol atau header. Gunakan **Lucide Icons** dengan stroke `1.5px` seragam.
2. **NO NEON BORDER GLOWS:** DILARANG membuat border dengan bayangan neon bersinar yang membuat UI terlihat murahan.
3. **NO CARPET CARDS:** DILARANG membuat kartu di dalam kartu di dalam kartu (*cards-inside-cards syndrome*). Gunakan spasi negatif dan garis divider tipis untuk membedakan kelompok informasi.
4. **NO SCROLL FILLER TEXT:** DILARANG menyisipkan teks pemanis seperti *"Scroll down to explore"* atau panah animasi ke bawah.
5. **NO BLIND NUMBERS:** Semua angka uang wajib diformat standar IDR yang benar (contoh: `Rp 25.000` bukan `25000` atau `IDR 25000.00`).
