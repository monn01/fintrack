"use client";

import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import MetricCards from "@/components/MetricCards";
import AiAdvisorWidget from "@/components/AiAdvisorWidget";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import WalletList, { WalletItem } from "@/components/WalletList";
import SavingsGoalsList, { SavingsGoalItem } from "@/components/SavingsGoalsList";
import TransactionFeed, { TransactionItem } from "@/components/TransactionFeed";
import QuickAddModal from "@/components/QuickAddModal";
import { Plus, Bell, ShieldCheck, Heart } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Initial State: Wallets
  const [wallets, setWallets] = useState<WalletItem[]>([
    { id: "w-1", name: "BCA Utama", type: "BANK", balance: 14250000, isShared: false, accountNumber: "8271-9920-11" },
    { id: "w-2", name: "GoPay", type: "EWALLET", balance: 850000, isShared: false, accountNumber: "0812-3456-7890" },
    { id: "w-3", name: "Rekening Bersama", type: "BANK", balance: 8500000, isShared: true, accountNumber: "5420-1189-99" },
    { id: "w-4", name: "Dompet Tunai", type: "CASH", balance: 450000, isShared: false },
  ]);

  // Initial State: Savings Goals
  const [goals, setGoals] = useState<SavingsGoalItem[]>([
    { id: "g-1", title: "Dana Darurat (6 Bulan)", targetAmount: 30000000, currentAmount: 18500000, targetDate: "2026-12-31", isShared: false },
    { id: "g-2", title: "Liburan Bersama Pasangan", targetAmount: 10000000, currentAmount: 6200000, targetDate: "2026-11-20", isShared: true },
    { id: "g-3", title: "Upgrade Laptop Kerja", targetAmount: 15000000, currentAmount: 7500000, targetDate: "2027-02-15", isShared: false },
  ]);

  // Initial State: Transactions
  const [transactions, setTransactions] = useState<TransactionItem[]>([
    { id: "tx-1", type: "EXPENSE", amount: 45000, category: "Makan & Minum", wallet: "GoPay", date: "2026-10-29", description: "Makan Siang Soto Betawi", tags: ["#makan", "#kantor"] },
    { id: "tx-2", type: "EXPENSE", amount: 125000, category: "Transportasi", wallet: "GoPay", date: "2026-10-28", description: "Bensin & Tol Mobil", tags: ["#transport"] },
    { id: "tx-3", type: "INCOME", amount: 12500000, category: "Gaji / Penghasilan", wallet: "BCA Utama", date: "2026-10-25", description: "Gaji Bulanan Oktober", tags: ["#gaji"] },
    { id: "tx-4", type: "EXPENSE", amount: 650000, category: "Belanja", wallet: "Rekening Bersama", date: "2026-10-24", description: "Belanja Bulanan Supermarket", tags: ["#kebutuhan-rumah"] },
    { id: "tx-5", type: "TRANSFER", amount: 1500000, category: "Transfer", wallet: "BCA Utama", destinationWallet: "Rekening Bersama", date: "2026-10-23", description: "Top-up Kas Bersama Bulanan", tags: ["#kas-rumah"] },
  ]);

  // Cash Flow History for Chart
  const cashFlowData = [
    { month: "Mei", pemasukan: 11000000, pengeluaran: 6200000 },
    { month: "Jun", pemasukan: 11500000, pengeluaran: 7100000 },
    { month: "Jul", pemasukan: 12000000, pengeluaran: 6800000 },
    { month: "Agu", pemasukan: 11000000, pengeluaran: 8400000 },
    { month: "Sep", pemasukan: 13000000, pengeluaran: 7500000 },
    { month: "Okt", pemasukan: 12500000, pengeluaran: 6200000 },
  ];

  // Category Distribution
  const categoryData = [
    { name: "Makan & Minum", value: 2450000, color: "#10b981" },
    { name: "Kebutuhan Rumah", value: 1850000, color: "#0ea5e9" },
    { name: "Transportasi", value: 950000, color: "#f59e0b" },
    { name: "Tagihan & Listrik", value: 750000, color: "#8b5cf6" },
    { name: "Hiburan & Jajan", value: 650000, color: "#ec4899" },
  ];

  // Calculated Metrics
  const totalNetWorth = wallets.reduce((acc, curr) => acc + curr.balance, 0);
  const monthlyIncome = 12500000;
  const monthlyExpense = 6200000;
  const totalSavings = goals.reduce((acc, curr) => acc + curr.currentAmount, 0);
  const budgetLimit = 8000000;

  // Add Transaction Handler
  const handleAddTransaction = (newTx: TransactionItem) => {
    setTransactions((prev) => [newTx, ...prev]);

    // Update Wallet Balances accordingly
    setWallets((prev) =>
      prev.map((w) => {
        if (newTx.type === "INCOME" && w.name === newTx.wallet) {
          return { ...w, balance: w.balance + newTx.amount };
        }
        if (newTx.type === "EXPENSE" && w.name === newTx.wallet) {
          return { ...w, balance: Math.max(0, w.balance - newTx.amount) };
        }
        if (newTx.type === "TRANSFER") {
          if (w.name === newTx.wallet) return { ...w, balance: w.balance - newTx.amount };
          if (w.name === newTx.destinationWallet) return { ...w, balance: w.balance + newTx.amount };
        }
        return w;
      })
    );
  };

  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* NAVIGATION */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col min-w-0 pb-24 md:pb-10">
        {/* TOPBAR */}
        <header className="h-16 border-b border-[#27272a] px-6 flex items-center justify-between bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-30">
          <div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Selamat Datang Kembali
              <span className="text-xs font-normal text-zinc-500 hidden sm:inline">• Periode Oktober 2026</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121215] border border-[#27272a] text-xs text-zinc-400">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Ruang Keuangan Bersama</span>
            </div>

            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Catat Transaksi</span>
            </button>
          </div>
        </header>

        {/* BODY CONTENT BY TAB */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <>
              {/* 1. METRIC CARDS */}
              <MetricCards
                netWorth={totalNetWorth}
                monthlyIncome={monthlyIncome}
                monthlyExpense={monthlyExpense}
                totalSavings={totalSavings}
                budgetLimit={budgetLimit}
              />

              {/* 2. AI FINANCIAL ADVISOR WIDGET */}
              <AiAdvisorWidget
                summary={{
                  totalBalance: totalNetWorth,
                  income: monthlyIncome,
                  expense: monthlyExpense,
                  topCategory: "Makan & Minum",
                  activeGoalTitle: "Dana Darurat",
                  goalCurrent: 18500000,
                  goalTarget: 30000000,
                }}
              />

              {/* 3. CHARTS */}
              <AnalyticsCharts
                cashFlowData={cashFlowData}
                categoryData={categoryData}
              />

              {/* 4. WALLETS PREVIEW */}
              <WalletList wallets={wallets} />

              {/* 5. SAVINGS GOALS */}
              <SavingsGoalsList goals={goals} />

              {/* 6. RECENT TRANSACTIONS */}
              <TransactionFeed transactions={transactions} />
            </>
          )}

          {activeTab === "transactions" && (
            <div className="space-y-4">
              <TransactionFeed transactions={transactions} />
            </div>
          )}

          {activeTab === "wallets" && (
            <div className="space-y-4">
              <WalletList
                wallets={wallets}
                onAddWallet={() => setIsQuickAddOpen(true)}
              />
            </div>
          )}

          {activeTab === "goals" && (
            <div className="space-y-4">
              <SavingsGoalsList
                goals={goals}
                onAddGoal={() => setIsQuickAddOpen(true)}
              />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <AnalyticsCharts
                cashFlowData={cashFlowData}
                categoryData={categoryData}
              />
            </div>
          )}
        </div>
      </main>

      {/* QUICK ADD MODAL (SMART AI + MANUAL) */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        wallets={wallets}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}
