"use client";

import React from "react";
import { Building2, Smartphone, Banknote, ShieldCheck, Plus, Users, ArrowUpRight } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export interface WalletItem {
  id: string;
  name: string;
  type: "BANK" | "EWALLET" | "CASH" | "INVESTMENT";
  balance: number;
  isShared: boolean;
  accountNumber?: string;
}

interface WalletListProps {
  wallets: WalletItem[];
  onAddWallet?: () => void;
}

export default function WalletList({ wallets, onAddWallet }: WalletListProps) {
  const getWalletIcon = (type: string) => {
    switch (type) {
      case "BANK":
        return <Building2 className="w-4 h-4 text-sky-400" />;
      case "EWALLET":
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case "CASH":
        return <Banknote className="w-4 h-4 text-amber-400" />;
      case "INVESTMENT":
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      default:
        return <Building2 className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#121215] border border-[#27272a] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Dompet & Rekening</h3>
          <p className="text-xs text-zinc-500">Daftar saldo per akun dan dompet bersama pasangan</p>
        </div>
        {onAddWallet && (
          <button
            onClick={onAddWallet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18181b] hover:bg-zinc-800 border border-[#27272a] text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        )}
      </div>

      {wallets.length === 0 ? (
        <div className="py-10 px-4 rounded-xl bg-[#09090b]/60 border border-dashed border-[#27272a] text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-400 mb-2">
            <Building2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-white">Belum ada dompet atau rekening</p>
          <p className="text-[11px] text-zinc-500 max-w-sm mt-0.5 mb-3">
            Tambahkan rekening bank, e-wallet (GoPay, OVO), atau kas tunai pertama Anda untuk mulai mencatat keuangan.
          </p>
          {onAddWallet && (
            <button
              onClick={onAddWallet}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Dompet Pertama</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="p-4 rounded-xl bg-[#09090b]/80 border border-[#27272a] hover:border-zinc-700 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#18181b] border border-[#27272a]">
                    {getWalletIcon(wallet.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {wallet.name}
                    </h4>
                    {wallet.accountNumber && (
                      <p className="text-[10px] text-zinc-500 font-mono">{wallet.accountNumber}</p>
                    )}
                  </div>
                </div>

                {wallet.isShared && (
                  <span className="flex items-center gap-1 text-[9px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Users className="w-2.5 h-2.5" />
                    Bersama
                  </span>
                )}
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Saldo</p>
                <p className="text-lg font-bold text-white font-mono tracking-tight mt-0.5">
                  {formatRupiah(wallet.balance)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
