"use client";

import React, { useState } from "react";
import { X, PiggyBank, Calendar, Check, Users } from "lucide-react";
import { SavingsGoalItem } from "./SavingsGoalsList";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: SavingsGoalItem) => void;
}

export default function AddGoalModal({
  isOpen,
  onClose,
  onAddGoal,
}: AddGoalModalProps) {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isShared, setIsShared] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetNum = parseFloat(targetAmount.replace(/\./g, "").replace(/,/g, "")) || 0;
    const initialNum = parseFloat(initialAmount.replace(/\./g, "").replace(/,/g, "")) || 0;

    if (targetNum <= 0) return;

    onAddGoal({
      id: "g-" + Date.now(),
      title: title.trim(),
      targetAmount: targetNum,
      currentAmount: initialNum,
      targetDate: targetDate || undefined,
      isShared,
    });

    setTitle("");
    setTargetAmount("");
    setInitialAmount("");
    setTargetDate("");
    setIsShared(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121215] border border-[#27272a] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[#27272a] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Buat Target Tabungan Baru</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* TITLE */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Nama / Judul Target:
            </label>
            <input
              type="text"
              required
              placeholder="misal: Dana Darurat, Liburan Akhir Tahun, Beli Motor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* TARGET AMOUNT */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Target Nominal yang Ingin Dicapai:
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-zinc-500">
                Rp
              </span>
              <input
                type="number"
                required
                placeholder="0"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl pl-10 pr-3 py-2 text-sm text-white font-mono font-bold placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* INITIAL AMOUNT */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Saldo Awal yang Sudah Terkumpul (Opsional):
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-zinc-500">
                Rp
              </span>
              <input
                type="number"
                placeholder="0"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl pl-10 pr-3 py-2 text-sm text-white font-mono font-bold placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* TARGET DATE */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Target Tanggal Tercapai (Opsional):
            </label>
            <div className="relative">
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* SHARED GOAL TOGGLE */}
          <div className="p-3 rounded-xl bg-[#09090b] border border-[#27272a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-medium text-white">Target Tabungan Bersama</p>
                <p className="text-[10px] text-zinc-500">Dapat dipantau & disetor bersama pasangan</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isShared}
              onChange={(e) => setIsShared(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Target Tabungan</span>
          </button>
        </form>
      </div>
    </div>
  );
}
