"use client";

import React, { useState } from "react";
import { X, Check, ArrowRight } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121215] border border-[#27272a] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[#27272a] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Setor ke Tabungan</h3>
            <p className="text-xs text-emerald-400 font-medium">{goal.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Pilih Sumber Dana (Dompet):
            </label>
            <select
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} (Saldo: {formatRupiah(w.balance)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Nominal Setoran (IDR):
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-zinc-500">
                Rp
              </span>
              <input
                type="number"
                required
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl pl-10 pr-3 py-2 text-sm text-white font-mono font-bold placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            {selectedWallet && (
              <p className="text-[11px] text-zinc-500 mt-1">
                Saldo tersedia di {selectedWallet.name}: {formatRupiah(selectedWallet.balance)}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
          >
            <Check className="w-4 h-4" />
            <span>Konfirmasi Setoran</span>
          </button>
        </form>
      </div>
    </div>
  );
}
