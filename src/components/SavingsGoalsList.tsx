"use client";

import React from "react";
import { PiggyBank, Target, Calendar, Plus, Users, CheckCircle2 } from "lucide-react";
import { formatRupiah, formatDateIndo } from "@/lib/utils";

export interface SavingsGoalItem {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  isShared: boolean;
}

interface SavingsGoalsListProps {
  goals: SavingsGoalItem[];
  onAddGoal?: () => void;
  onDepositGoal?: (goalId: string) => void;
}

export default function SavingsGoalsList({ goals, onAddGoal, onDepositGoal }: SavingsGoalsListProps) {
  return (
    <div className="p-5 rounded-2xl bg-[#121215] border border-[#27272a] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Target Tabungan (Savings Goals)</h3>
          <p className="text-xs text-zinc-500">Pantau kemajuan tabungan pribadi dan rencana bersama pasangan</p>
        </div>
        {onAddGoal && (
          <button
            onClick={onAddGoal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18181b] hover:bg-zinc-800 border border-[#27272a] text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Target Baru</span>
          </button>
        )}
      </div>

      {goals.length === 0 ? (
        <div className="py-10 px-4 rounded-xl bg-[#09090b]/60 border border-dashed border-[#27272a] text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-400 mb-2">
            <PiggyBank className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs font-semibold text-white">Belum ada target tabungan</p>
          <p className="text-[11px] text-zinc-500 max-w-sm mt-0.5 mb-3">
            Tetapkan target tabungan impian Anda (Dana Darurat, Liburan Bersama, Gadget) untuk melacak kemajuan dana.
          </p>
          {onAddGoal && (
            <button
              onClick={onAddGoal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Target Pertama</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const isComplete = goal.currentAmount >= goal.targetAmount;
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

            return (
              <div
                key={goal.id}
                className="p-4 rounded-xl bg-[#09090b]/80 border border-[#27272a] hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-[#18181b] text-emerald-400 border border-[#27272a]">
                        <PiggyBank className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{goal.title}</h4>
                        {goal.targetDate && (
                          <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            Target: {formatDateIndo(goal.targetDate)}
                          </p>
                        )}
                      </div>
                    </div>

                    {goal.isShared && (
                      <span className="flex items-center gap-1 text-[9px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Users className="w-2.5 h-2.5" />
                        Bersama
                      </span>
                    )}
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="my-3 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-white">
                        {formatRupiah(goal.currentAmount)}
                      </span>
                      <span className="text-zinc-500 font-mono text-[11px]">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isComplete ? "bg-emerald-400" : "bg-gradient-to-r from-emerald-600 to-emerald-400"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>Sisa: {formatRupiah(remaining)}</span>
                      <span>Target: {formatRupiah(goal.targetAmount)}</span>
                    </div>
                  </div>
                </div>

                {onDepositGoal && !isComplete && (
                  <button
                    onClick={() => onDepositGoal(goal.id)}
                    className="mt-2 w-full py-1.5 px-3 rounded-lg bg-[#18181b] hover:bg-zinc-800 border border-[#27272a] text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Setor Tabungan</span>
                  </button>
                )}

                {isComplete && (
                  <div className="mt-2 py-1 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Target Tercapai!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
