"use client";

import React, { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Check, 
  X, 
  Clock, 
  AlertCircle,
  FileText,
  DollarSign,
  Tag
} from "lucide-react";
import { formatRupiah, formatDateIndo } from "@/lib/utils";

export interface CalendarPlanItem {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  estimatedAmount: number;
  isMandatory: boolean; // Tagihan/Pengeluaran wajib
  isPaid: boolean;
  notes?: string;
}

interface FinancialCalendarProps {
  plans: CalendarPlanItem[];
  onAddPlan: (plan: CalendarPlanItem) => void;
  onTogglePaid: (planId: string) => void;
  onDeletePlan: (planId: string) => void;
}

export default function FinancialCalendar({
  plans,
  onAddPlan,
  onTogglePaid,
  onDeletePlan,
}: FinancialCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [isMandatory, setIsMandatory] = useState(false);
  const [notes, setNotes] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  const monthName = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(currentDate);

  // Get plans for selected date
  const plansForSelectedDate = plans.filter((p) => p.date === selectedDate);

  // Calculate monthly projection
  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const currentMonthPlans = plans.filter((p) => p.date.startsWith(currentMonthPrefix));

  const totalProjected = currentMonthPlans.reduce((sum, p) => sum + p.estimatedAmount, 0);
  const totalMandatory = currentMonthPlans
    .filter((p) => p.isMandatory)
    .reduce((sum, p) => sum + p.estimatedAmount, 0);
  const totalPaid = currentMonthPlans
    .filter((p) => p.isPaid)
    .reduce((sum, p) => sum + p.estimatedAmount, 0);
  const totalUnpaid = Math.max(0, totalProjected - totalPaid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const num = parseFloat(amount.replace(/\./g, "").replace(/,/g, "")) || 0;

    onAddPlan({
      id: "plan-" + Date.now(),
      date: selectedDate,
      title: title.trim(),
      estimatedAmount: num,
      isMandatory,
      isPaid: false,
      notes: notes.trim() || undefined,
    });

    setTitle("");
    setAmount("");
    setIsMandatory(false);
    setNotes("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP SUMMARY CARDS: FINANCIAL PROJECTIONS (TRANSPARANSI PENGELUARAN) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Estimasi Pengeluaran ({monthName})
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-numeric mt-1">
            {formatRupiah(totalProjected)}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Total rencana belanja & tagihan
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
            Kewajiban Wajib Bulanan
          </span>
          <div className="text-xl sm:text-2xl font-black text-rose-600 font-numeric mt-1">
            {formatRupiah(totalMandatory)}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Listrik, Wifi, Kos, Cicilan, dll.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Sudah Terbayar
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 font-numeric mt-1">
            {formatRupiah(totalPaid)}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Pos yang telah diselesaikan
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Sisa Dana Wajib Disiapkan
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-600 font-numeric mt-1">
            {formatRupiah(totalUnpaid)}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Harus stand-by di rekening
          </p>
        </div>
      </div>

      {/* 2. CALENDAR & DETAIL VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CALENDAR GRID */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          {/* CALENDAR HEADER */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center font-bold">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{monthName}</h3>
                <p className="text-xs text-slate-400 font-medium">Klik tanggal untuk merencanakan pengeluaran</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* DAY NAMES */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d, i) => (
              <span
                key={d}
                className={`text-xs font-bold py-1.5 ${
                  i === 0 ? "text-rose-500" : "text-slate-400"
                }`}
              >
                {d}
              </span>
            ))}
          </div>

          {/* DATES GRID */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty slots for start of month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-14 sm:h-16 rounded-xl bg-slate-50/40" />
            ))}

            {/* Actual Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const isSelected = selectedDate === dateString;

              const dayPlans = plans.filter((p) => p.date === dateString);
              const hasMandatory = dayPlans.some((p) => p.isMandatory && !p.isPaid);
              const dayTotal = dayPlans.reduce((sum, p) => sum + p.estimatedAmount, 0);

              const todayString = new Date().toISOString().split("T")[0];
              const isToday = todayString === dateString;

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDate(dateString)}
                  className={`h-14 sm:h-16 p-1.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                    isSelected
                      ? "border-[#0052cc] bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs"
                      : "border-slate-200/70 hover:border-slate-300 bg-white hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? "w-6 h-6 rounded-full bg-[#0052cc] text-white flex items-center justify-center -ml-0.5 -mt-0.5"
                          : isSelected
                          ? "text-[#0052cc]"
                          : "text-slate-800"
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* ALERT DOT IF THERE ARE MANDATORY BILLS */}
                    {hasMandatory && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Tagihan Wajib Belum Bayar" />
                    )}
                  </div>

                  {dayPlans.length > 0 && (
                    <div className="w-full">
                      <span className="block text-[10px] font-bold text-slate-700 truncate font-numeric">
                        {formatRupiah(dayTotal)}
                      </span>
                      <span className="block text-[9px] text-slate-400 font-medium">
                        {dayPlans.length} pos
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* DETAILS FOR SELECTED DATE */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400">Rencana Pengeluaran</span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {formatDateIndo(selectedDate)}
                </h4>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0052cc] hover:bg-[#0747a6] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Tambah Agenda</span>
              </button>
            </div>

            {/* LIST OF PLANS FOR THIS DATE */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {plansForSelectedDate.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Tidak ada agenda pengeluaran</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Klik tombol "Tambah Agenda" untuk membuat estimasi atau reminder tagihan.
                  </p>
                </div>
              ) : (
                plansForSelectedDate.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      item.isPaid
                        ? "bg-slate-50 border-slate-200 opacity-70"
                        : item.isMandatory
                        ? "bg-rose-50/50 border-rose-200"
                        : "bg-white border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            item.isPaid ? "line-through text-slate-500" : "text-slate-900"
                          }`}
                        >
                          {item.title}
                        </span>

                        {item.isMandatory && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                            Wajib Bulanan
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-extrabold text-slate-800 font-numeric">
                        {formatRupiah(item.estimatedAmount)}
                      </div>

                      {item.notes && (
                        <p className="text-xs text-slate-500 italic font-normal">
                          Note: "{item.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onTogglePaid(item.id)}
                        title={item.isPaid ? "Tandai Belum Lunas" : "Tandai Sudah Dibayar"}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          item.isPaid
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      <button
                        onClick={() => onDeletePlan(item.id)}
                        title="Hapus Agenda"
                        className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Agenda Tanggal Ini:</span>
            <span className="text-sm font-bold text-slate-900 font-numeric">
              {formatRupiah(plansForSelectedDate.reduce((sum, p) => sum + p.estimatedAmount, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* MODAL ADD PLAN / REMINDER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tambah Agenda & Reminder</h3>
                <p className="text-xs text-[#0052cc] font-medium">{formatDateIndo(selectedDate)}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Pos Pengeluaran / Tagihan
                </label>
                <input
                  type="text"
                  required
                  placeholder="misal: Bayar Listrik PLN, Tagihan Wifi, Uang Kos, Service Motor"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0052cc] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimasi Biaya (IDR)
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-sm text-slate-900 font-mono font-bold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0052cc]"
                  />
                </div>
              </div>

              {/* MANDATORY / REMINDER TOGGLE */}
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-rose-900">Kewajiban Wajib Bulanan</p>
                    <p className="text-[10px] text-rose-700">Tandai sebagai pos wajib yang harus dibayar tepat waktu</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isMandatory}
                  onChange={(e) => setIsMandatory(e.target.checked)}
                  className="w-4 h-4 rounded border-rose-300 text-rose-600 focus:ring-0 cursor-pointer accent-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan / Note Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="misal: Jatuh tempo tgl 20, transfer lewat BCA..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0052cc] resize-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#0052cc] hover:bg-[#0747a6] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm mt-2"
              >
                <Check className="w-4 h-4" />
                <span>Simpan ke Kalender Finansial</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
