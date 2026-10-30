"use client";

import React from "react";
import { Building2, Smartphone, Banknote, ShieldCheck, Plus, Users } from "lucide-react";
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
        return <Building2 className="w-5 h-5 text-blue-600" />;
      case "EWALLET":
        return <Smartphone className="w-5 h-5 text-indigo-600" />;
      case "CASH":
        return <Banknote className="w-5 h-5 text-emerald-600" />;
      case "INVESTMENT":
        return <ShieldCheck className="w-5 h-5 text-purple-600" />;
      default:
        return <Building2 className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm shadow-slate-200/40">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Dompet & Rekening</h3>
          <p className="text-xs text-slate-500">Daftar saldo per rekening bank dan dompet bersama</p>
        </div>
        {onAddWallet && (
          <button
            onClick={onAddWallet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-all cursor-pointer border border-blue-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        )}
      </div>

      {wallets.length === 0 ? (
        <div className="py-10 px-4 rounded-xl bg-slate-50/70 border border-dashed border-slate-200 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-2">
            <Building2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-800">Belum ada dompet atau rekening</p>
          <p className="text-[11px] text-slate-500 max-w-sm mt-0.5 mb-3">
            Tambahkan rekening bank, e-wallet (GoPay, OVO), atau kas tunai pertama Anda.
          </p>
          {onAddWallet && (
            <button
              onClick={onAddWallet}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm shadow-blue-500/20"
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
              className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex flex-col justify-between group shadow-xs"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    {getWalletIcon(wallet.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {wallet.name}
                    </h4>
                    {wallet.accountNumber && (
                      <p className="text-[10px] text-slate-500 font-mono">{wallet.accountNumber}</p>
                    )}
                  </div>
                </div>

                {wallet.isShared && (
                  <span className="flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                    <Users className="w-2.5 h-2.5" />
                    Bersama
                  </span>
                )}
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Saldo</p>
                <p className="text-lg font-bold text-slate-900 font-mono tracking-tight mt-0.5">
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
