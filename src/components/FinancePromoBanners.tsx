"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  ChevronRight,
  X,
  Calculator,
  ShieldCheck,
  Heart,
  TrendingUp,
  ArrowRight,
  Info,
  CheckCircle2,
  DollarSign,
  PiggyBank,
  BadgePercent
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface PromoItem {
  id: string;
  category: "invest" | "tips" | "couple" | "safety";
  badge: string;
  badgeBg: string;
  title: string;
  shortDesc: string;
  imageSrc: string;
  ctaText: string;
  modalTitle: string;
  modalDesc: string;
  keyPoints: string[];
}

const PROMOS: PromoItem[] = [
  {
    id: "promo-invest",
    category: "invest",
    badge: "PROMO FINANSIAL",
    badgeBg: "bg-blue-600 text-white",
    title: "Cashback Investasi 25% & Tabungan Rutin",
    shortDesc: "Mulai sisihkan uang dingin ke instrumen reksadana & obligasi negara. Bebas pajak & imbal hasil optimal.",
    imageSrc: "/banners/banner-invest.png",
    ctaText: "Cek Simulasi Investasi",
    modalTitle: "Simulasi Tumbuh Aset & Cashback 25%",
    modalDesc: "Bangun kebiasaan menyisihkan uang setiap awal bulan setelah gajian. FinTrack mendukung otomasi alokasi ke dompet tabungan dan investasi.",
    keyPoints: [
      "Return rata-rata 6% - 10% per tahun mengalahkan inflasi",
      "Bebas biaya admin bulanan dan bisa dicairkan kapan saja",
      "Pemisahan saldo tabungan menjaga uang tidak terpakai untuk belanja konsumtif",
    ],
  },
  {
    id: "promo-budget",
    category: "tips",
    badge: "TIPS FINANSIAL",
    badgeBg: "bg-emerald-600 text-white",
    title: "Rumus Anti Boncos: Metode 50 / 30 / 20",
    shortDesc: "Bagi pemasukan: 50% Kebutuhan Pokok, 30% Gaya Hidup & Hiburan, 20% Tabungan & Investasi Masa Depan.",
    imageSrc: "/banners/banner-budget.png",
    ctaText: "Hitung Porsi Gaji",
    modalTitle: "Kalkulator Cerdas Alokasi Gaji 50/30/20",
    modalDesc: "Rumus baku keuangan personal yang digunakan perencana keuangan global agar cashflow selalu sehat tanpa utang konsumtif.",
    keyPoints: [
      "50% Kebutuhan Wajib: Cicilan, listrik, makan pokok, belanja dapur, pulsa/internet",
      "30% Keinginan: Liburan, makan di restoran, hobi, belanja pakaian",
      "20% Investasi & Tabungan: Dana darurat, reksadana, tabungan pensiun",
    ],
  },
  {
    id: "promo-couple",
    category: "couple",
    badge: "DUAL WALLET PRO",
    badgeBg: "bg-purple-600 text-white",
    title: "Capai Target Impian Bersama Pasangan",
    shortDesc: "Tabungan nikah, DP rumah idaman, hingga liburan impian berdua lebih transparan dan terpantau real-time.",
    imageSrc: "/banners/banner-couple.png",
    ctaText: "Set Target Bersama",
    modalTitle: "Strategi Keuangan Harmonis Monn & Pasangan",
    modalDesc: "Kunci hubungan finansial yang sehat adalah transparansi. Gunakan fitur Dual User FinTrack untuk menyatukan visi masa depan.",
    keyPoints: [
      "Transparansi penuh pengeluaran bersama tanpa saling curiga",
      "Target tabungan bersama terpisah dari dompet pribadi masing-masing",
      "Reminder tagihan bulanan wajib agar tidak ada denda keterlambatan",
    ],
  },
  {
    id: "promo-emergency",
    category: "safety",
    badge: "PROTEKSI FINANSIAL",
    badgeBg: "bg-amber-600 text-white",
    title: "Siapkan Dana Siaga Minimal 6x Pengeluaran",
    shortDesc: "Lindungi stabilitas keuangan keluarga dari situasi mendadak atau kehilangan pemasukan tanpa perlu pinjol.",
    imageSrc: "/banners/banner-emergency.png",
    ctaText: "Cek Hitungan Proteksi",
    modalTitle: "Perhitungan Dana Darurat Ideal",
    modalDesc: "Dana darurat adalah pilar dasar piramida finansial sebelum memulai investasi agresif.",
    keyPoints: [
      "Lajang: Minimal 3 hingga 4 kali total pengeluaran rutin bulanan",
      "Menikah / Pasangan: Minimal 6 kali total pengeluaran rutin bulanan",
      "Wajib disimpan di rekening likuid (Tabungan Bank / Reksadana Pasar Uang)",
    ],
  },
];

interface Props {
  onOpenAddGoal?: () => void;
  monthlyExpense?: number;
}

export default function FinancePromoBanners({ onOpenAddGoal, monthlyExpense = 0 }: Props) {
  const [selectedPromo, setSelectedPromo] = useState<PromoItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Calculator states inside modal
  const [calcSalary, setCalcSalary] = useState<number>(8000000);
  const [calcExpense, setCalcExpense] = useState<number>(monthlyExpense > 0 ? monthlyExpense : 4500000);

  const filteredPromos =
    filterCategory === "all"
      ? PROMOS
      : PROMOS.filter((p) => p.category === filterCategory);

  return (
    <section className="space-y-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Promo & Insight Finansial
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-blue-100 text-[#0052cc]">
              <Sparkles className="w-3 h-3 text-[#0052cc]" />
              Terbaru
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Edukasi keuangan pintar, tips bebas boncos, & program tabungan FinTrack
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer btn-tactile ${
              filterCategory === "all"
                ? "bg-[#0052cc] text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Semua Info
          </button>
          <button
            onClick={() => setFilterCategory("invest")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer btn-tactile ${
              filterCategory === "invest"
                ? "bg-[#0052cc] text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Investasi
          </button>
          <button
            onClick={() => setFilterCategory("tips")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer btn-tactile ${
              filterCategory === "tips"
                ? "bg-[#0052cc] text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Tips 50/30/20
          </button>
          <button
            onClick={() => setFilterCategory("couple")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer btn-tactile ${
              filterCategory === "couple"
                ? "bg-[#0052cc] text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Bersama Pasangan
          </button>
        </div>
      </div>

      {/* BANNER CARDS GRID / CAROUSEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPromos.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedPromo(item)}
            className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between card-tap"
          >
            {/* Image Banner */}
            <div className="relative w-full aspect-[2/1] overflow-hidden bg-slate-900">
              <Image
                src={item.imageSrc}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className={`px-2.5 py-1 rounded-md text-2xs font-extrabold tracking-wide uppercase shadow-sm ${item.badgeBg}`}>
                  {item.badge}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-[#0052cc] transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.shortDesc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0052cc]">
                <span className="flex items-center gap-1 group-hover:underline">
                  {item.ctaText}
                </span>
                <div className="w-7 h-7 rounded-full bg-blue-50 group-hover:bg-[#0052cc] group-hover:text-white flex items-center justify-center transition-colors icon-pop">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* INTERACTIVE DETAIL / CALCULATOR MODAL */}
      {selectedPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
            {/* Modal Image Header */}
            <div className="relative w-full aspect-[21/9] bg-slate-900">
              <Image
                src={selectedPromo.imageSrc}
                alt={selectedPromo.title}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setSelectedPromo(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5">
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded text-2xs font-extrabold uppercase mb-2 ${selectedPromo.badgeBg}`}>
                  {selectedPromo.badge}
                </span>
                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {selectedPromo.modalTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {selectedPromo.modalDesc}
                </p>
              </div>

              {/* Specific Interactive Feature based on category */}
              {selectedPromo.category === "tips" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Calculator className="w-4 h-4 text-emerald-600" />
                      Simulasi Gaji Kamu:
                    </span>
                    <span className="text-sm font-extrabold text-emerald-700">
                      {formatRupiah(calcSalary)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3000000"
                    max="30000000"
                    step="500000"
                    value={calcSalary}
                    onChange={(e) => setCalcSalary(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <p className="text-2xs text-slate-500 font-semibold">50% Wajib</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                        {formatRupiah(calcSalary * 0.5)}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <p className="text-2xs text-slate-500 font-semibold">30% Keinginan</p>
                      <p className="text-xs sm:text-sm font-bold text-blue-600 mt-0.5">
                        {formatRupiah(calcSalary * 0.3)}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <p className="text-2xs text-slate-500 font-semibold">20% Tabungan</p>
                      <p className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5">
                        {formatRupiah(calcSalary * 0.2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedPromo.category === "safety" && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      Pengeluaran Rutin Kamu:
                    </span>
                    <span className="text-sm font-extrabold text-amber-800">
                      {formatRupiah(calcExpense)}/bln
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2000000"
                    max="15000000"
                    step="500000"
                    value={calcExpense}
                    onChange={(e) => setCalcExpense(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="p-2.5 rounded-lg bg-white border border-amber-100">
                      <p className="text-2xs text-slate-500 font-medium">Lajang (3x)</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {formatRupiah(calcExpense * 3)}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-amber-100">
                      <p className="text-2xs text-slate-500 font-medium">Pasangan (6x)</p>
                      <p className="text-sm font-bold text-amber-600 mt-0.5">
                        {formatRupiah(calcExpense * 6)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key takeaways */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Poin Penting:
                </h5>
                <ul className="space-y-1.5">
                  {selectedPromo.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2">
                {selectedPromo.category === "couple" && onOpenAddGoal ? (
                  <button
                    onClick={() => {
                      setSelectedPromo(null);
                      onOpenAddGoal();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 btn-tactile"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    Buat Target Bersama Sekarang
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedPromo(null)}
                    className="flex-1 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0747a6] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer btn-tactile"
                  >
                    Mengerti & Terapkan
                  </button>
                )}
                <button
                  onClick={() => setSelectedPromo(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer btn-tactile"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
