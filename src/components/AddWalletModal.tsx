"use client";

import React, { useState } from "react";
import { X, Building2, Smartphone, Banknote, ShieldCheck, Check, Users } from "lucide-react";
import { WalletItem } from "./WalletList";

interface AddWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWallet: (wallet: WalletItem) => void;
}

export default function AddWalletModal({
  isOpen,
  onClose,
  onAddWallet,
}: AddWalletModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"BANK" | "EWALLET" | "CASH" | "INVESTMENT">("BANK");
  const [balance, setBalance] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isShared, setIsShared] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const initialBal = parseFloat(balance.replace(/\./g, "").replace(/,/g, "")) || 0;

    onAddWallet({
      id: "w-" + Date.now(),
      name: name.trim(),
      type,
      balance: initialBal,
      isShared,
      accountNumber: accountNumber.trim() || undefined,
    });

    setName("");
    setBalance("");
    setAccountNumber("");
    setIsShared(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121215] border border-[#27272a] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[#27272a] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Tambah Dompet / Akun Baru</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* WALLET TYPE */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Tipe Dompet:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "BANK", label: "Bank", icon: Building2 },
                { id: "EWALLET", label: "E-Wallet", icon: Smartphone },
                { id: "CASH", label: "Tunai", icon: Banknote },
                { id: "INVESTMENT", label: "Aset", icon: ShieldCheck },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = type === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id as any)}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                        : "bg-[#09090b] border-[#27272a] text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* NAME */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Nama Dompet / Bank:
            </label>
            <input
              type="text"
              required
              placeholder="misal: BCA Utama, GoPay, Dompet Saku"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* INITIAL BALANCE */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Saldo Saat Ini (IDR):
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-zinc-500">
                Rp
              </span>
              <input
                type="number"
                placeholder="0"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl pl-10 pr-3 py-2 text-sm text-white font-mono font-bold placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* ACCOUNT NUMBER (OPTIONAL) */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Nomor Rekening / No HP (Opsional):
            </label>
            <input
              type="text"
              placeholder="misal: 123-456-7890"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-mono text-[11px]"
            />
          </div>

          {/* SHARED TOGGLE */}
          <div className="p-3 rounded-xl bg-[#09090b] border border-[#27272a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-medium text-white">Dompet Bersama Pasangan</p>
                <p className="text-[10px] text-zinc-500">Dapat dilihat & diakses oleh pasangan</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isShared}
              onChange={(e) => setIsShared(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Dompet</span>
          </button>
        </form>
      </div>
    </div>
  );
}
