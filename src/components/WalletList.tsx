"use client";

import React from "react";
import { Building2, Smartphone, Banknote, ShieldCheck, Plus, Users, CreditCard, Pencil, Trash2 } from "lucide-react";
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
  onEditWallet?: (wallet: WalletItem) => void;
  onDeleteWallet?: (walletId: string) => void;
}

export default function WalletList({
  wallets,
  onAddWallet,
  onEditWallet,
  onDeleteWallet,
}: WalletListProps) {
  const getWalletBadge = (type: string) => {
    switch (type) {
      case "BANK":
        return { label: "Bank", icon: Building2, color: "bg-blue-50 text-blue-700 border-blue-200" };
      case "EWALLET":
        return { label: "E-Wallet", icon: Smartphone, color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "CASH":
        return { label: "Tunai", icon: Banknote, color: "bg-amber-50 text-amber-700 border-amber-200" };
      case "INVESTMENT":
        return { label: "Investasi", icon: ShieldCheck, color: "bg-purple-50 text-purple-700 border-purple-200" };
      default:
        return { label: "Akun", icon: Building2, color: "bg-slate-50 text-slate-700 border-slate-200" };
    }
  };

  return (
    <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900">Daftar Rekening & Dompet</h3>
          <p className="text-xs text-slate-500 font-medium">Rekening bank pribadi dan dompet kas bersama pasangan</p>
        </div>
        {onAddWallet && (
          <button
            onClick={onAddWallet}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all cursor-pointer btn-tactile"
          >
            <Plus className="w-4 h-4 icon-pop" />
            <span>Tambah Rekening</span>
          </button>
        )}
      </div>

      {wallets.length === 0 ? (
        <div className="py-12 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0052cc] flex items-center justify-center mb-3 shadow-2xs icon-pop">
            <CreditCard className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-800">Belum ada rekening atau dompet terdaftar</p>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 font-normal">
            Tambahkan rekening BCA, Mandiri, GoPay, OVO, atau dompet fisik Anda untuk memulai pencatatan saldo.
          </p>
          {onAddWallet && (
            <button
              onClick={onAddWallet}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0747a6] text-white text-xs font-bold transition-all cursor-pointer shadow-sm btn-tactile"
            >
              <Plus className="w-4 h-4 stroke-[2.5] icon-pop" />
              <span>Tambah Rekening Pertama</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wallets.map((wallet) => {
            const badge = getWalletBadge(wallet.type);
            const Icon = badge.icon;

            return (
              <div
                key={wallet.id}
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all flex flex-col justify-between group card-tap"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${badge.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{badge.label}</span>
                    </span>

                    {wallet.isShared && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#0052cc] border border-blue-200">
                        <Users className="w-3 h-3" />
                        Bersama
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0052cc] transition-colors">
                    {wallet.name}
                  </h4>
                  {wallet.accountNumber && (
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{wallet.accountNumber}</p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Saldo</p>
                    <p className="text-xl font-extrabold text-slate-900 font-numeric tracking-tight mt-0.5">
                      {formatRupiah(wallet.balance)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {onEditWallet && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditWallet(wallet);
                        }}
                        title="Edit Rekening"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#0052cc] hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {onDeleteWallet && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteWallet(wallet.id);
                        }}
                        title="Hapus Rekening"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
