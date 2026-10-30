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
    <div className="rounded-2xl bg-gradient-to-br from-[#121c17] via-[#121215] to-[#121215] border border-emerald-500/30 p-5 shadow-sm relative overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-sm">AI Financial Health Advisor</h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Skor Keuangan: {healthScore}/100
              </span>
            </div>
            <p className="text-xs text-zinc-400">Analisis pola belanja & rekomendasi alokasi dana otomatis</p>
          </div>
        </div>

        <button
          onClick={fetchAdvice}
          disabled={loading}
          className="self-start sm:self-center flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#18181b] hover:bg-zinc-800 border border-[#27272a] text-xs font-medium text-zinc-300 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          <span>{loading ? "Menganalisis..." : "Generate Saran AI"}</span>
        </button>
      </div>

      {/* ADVICE CONTENT */}
      {advice ? (
        <div className="mt-3 p-4 rounded-xl bg-[#09090b]/80 border border-emerald-500/20 text-xs text-zinc-300 leading-relaxed space-y-2 whitespace-pre-line font-sans">
          {advice}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <div className="p-3.5 rounded-xl bg-[#09090b]/60 border border-[#27272a] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-white">Rasio Tabungan Ideal</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Rasio tabungan Anda saat ini berada di <span className="font-mono text-emerald-400 font-semibold">{savingsRate}%</span>. Rekomendasi minimal untuk stabilitas adalah 20%.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#09090b]/60 border border-[#27272a] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-white">Pos Belanja Utama</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Kategori <span className="text-amber-300 font-medium">{summary.topCategory || "Makan & Minum"}</span> mendominasi pengeluaran. Tekan jajan di luar untuk hemat Rp 500rb/bln.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#09090b]/60 border border-[#27272a] flex items-start gap-2.5">
            <ArrowUpRight className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-white">Akselerasi Tabungan</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Target <span className="text-sky-300 font-medium">{summary.activeGoalTitle}</span> tercapai 2 bulan lebih cepat jika menyisihkan bonus di awal bulan.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
