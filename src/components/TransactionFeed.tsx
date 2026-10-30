"use client";

import React, { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Search } from "lucide-react";
import { formatRupiah, formatDateIndo } from "@/lib/utils";

export interface TransactionItem {
  id: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  category: string;
  wallet: string;
  destinationWallet?: string;
  date: string;
  description: string;
  tags?: string[];
}

interface TransactionFeedProps {
  transactions: TransactionItem[];
}

export default function TransactionFeed({ transactions }: TransactionFeedProps) {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filtered = transactions.filter((t) => {
    if (filterType !== "ALL" && t.type !== filterType) return false;
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      return (
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.wallet.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm shadow-slate-200/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Riwayat Transaksi</h3>
          <p className="text-xs text-slate-500">Catatan mutasi uang masuk, keluar, dan transfer</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* SEARCH BAR */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 w-36 sm:w-48 font-medium"
            />
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5 text-xs">
            {["ALL", "EXPENSE", "INCOME", "TRANSFER"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer text-[11px] ${
                  filterType === type
                    ? "bg-white text-blue-700 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {type === "ALL" ? "Semua" : type === "EXPENSE" ? "Keluar" : type === "INCOME" ? "Masuk" : "Transfer"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TRANSACTION LIST */}
      <div className="divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 font-medium">
            Belum ada data transaksi yang sesuai.
          </div>
        ) : (
          filtered.map((t) => {
            const isIncome = t.type === "INCOME";
            const isExpense = t.type === "EXPENSE";
            const isTransfer = t.type === "TRANSFER";

            return (
              <div
                key={t.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isIncome
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : isExpense
                        ? "bg-rose-50 text-rose-600 border-rose-200"
                        : "bg-blue-50 text-blue-600 border-blue-200"
                    }`}
                  >
                    {isIncome && <ArrowDownLeft className="w-4 h-4" />}
                    {isExpense && <ArrowUpRight className="w-4 h-4" />}
                    {isTransfer && <ArrowLeftRight className="w-4 h-4" />}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {t.description}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-medium">
                      <span className="text-slate-600">{t.category}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-500">
                        {isTransfer ? `${t.wallet} ➔ ${t.destinationWallet}` : t.wallet}
                      </span>
                      <span>•</span>
                      <span>{formatDateIndo(t.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-bold font-mono tracking-tight ${
                      isIncome
                        ? "text-emerald-600"
                        : isExpense
                        ? "text-rose-600"
                        : "text-blue-600"
                    }`}
                  >
                    {isIncome ? `+${formatRupiah(t.amount)}` : isExpense ? `-${formatRupiah(t.amount)}` : formatRupiah(t.amount)}
                  </p>
                  {t.tags && t.tags.length > 0 && (
                    <div className="flex items-center justify-end gap-1 mt-1">
                      {t.tags.map((tag) => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
