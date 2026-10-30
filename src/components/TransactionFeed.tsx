"use client";

import React, { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Search, FileText, Pencil, Trash2 } from "lucide-react";
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
  onEditTransaction?: (tx: TransactionItem) => void;
  onDeleteTransaction?: (txId: string) => void;
}

export default function TransactionFeed({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
}: TransactionFeedProps) {
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
    <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900">Riwayat Mutasi Transaksi</h3>
          <p className="text-xs text-slate-500 font-medium">Catatan uang masuk, pengeluaran harian, dan transfer saldo</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* SEARCH INPUT */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0052cc] w-40 sm:w-56 font-medium"
            />
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {[
              { id: "ALL", label: "Semua" },
              { id: "EXPENSE", label: "Keluar" },
              { id: "INCOME", label: "Masuk" },
              { id: "TRANSFER", label: "Transfer" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer btn-tactile ${
                  filterType === tab.id
                    ? "bg-white text-[#0052cc] shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TRANSACTION LIST */}
      <div className="divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="py-14 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Belum ada riwayat transaksi</p>
            <p className="text-xs text-slate-400 mt-0.5">Catat pengeluaran atau pemasukan pertama Anda di atas.</p>
          </div>
        ) : (
          filtered.map((t) => {
            const isIncome = t.type === "INCOME";
            const isExpense = t.type === "EXPENSE";
            const isTransfer = t.type === "TRANSFER";

            return (
              <div
                key={t.id}
                className="py-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      isIncome
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : isExpense
                        ? "bg-rose-50 text-rose-600 border-rose-200"
                        : "bg-blue-50 text-[#0052cc] border-blue-200"
                    }`}
                  >
                    {isIncome && <ArrowDownLeft className="w-5 h-5 stroke-[2]" />}
                    {isExpense && <ArrowUpRight className="w-5 h-5 stroke-[2]" />}
                    {isTransfer && <ArrowLeftRight className="w-5 h-5 stroke-[2]" />}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0052cc] transition-colors">
                      {t.description}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                      <span className="text-slate-700 font-semibold">{t.category}</span>
                      <span>•</span>
                      <span className="text-slate-500">
                        {isTransfer ? `${t.wallet} ➔ ${t.destinationWallet}` : t.wallet}
                      </span>
                      <span>•</span>
                      <span>{formatDateIndo(t.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p
                      className={`text-base font-extrabold font-numeric tracking-tight ${
                        isIncome
                          ? "text-emerald-600"
                          : isExpense
                          ? "text-rose-600"
                          : "text-[#0052cc]"
                      }`}
                    >
                      {isIncome ? `+${formatRupiah(t.amount)}` : isExpense ? `-${formatRupiah(t.amount)}` : formatRupiah(t.amount)}
                    </p>
                    {t.tags && t.tags.length > 0 && (
                      <div className="flex items-center justify-end gap-1 mt-1">
                        {t.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {(onEditTransaction || onDeleteTransaction) && (
                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      {onEditTransaction && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditTransaction(t);
                          }}
                          title="Edit Transaksi"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      {onDeleteTransaction && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTransaction(t.id);
                          }}
                          title="Hapus Transaksi"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
