"use client";

import React from "react";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PiggyBank, 
  PieChart, 
  Plus, 
  Wallet,
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
    { id: "transactions", label: "Transaksi", icon: ArrowLeftRight },
    { id: "wallets", label: "Dompet & Akun", icon: Wallet },
    { id: "goals", label: "Target Tabungan", icon: PiggyBank },
    { id: "analytics", label: "Laporan & Grafik", icon: PieChart },
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
      {/* DESKTOP SIDEBAR (TAILADMIN CLEAN WHITE / BLUE STYLE) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white p-5 shrink-0 justify-between select-none min-h-screen sticky top-0">
        <div>
          {/* BRAND LOGO */}
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/25">
              F
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
                FinTrack
                <span className="text-[10px] font-semibold uppercase bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded">
                  Pro
                </span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium">Personal Finance System</p>
            </div>
          </div>

          {/* PRIMARY QUICK ACTION */}
          <button
            onClick={onOpenQuickAdd}
            className="w-full mb-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-150 active:scale-[0.98] shadow-sm shadow-blue-500/20 text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Catat Transaksi</span>
          </button>

          {/* NAVIGATION LINKS */}
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 stroke-[2] ${isActive ? "text-blue-600" : "text-slate-400"}`} />
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
                  isPartner ? "bg-rose-500" : "bg-blue-600"
                }`}
              >
                {isPartner ? <Heart className="w-4 h-4 fill-current" /> : "M"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {currentUser?.name || "Monn"}
                </p>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  {isPartner ? "Partner Access" : "Pemilik Akun"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Keluar dari akun"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer ${
            activeTab === "dashboard" ? "text-blue-600 font-semibold" : "text-slate-500"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer ${
            activeTab === "transactions" ? "text-blue-600 font-semibold" : "text-slate-500"
          }`}
        >
          <ArrowLeftRight className="w-5 h-5" />
          <span className="text-[10px]">Transaksi</span>
        </button>

        {/* FLOATING ACTION BUTTON */}
        <button
          onClick={onOpenQuickAdd}
          aria-label="Catat Transaksi"
          className="w-12 h-12 -mt-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95 transition-transform cursor-pointer"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => setActiveTab("goals")}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer ${
            activeTab === "goals" ? "text-blue-600 font-semibold" : "text-slate-500"
          }`}
        >
          <PiggyBank className="w-5 h-5" />
          <span className="text-[10px]">Goals</span>
        </button>

        <button
          onClick={() => setActiveTab("wallets")}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer ${
            activeTab === "wallets" ? "text-blue-600 font-semibold" : "text-slate-500"
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px]">Dompet</span>
        </button>
      </div>
    </>
  );
}
