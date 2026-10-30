"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Users } from "lucide-react";
import { SavingsGoalItem } from "./SavingsGoalsList";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: SavingsGoalItem) => void;
  goalToEdit?: SavingsGoalItem | null;
  onEditGoal?: (goal: SavingsGoalItem) => void;
}

export default function AddGoalModal({
  isOpen,
  onClose,
  onAddGoal,
  goalToEdit,
  onEditGoal,
}: AddGoalModalProps) {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title || "");
      setTargetAmount(goalToEdit.targetAmount !== undefined ? String(goalToEdit.targetAmount) : "");
      setInitialAmount(goalToEdit.currentAmount !== undefined ? String(goalToEdit.currentAmount) : "");
      setTargetDate(goalToEdit.targetDate ? goalToEdit.targetDate.split("T")[0] : "");
      setIsShared(!!goalToEdit.isShared);
    } else {
      setTitle("");
      setTargetAmount("");
      setInitialAmount("");
      setTargetDate("");
      setIsShared(false);
    }
  }, [goalToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetNum = parseFloat(targetAmount.replace(/\./g, "").replace(/,/g, "")) || 0;
    const initialNum = parseFloat(initialAmount.replace(/\./g, "").replace(/,/g, "")) || 0;

    if (targetNum <= 0) return;

    if (goalToEdit && onEditGoal) {
      onEditGoal({
        ...goalToEdit,
        title: title.trim(),
        targetAmount: targetNum,
        currentAmount: initialNum,
        targetDate: targetDate || undefined,
        isShared,
      });
    } else {
      onAddGoal({
        id: "g-" + Date.now(),
        title: title.trim(),
        targetAmount: targetNum,
        currentAmount: initialNum,
        targetDate: targetDate || undefined,
        isShared,
      });
    }

    setTitle("");
    setTargetAmount("");
    setInitialAmount("");
    setTargetDate("");
    setIsShared(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            {goalToEdit ? "Edit Target Tabungan" : "Buat Target Tabungan Baru"}
          </h3>
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
              Nama / Judul Target
            </label>
            <input
              type="text"
              required
              placeholder="misal: Dana Darurat, Liburan Akhir Tahun, Beli Motor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Nominal yang Ingin Dicapai
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                required
                placeholder="0"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-sm text-slate-900 font-mono font-bold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Saldo Awal yang Sudah Terkumpul (Opsional)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                placeholder="0"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-sm text-slate-900 font-mono font-bold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Tanggal Tercapai (Opsional)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">Target Tabungan Bersama</p>
                <p className="text-[10px] text-slate-500 font-medium">Dapat dipantau & disetor bersama pasangan</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isShared}
              onChange={(e) => setIsShared(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer accent-blue-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20 mt-2"
          >
            <Check className="w-4 h-4" />
            <span>{goalToEdit ? "Simpan Perubahan" : "Simpan Target Tabungan"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
