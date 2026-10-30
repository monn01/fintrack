"use client";

import React, { useState, useEffect } from "react";
import { X, Building2, Smartphone, Banknote, ShieldCheck, Check, Users } from "lucide-react";
import { WalletItem } from "./WalletList";

interface AddWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWallet: (wallet: WalletItem) => void;
  walletToEdit?: WalletItem | null;
  onEditWallet?: (wallet: WalletItem) => void;
}

export default function AddWalletModal({
  isOpen,
  onClose,
  onAddWallet,
  walletToEdit,
  onEditWallet,
}: AddWalletModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"BANK" | "EWALLET" | "CASH" | "INVESTMENT">("BANK");
  const [balance, setBalance] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    if (walletToEdit) {
      setName(walletToEdit.name || "");
      setType(walletToEdit.type || "BANK");
      setBalance(walletToEdit.balance !== undefined ? String(walletToEdit.balance) : "");
      setAccountNumber(walletToEdit.accountNumber || "");
      setIsShared(!!walletToEdit.isShared);
    } else {
      setName("");
      setType("BANK");
      setBalance("");
      setAccountNumber("");
      setIsShared(false);
    }
  }, [walletToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const initialBal = parseFloat(balance.replace(/\./g, "").replace(/,/g, "")) || 0;

    if (walletToEdit && onEditWallet) {
      onEditWallet({
        ...walletToEdit,
        name: name.trim(),
        type,
        balance: initialBal,
        isShared,
        accountNumber: accountNumber.trim() || undefined,
      });
    } else {
      onAddWallet({
        id: "w-" + Date.now(),
        name: name.trim(),
        type,
        balance: initialBal,
        isShared,
        accountNumber: accountNumber.trim() || undefined,
      });
    }

    setName("");
    setBalance("");
    setAccountNumber("");
    setIsShared(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            {walletToEdit ? "Edit Rekening / Dompet" : "Tambah Dompet / Akun Baru"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* WALLET TYPE */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tipe Dompet
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
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500/20"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Dompet / Bank
            </label>
            <input
              type="text"
              required
              placeholder="misal: BCA Utama, GoPay, Dompet Saku"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
            />
          </div>

          {/* INITIAL BALANCE */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Saldo Saat Ini (IDR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                placeholder="0"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-sm text-slate-900 font-mono font-bold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>

          {/* ACCOUNT NUMBER */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor Rekening / No HP (Opsional)
            </label>
            <input
              type="text"
              placeholder="misal: 123-456-7890"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 font-mono text-[11px]"
            />
          </div>

          {/* SHARED TOGGLE */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">Dompet Bersama Pasangan</p>
                <p className="text-[10px] text-slate-500 font-medium">Dapat dilihat & diakses oleh pasangan</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isShared}
              onChange={(e) => setIsShared(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer accent-blue-600"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20 mt-2"
          >
            <Check className="w-4 h-4" />
            <span>{walletToEdit ? "Simpan Perubahan" : "Simpan Dompet"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
