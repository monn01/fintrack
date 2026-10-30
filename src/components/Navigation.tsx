"use client";

import React from "react";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PiggyBank, 
  PieChart, 
  Settings, 
  Plus, 
  Users,
  Wallet
} from "lucide-react";

interface NavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickAdd: () => void;
}

export default function Navigation({ activeTab, setActiveTab, onOpenQuickAdd }: NavProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transaksi", icon: ArrowLeftRight },
    { id: "wallets", label: "Dompet & Akun", icon: Wallet },
    { id: "goals", label: "Target Tabungan", icon: PiggyBank },
    { id: "analytics", label: "Analitik", icon: PieChart },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#27272a] bg-[#09090b] p-5 shrink-0 justify-between select-none min-h-screen sticky top-0">
        <div>
          {/* LOGO */}
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-emerald-500/20">
              F
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                FinTrack
                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  Pro
                </span>
              </span>
              <p className="text-[11px] text-zinc-500">Personal & Household Finance</p>
            </div>
          </div>

          {/* QUICK ADD BUTTON */}
          <button
            onClick={onOpenQuickAdd}
            className="w-full mb-6 flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-950 font-medium py-2.5 px-4 rounded-xl transition-all duration-150 active:scale-[0.98] shadow-sm hover:shadow-zinc-200/10 text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Catat Transaksi</span>
          </button>

          {/* NAV ITEMS */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#18181b] text-white border border-[#27272a]"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-[#121215]"
                  }`}
                >
                  <Icon className={`w-4 h-4 stroke-[1.8] ${isActive ? "text-emerald-400" : "text-zinc-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM USER PROFILE / PARTNER STATUS */}
        <div className="pt-4 border-t border-[#27272a]">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121215] border border-[#27272a]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-200 shrink-0">
                P
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-white truncate">Pasangan Mode</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  Terhubung
                </p>
              </div>
            </div>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
        </div>
      </aside>

      {/* MOBILE FLOATING BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-t border-[#27272a] px-4 py-2 flex items-center justify-around safe-area-bottom">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer ${
            activeTab === "dashboard" ? "text-emerald-400" : "text-zinc-400"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer ${
            activeTab === "transactions" ? "text-emerald-400" : "text-zinc-400"
          }`}
        >
          <ArrowLeftRight className="w-5 h-5" />
          <span className="text-[10px]">Transaksi</span>
        </button>

        {/* FLOATING QUICK ADD BUTTON */}
        <button
          onClick={onOpenQuickAdd}
          aria-label="Catat Transaksi"
          className="w-12 h-12 -mt-5 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform cursor-pointer"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => setActiveTab("goals")}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer ${
            activeTab === "goals" ? "text-emerald-400" : "text-zinc-400"
          }`}
        >
          <PiggyBank className="w-5 h-5" />
          <span className="text-[10px]">Goals</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex flex-col items-center gap-1 p-1 text-xs cursor-pointer ${
            activeTab === "analytics" ? "text-emerald-400" : "text-zinc-400"
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[10px]">Analitik</span>
        </button>
      </div>
    </>
  );
}
