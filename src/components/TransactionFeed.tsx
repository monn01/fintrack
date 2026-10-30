"use client";

import React, { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Search, Filter } from "lucide-react";
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
    <div className="p-5 rounded-2xl bg-[#121215] border border-[#27272a] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Riwayat Transaksi</h3>
          <p className="text-xs text-zinc-500">Seluruh catatan uang masuk, keluar, dan transfer</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* SEARCH BAR */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#09090b] border border-[#27272a] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 w-36 sm:w-48"
            />
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex items-center bg-[#09090b] border border-[#27272a] rounded-xl p-0.5 text-xs">
            {["ALL", "EXPENSE", "INCOME", "TRANSFER"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer text-[11px] ${
                  filterType === type
                    ? "bg-[#18181b] text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {type === "ALL" ? "Semua" : type === "EXPENSE" ? "Keluar" : type === "INCOME" ? "Masuk" : "Transfer"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TRANSACTION LIST */}
      <div className="divide-y divide-[#27272a]/60">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500">
            Tidak ada transaksi yang cocok dengan kriteria pencarian.
          </div>
        ) : (
          filtered.map((t) => {
            const isIncome = t.type === "INCOME";
            const isExpense = t.type === "EXPENSE";
            const isTransfer = t.type === "TRANSFER";

            return (
              <div
                key={t.id}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-[#18181b]/30 px-2 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isIncome
                        ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20"
                        : isExpense
                        ? "bg-rose-950/40 text-rose-400 border-rose-500/20"
                        : "bg-sky-950/40 text-sky-400 border-sky-500/20"
                    }`}
                  >
                    {isIncome && <ArrowDownLeft className="w-4 h-4" />}
                    {isExpense && <ArrowUpRight className="w-4 h-4" />}
                    {isTransfer && <ArrowLeftRight className="w-4 h-4" />}
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {t.description}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                      <span className="text-zinc-400">{t.category}</span>
                      <span>•</span>
                      <span className="font-mono text-zinc-400">
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
                        ? "text-emerald-400"
                        : isExpense
                        ? "text-rose-400"
                        : "text-sky-400"
                    }`}
                  >
                    {isIncome ? `+${formatRupiah(t.amount)}` : isExpense ? `-${formatRupiah(t.amount)}` : formatRupiah(t.amount)}
                  </p>
                  {t.tags && t.tags.length > 0 && (
                    <div className="flex items-center justify-end gap-1 mt-1">
                      {t.tags.map((tag) => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded">
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
