"use client";

import React from "react";
import { TrendingUp, TrendingDown, Wallet, Target } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface MetricCardsProps {
  netWorth: number;
  monthlyIncome: number;
  monthlyExpense: number;
  totalSavings: number;
  budgetLimit: number;
}

export default function MetricCards({
  netWorth,
  monthlyIncome,
  monthlyExpense,
  totalSavings,
  budgetLimit,
}: MetricCardsProps) {
  const expensePercentage = budgetLimit > 0 ? Math.min(100, Math.round((monthlyExpense / budgetLimit) * 100)) : 0;
  const isOverBudget = monthlyExpense > budgetLimit && budgetLimit > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. NET WORTH CARD */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm shadow-slate-200/40 relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Saldo Bersih
          </span>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono mb-1">
          {formatRupiah(netWorth)}
        </div>
        <p className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
          Akumulasi seluruh rekening & dompet
        </p>
      </div>

      {/* 2. MONTHLY INCOME CARD */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm shadow-slate-200/40 relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pemasukan Bulan Ini
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-emerald-600 font-mono mb-1">
          +{formatRupiah(monthlyIncome)}
        </div>
        <p className="text-[11px] text-slate-500 font-medium">
          Gaji & pemasukan terverifikasi
        </p>
      </div>

      {/* 3. MONTHLY EXPENSE CARD */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm shadow-slate-200/40 relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pengeluaran Bulan Ini
          </span>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-rose-600 font-mono mb-1">
          -{formatRupiah(monthlyExpense)}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Batas ({expensePercentage}%)</span>
            <span className={isOverBudget ? "text-rose-600 font-semibold" : "text-slate-600"}>
              Max {formatRupiah(budgetLimit)}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverBudget ? "bg-rose-500" : "bg-blue-600"
              }`}
              style={{ width: `${expensePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. TOTAL SAVINGS CARD */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm shadow-slate-200/40 relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tabungan Terkumpul
          </span>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono mb-1">
          {formatRupiah(totalSavings)}
        </div>
        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
          Dana tersimpan di target tabungan
        </p>
      </div>
    </div>
  );
}
