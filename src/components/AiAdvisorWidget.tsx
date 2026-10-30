"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw, CheckCircle2, AlertTriangle, ArrowUpRight } from "lucide-react";

interface AiAdvisorWidgetProps {
  summary: {
    totalBalance: number;
    income: number;
    expense: number;
    topCategory: string;
    activeGoalTitle: string;
    goalCurrent: number;
    goalTarget: number;
  };
}

export default function AiAdvisorWidget({ summary }: AiAdvisorWidgetProps) {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary }),
      });
      const data = await res.json();
      if (data.advice) {
        setAdvice(data.advice);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const savingsRate = summary.income > 0 ? Math.round(((summary.income - summary.expense) / summary.income) * 100) : 0;
  const healthScore = Math.max(35, Math.min(95, 55 + savingsRate));

  return (
    <div className="rounded-2xl bg-gradient-to-r from-blue-50/70 via-white to-white border border-blue-200/80 p-5 shadow-sm shadow-blue-500/5 relative overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">AI Financial Health Advisor</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                Skor Keuangan: {healthScore}/100
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Analisis cerdas pola belanja & rekomendasi alokasi dana otomatis</p>
          </div>
        </div>

        <button
          onClick={fetchAdvice}
          disabled={loading}
          className="self-start sm:self-center flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
          <span>{loading ? "Menganalisis..." : "Generate Saran AI"}</span>
        </button>
      </div>

      {/* ADVICE CONTENT */}
      {advice ? (
        <div className="mt-3 p-4 rounded-xl bg-white border border-blue-200 text-xs text-slate-700 leading-relaxed space-y-2 whitespace-pre-line font-sans shadow-sm">
          {advice}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Rasio Tabungan Ideal</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                Rasio tabungan Anda saat ini berada di <span className="font-mono text-emerald-600 font-bold">{savingsRate}%</span>. Rekomendasi minimal untuk stabilitas adalah 20%.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Pos Belanja Utama</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                Kategori <span className="text-amber-700 font-bold">{summary.topCategory || "Makan & Minum"}</span> mendominasi pengeluaran. Tekan jajan di luar untuk hemat Rp 500rb/bln.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Akselerasi Tabungan</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                Target <span className="text-blue-700 font-bold">{summary.activeGoalTitle}</span> tercapai lebih cepat jika menyisihkan bonus di awal bulan.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
