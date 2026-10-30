"use client";

import React from "react";
import { TrendingUp, TrendingDown, Wallet, Target, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
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
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Saldo Bersih
          </span>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60 shadow-2xs group-hover:scale-105 transition-transform">
            <Wallet className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
        <div className="text-2xl font-black tracking-tight text-slate-900 font-mono mb-1">
          {formatRupiah(netWorth)}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-blue-700 font-semibold bg-blue-50/70 py-0.5 px-2 rounded-md w-fit mt-1">
          <CreditCard className="w-3 h-3" />
          <span>Seluruh Rekening Aktif</span>
        </div>
      </div>

      {/* 2. MONTHLY INCOME CARD */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Pemasukan Bulan Ini
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/60 shadow-2xs group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
        <div className="text-2xl font-black tracking-tight text-emerald-600 font-mono mb-1">
          +{formatRupiah(monthlyIncome)}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 py-0.5 px-2 rounded-md w-fit mt-1">
          <ArrowUpRight className="w-3 h-3" />
          <span>Arus Dana Masuk</span>
        </div>
      </div>

      {/* 3. MONTHLY EXPENSE CARD */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Pengeluaran Bulan Ini
          </span>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/60 shadow-2xs group-hover:scale-105 transition-transform">
            <TrendingDown className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
        <div className="text-2xl font-black tracking-tight text-rose-600 font-mono mb-2">
          -{formatRupiah(monthlyExpense)}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
            <span>Budget Terpakai</span>
            <span className={isOverBudget ? "text-rose-600 font-bold" : "text-slate-700"}>
              {expensePercentage}% dari {formatRupiah(budgetLimit)}
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
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Tabungan Terkumpul
          </span>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/60 shadow-2xs group-hover:scale-105 transition-transform">
            <Target className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
        <div className="text-2xl font-black tracking-tight text-slate-900 font-mono mb-1">
          {formatRupiah(totalSavings)}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-amber-700 font-semibold bg-amber-50 py-0.5 px-2 rounded-md w-fit mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
          <span>Target Finansial Aktif</span>
        </div>
      </div>
    </div>
  );
}
