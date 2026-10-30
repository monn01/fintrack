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
      {/* NET WORTH CARD */}
      <div className="p-5 rounded-2xl bg-[#121215] border border-[#27272a] shadow-sm relative overflow-hidden group">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Total Kekayaan Bersih</span>
          <div className="p-2 rounded-xl bg-zinc-800/80 text-zinc-300">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono mb-2">
          {formatRupiah(netWorth)}
        </div>
        <p className="text-xs text-zinc-500 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Akumulasi seluruh dompet aktif
        </p>
      </div>

      {/* MONTHLY INCOME CARD */}
      <div className="p-5 rounded-2xl bg-[#121215] border border-[#27272a] shadow-sm relative overflow-hidden group">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Pemasukan Bulan Ini</span>
          <div className="p-2 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-bold tracking-tight text-emerald-400 font-mono mb-2">
          +{formatRupiah(monthlyIncome)}
        </div>
        <p className="text-xs text-zinc-400">
          Gaji & pemasukan terverifikasi
        </p>
      </div>

      {/* MONTHLY EXPENSE CARD */}
      <div className="p-5 rounded-2xl bg-[#121215] border border-[#27272a] shadow-sm relative overflow-hidden group">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Pengeluaran Bulan Ini</span>
          <div className="p-2 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-500/20">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-bold tracking-tight text-rose-400 font-mono mb-2">
          -{formatRupiah(monthlyExpense)}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-zinc-400">
            <span>Batas Budget ({expensePercentage}%)</span>
            <span className={isOverBudget ? "text-rose-400 font-medium" : "text-zinc-500"}>
              Max {formatRupiah(budgetLimit)}
            </span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverBudget ? "bg-rose-500" : "bg-emerald-500"
              }`}
              style={{ width: `${expensePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* SAVINGS GOALS SUMMARY CARD */}
      <div className="p-5 rounded-2xl bg-[#121215] border border-[#27272a] shadow-sm relative overflow-hidden group">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Tabungan Terkumpul</span>
          <div className="p-2 rounded-xl bg-sky-950/40 text-sky-400 border border-sky-500/20">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono mb-2">
          {formatRupiah(totalSavings)}
        </div>
        <p className="text-xs text-sky-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
          Dana tersimpan di target tabungan
        </p>
      </div>
    </div>
  );
}
