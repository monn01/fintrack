"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { SavingsGoalItem } from "./SavingsGoalsList";
import { WalletItem } from "./WalletList";
import { formatRupiah } from "@/lib/utils";

interface DepositGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoalItem | null;
  wallets: WalletItem[];
  onDeposit: (goalId: string, walletId: string, amount: number) => void;
}

export default function DepositGoalModal({
  isOpen,
  onClose,
  goal,
  wallets,
  onDeposit,
}: DepositGoalModalProps) {
  const [walletId, setWalletId] = useState<string>(wallets[0]?.id || "");
  const [amount, setAmount] = useState<string>("");

  if (!isOpen || !goal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount.replace(/\./g, "").replace(/,/g, "")) || 0;
    if (num <= 0) return;

    onDeposit(goal.id, walletId, num);
    setAmount("");
    onClose();
  };

  const selectedWallet = wallets.find((w) => w.id === walletId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Setor ke Tabungan</h3>
            <p className="text-xs text-blue-600 font-bold">{goal.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Sumber Dana (Dompet)
            </label>
            <select
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} (Saldo: {formatRupiah(w.balance)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nominal Setoran (IDR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                required
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-sm text-slate-900 font-mono font-bold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
            {selectedWallet && (
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Saldo tersedia di {selectedWallet.name}: {formatRupiah(selectedWallet.balance)}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20 mt-2"
          >
            <Check className="w-4 h-4" />
            <span>Konfirmasi Setoran</span>
          </button>
        </form>
      </div>
    </div>
  );
}
