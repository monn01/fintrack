"use client";

import React from "react";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PiggyBank, 
  PieChart, 
  Plus, 
  Wallet,
  Calendar,
  LogOut,
  Heart
} from "lucide-react";
import { useRouter } from "next/navigation";

interface NavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickAdd: () => void;
  currentUser?: { name: string; role: string; user: string } | null;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  onOpenQuickAdd,
  currentUser,
}: NavProps) {
  const router = useRouter();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "calendar", label: "Kalender & Tagihan", icon: Calendar },
    { id: "transactions", label: "Riwayat Transaksi", icon: ArrowLeftRight },
    { id: "wallets", label: "Rekening & Dompet", icon: Wallet },
    { id: "goals", label: "Target Tabungan", icon: PiggyBank },
    { id: "analytics", label: "Laporan Arus Kas", icon: PieChart },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isPartner = currentUser?.user === "partner";

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200/90 bg-white p-5 shrink-0 justify-between select-none min-h-screen sticky top-0 shadow-2xs">
        <div>
          {/* BRAND LOGO WITH OFFICIAL FT ICON */}
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#0052cc] flex items-center justify-center text-white font-black text-xl shadow-sm tracking-tighter">
              FT
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 block">
                FinTrack
              </span>
              <p className="text-xs text-slate-400 font-medium">Digital Banking Suite</p>
            </div>
          </div>

          {/* PRIMARY QUICK ACTION */}
          <button
            onClick={onOpenQuickAdd}
            className="w-full mb-6 flex items-center justify-center gap-2 bg-[#0052cc] hover:bg-[#0747a6] text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-150 active:scale-[0.98] shadow-sm text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Catat Transaksi</span>
          </button>

          {/* NAVIGATION LINKS */}
          <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Menu Utama
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer btn-tactile ${
                    isActive
                      ? "bg-blue-50 text-[#0052cc] border border-blue-200/80 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 stroke-[2] icon-pop ${isActive ? "text-[#0052cc] scale-110" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM USER CARD */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0 ${
                  isPartner ? "bg-rose-500" : "bg-[#0052cc]"
                }`}
              >
                {isPartner ? (
                  <Heart className="w-4 h-4 fill-current" />
                ) : (
                  currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {currentUser?.name || "Pengguna"}
                </p>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  {isPartner ? "Partner Access" : "Pemilik Akun"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Keluar dari akun"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer icon-pop"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR (HIGHLY TACTILE & RESPONSIVE LIKE GOPAY/MYBCA) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg safe-area-bottom">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer nav-tab-tap ${
            activeTab === "dashboard" ? "text-[#0052cc] font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === "dashboard" ? "bg-blue-50 text-[#0052cc]" : ""}`}>
            <LayoutDashboard className="w-5 h-5 icon-pop" />
          </div>
          <span className="text-[11px] mt-0.5">Home</span>
          {activeTab === "dashboard" && <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc] -mb-1 animate-pulse" />}
        </button>

        <button
          onClick={() => setActiveTab("calendar")}
          className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer nav-tab-tap ${
            activeTab === "calendar" ? "text-[#0052cc] font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === "calendar" ? "bg-blue-50 text-[#0052cc]" : ""}`}>
            <Calendar className="w-5 h-5 icon-pop" />
          </div>
          <span className="text-[11px] mt-0.5">Tagihan</span>
          {activeTab === "calendar" && <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc] -mb-1 animate-pulse" />}
        </button>

        {/* FLOATING ACTION BUTTON WITH ANIMATED PRESS FEEDBACK */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={onOpenQuickAdd}
            aria-label="Catat Transaksi"
            className="group w-13 h-13 rounded-full bg-[#0052cc] hover:bg-[#0747a6] text-white flex items-center justify-center shadow-lg shadow-blue-500/40 active:scale-90 active:ring-4 active:ring-blue-300/60 hover:scale-105 transition-all duration-150 cursor-pointer border-2 border-white"
          >
            <Plus className="w-6 h-6 stroke-[2.5] group-active:scale-90 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer nav-tab-tap ${
            activeTab === "transactions" ? "text-[#0052cc] font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === "transactions" ? "bg-blue-50 text-[#0052cc]" : ""}`}>
            <ArrowLeftRight className="w-5 h-5 icon-pop" />
          </div>
          <span className="text-[11px] mt-0.5">Mutasi</span>
          {activeTab === "transactions" && <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc] -mb-1 animate-pulse" />}
        </button>

        <button
          onClick={() => setActiveTab("wallets")}
          className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer nav-tab-tap ${
            activeTab === "wallets" ? "text-[#0052cc] font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === "wallets" ? "bg-blue-50 text-[#0052cc]" : ""}`}>
            <Wallet className="w-5 h-5 icon-pop" />
          </div>
          <span className="text-[11px] mt-0.5">Rekening</span>
          {activeTab === "wallets" && <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc] -mb-1 animate-pulse" />}
        </button>
      </div>
    </>
  );
}
