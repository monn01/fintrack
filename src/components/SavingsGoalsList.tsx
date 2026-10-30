"use client";

import React from "react";
import { PiggyBank, Calendar, Plus, Users, CheckCircle2 } from "lucide-react";
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
    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm shadow-slate-200/40">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Target Tabungan (Savings Goals)</h3>
          <p className="text-xs text-slate-500">Pantau progres tabungan pribadi dan rencana bersama pasangan</p>
        </div>
        {onAddGoal && (
          <button
            onClick={onAddGoal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-all cursor-pointer border border-blue-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Target Baru</span>
          </button>
        )}
      </div>

      {goals.length === 0 ? (
        <div className="py-10 px-4 rounded-xl bg-slate-50/70 border border-dashed border-slate-200 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-2">
            <PiggyBank className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-800">Belum ada target tabungan</p>
          <p className="text-[11px] text-slate-500 max-w-sm mt-0.5 mb-3">
            Tetapkan target tabungan impian Anda (Dana Darurat, Liburan Bersama, Gadget) untuk melacak kemajuan dana.
          </p>
          {onAddGoal && (
            <button
              onClick={onAddGoal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm shadow-blue-500/20 btn-tactile"
            >
              <Plus className="w-3.5 h-3.5 icon-pop" />
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
                className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 hover:border-blue-300 transition-all flex flex-col justify-between shadow-2xs card-tap"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white text-blue-600 border border-slate-200 shadow-2xs">
                        <PiggyBank className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{goal.title}</h4>
                        {goal.targetDate && (
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                            <Calendar className="w-3 h-3" />
                            Target: {formatDateIndo(goal.targetDate)}
                          </p>
                        )}
                      </div>
                    </div>

                    {goal.isShared && (
                      <span className="flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                        <Users className="w-2.5 h-2.5" />
                        Bersama
                      </span>
                    )}
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="my-3 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-slate-900">
                        {formatRupiah(goal.currentAmount)}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px] font-bold">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isComplete ? "bg-emerald-500" : "bg-blue-600"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>Sisa: {formatRupiah(remaining)}</span>
                      <span>Target: {formatRupiah(goal.targetAmount)}</span>
                    </div>
                  </div>
                </div>

                {onDepositGoal && !isComplete && (
                  <button
                    onClick={() => onDepositGoal(goal.id)}
                    className="mt-2 w-full py-2 px-3 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-xs font-semibold text-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs btn-tactile"
                  >
                    <Plus className="w-3.5 h-3.5 icon-pop" />
                    <span>Setor Tabungan</span>
                  </button>
                )}

                {isComplete && (
                  <div className="mt-2 py-1.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5">
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
