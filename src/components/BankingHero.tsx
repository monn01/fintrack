"use client";

import React, { useState } from "react";
import { 
  Wallet, 
  Eye, 
  EyeOff, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PiggyBank, 
  CreditCard,
  Plus,
  Send,
  Sparkles
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface BankingHeroProps {
  userName: string;
  isPartner: boolean;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpense: number;
  totalSavings: number;
  onOpenQuickAdd: () => void;
  onOpenAddWallet: () => void;
  onOpenAddGoal: () => void;
}

export default function BankingHero({
  userName,
  isPartner,
  netWorth,
  monthlyIncome,
  monthlyExpense,
  totalSavings,
  onOpenQuickAdd,
  onOpenAddWallet,
  onOpenAddGoal,
}: BankingHeroProps) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
      {/* TOP: USER SALUTATION & QUICK PRIVACY TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
            {isPartner ? "Ruang Keuangan Pasangan" : "Rekening Pribadi & Bersama"}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Selamat Datang, {userName} 👋
          </h2>
        </div>

        {/* QUICK SHORTCUT BUTTONS (SEPERTI MENU myBCA / GOPAY) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0747a6] text-white text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Catat Transaksi</span>
          </button>

          <button
            onClick={onOpenAddWallet}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Tambah Rekening</span>
          </button>
        </div>
      </div>

      {/* CENTER: PRIMARY BALANCE DISPLAY (BIG & READABLE LIKE DIGITAL BANKING) */}
      <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* TOTAL BALANCE HERO CARD */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#0052cc] to-[#0747a6] rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-blue-100 text-xs font-semibold mb-2">
            <span>TOTAL SALDO AKTIF</span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-xs"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showBalance ? "Sembunyikan" : "Tampilkan"}</span>
            </button>
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-numeric my-2 text-white">
            {showBalance ? formatRupiah(netWorth) : "Rp ••••••••••"}
          </div>

          <p className="text-xs text-blue-100/90 font-medium">
            Akumulasi dari seluruh rekening bank, e-wallet, dan kas tunai.
          </p>
        </div>

        {/* 3 FINANCIAL SUMMARY METRICS (INCOME, EXPENSE, SAVINGS) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* INCOME */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Pemasukan</span>
              <div className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-base sm:text-lg font-bold text-emerald-600 font-numeric">
              {showBalance ? `+${formatRupiah(monthlyIncome)}` : "Rp •••"}
            </div>
            <span className="text-[11px] text-slate-400 font-medium mt-1">Bulan berjalan</span>
          </div>

          {/* EXPENSE */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Pengeluaran</span>
              <div className="p-1 rounded-md bg-rose-100 text-rose-700">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-base sm:text-lg font-bold text-rose-600 font-numeric">
              {showBalance ? `-${formatRupiah(monthlyExpense)}` : "Rp •••"}
            </div>
            <span className="text-[11px] text-slate-400 font-medium mt-1">Bulan berjalan</span>
          </div>

          {/* TOTAL SAVINGS */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Tabungan</span>
              <div className="p-1 rounded-md bg-amber-100 text-amber-700">
                <PiggyBank className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-800 font-numeric">
              {showBalance ? formatRupiah(totalSavings) : "Rp •••"}
            </div>
            <span className="text-[11px] text-slate-400 font-medium mt-1">Target aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
}
