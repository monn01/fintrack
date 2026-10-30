"use client";

import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import MetricCards from "@/components/MetricCards";
import AiAdvisorWidget from "@/components/AiAdvisorWidget";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import WalletList, { WalletItem } from "@/components/WalletList";
import SavingsGoalsList, { SavingsGoalItem } from "@/components/SavingsGoalsList";
import TransactionFeed, { TransactionItem } from "@/components/TransactionFeed";
import QuickAddModal from "@/components/QuickAddModal";
import AddWalletModal from "@/components/AddWalletModal";
import AddGoalModal from "@/components/AddGoalModal";
import DepositGoalModal from "@/components/DepositGoalModal";
import { Plus, Heart, Sparkles, Building2, PiggyBank, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; user: string } | null>(null);

  // Modals
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [depositingGoal, setDepositingGoal] = useState<SavingsGoalItem | null>(null);

  // Real Data States
  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [goals, setGoals] = useState<SavingsGoalItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentMonthName, setCurrentMonthName] = useState("Periode Berjalan");

  // Fetch current authenticated user & month
  useEffect(() => {
    setCurrentMonthName(new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date()));
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Load from Supabase API (with LocalStorage backup)
  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.wallets && data.wallets.length > 0) setWallets(data.wallets);
          else {
            const savedWallets = localStorage.getItem("fintrack_wallets");
            if (savedWallets) setWallets(JSON.parse(savedWallets));
          }

          if (data.goals && data.goals.length > 0) setGoals(data.goals);
          else {
            const savedGoals = localStorage.getItem("fintrack_goals");
            if (savedGoals) setGoals(JSON.parse(savedGoals));
          }

          if (data.transactions && data.transactions.length > 0) setTransactions(data.transactions);
          else {
            const savedTx = localStorage.getItem("fintrack_transactions");
            if (savedTx) setTransactions(JSON.parse(savedTx));
          }
        }
      })
      .catch((e) => {
        console.error("Supabase load error, falling back to local:", e);
        try {
          const savedWallets = localStorage.getItem("fintrack_wallets");
          const savedGoals = localStorage.getItem("fintrack_goals");
          const savedTx = localStorage.getItem("fintrack_transactions");
          if (savedWallets) setWallets(JSON.parse(savedWallets));
          if (savedGoals) setGoals(JSON.parse(savedGoals));
          if (savedTx) setTransactions(JSON.parse(savedTx));
        } catch (err) {
          console.error(err);
        }
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("fintrack_wallets", JSON.stringify(wallets));
      localStorage.setItem("fintrack_goals", JSON.stringify(goals));
      localStorage.setItem("fintrack_transactions", JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [wallets, goals, transactions, isLoaded]);

  // Handle Add Transaction (Local + Supabase Sync)
  const handleAddTransaction = async (newTx: TransactionItem) => {
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

    // Sync to Supabase
    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD_TRANSACTION", payload: newTx }),
      });
    } catch (err) {
      console.error("Failed to sync transaction to Supabase:", err);
    }
  };

  // Handle Add Wallet (Local + Supabase Sync)
  const handleAddWallet = async (newWallet: WalletItem) => {
    setWallets((prev) => [...prev, newWallet]);

    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD_WALLET", payload: newWallet }),
      });
    } catch (err) {
      console.error("Failed to sync wallet to Supabase:", err);
    }
  };

  // Handle Add Goal (Local + Supabase Sync)
  const handleAddGoal = async (newGoal: SavingsGoalItem) => {
    setGoals((prev) => [...prev, newGoal]);

    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD_GOAL", payload: newGoal }),
      });
    } catch (err) {
      console.error("Failed to sync goal to Supabase:", err);
    }
  };

  // Handle Deposit to Goal (Local + Supabase Sync)
  const handleDepositGoal = async (goalId: string, walletId: string, amount: number) => {
    const sourceWallet = wallets.find((w) => w.id === walletId);
    if (!sourceWallet || sourceWallet.balance < amount) {
      alert("Saldo dompet tidak mencukupi untuk melakukan setoran tabungan ini.");
      return;
    }

    setWallets((prev) =>
      prev.map((w) => (w.id === walletId ? { ...w, balance: w.balance - amount } : w))
    );

    const targetGoal = goals.find((g) => g.id === goalId);
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g))
    );

    const depositTx: TransactionItem = {
      id: "tx-" + Date.now(),
      type: "TRANSFER",
      amount: amount,
      category: "Tabungan",
      wallet: sourceWallet.name,
      destinationWallet: `Target: ${targetGoal?.title || "Tabungan"}`,
      description: `Setor tabungan: ${targetGoal?.title || "Target"}`,
      date: new Date().toISOString(),
      tags: ["#tabungan"],
    };
    setTransactions((prev) => [depositTx, ...prev]);

    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DEPOSIT_GOAL",
          payload: { goalId, walletId, amount },
        }),
      });
    } catch (err) {
      console.error("Failed to sync deposit to Supabase:", err);
    }
  };

  // Metrics
  const totalNetWorth = wallets.reduce((acc, curr) => acc + curr.balance, 0);

  const monthlyIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSavings = goals.reduce((acc, curr) => acc + curr.currentAmount, 0);
  const budgetLimit = 8000000;

  // Category Breakdown
  const categoryMap = new Map<string, number>();
  transactions
    .filter((t) => t.type === "EXPENSE")
    .forEach((t) => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

  const categoryColors = ["#2563eb", "#3b82f6", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
  const dynamicCategoryData = Array.from(categoryMap.entries()).map(([name, value], i) => ({
    name,
    value,
    color: categoryColors[i % categoryColors.length],
  }));

  const categoryData =
    dynamicCategoryData.length > 0
      ? dynamicCategoryData
      : [{ name: "Belum Ada Pengeluaran", value: 1, color: "#cbd5e1" }];

  const dynamicCashFlowData = [
    { month: "Bulan Ini", pemasukan: monthlyIncome, pengeluaran: monthlyExpense },
  ];

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* NAVIGATION */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        currentUser={currentUser}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 pb-24 md:pb-10">
        {/* TOPBAR (TAILADMIN CLEAN HEADER) */}
        <header className="h-16 border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between bg-white sticky top-0 z-30 shadow-2xs">
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Halo, {currentUser?.name || "Monn"}
              <span className="text-xs font-normal text-slate-500 hidden sm:inline">• Periode {currentMonthName}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Ruang Keuangan {currentUser?.user === "partner" ? "Pasangan" : "Bersama"}</span>
            </div>

            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Catat Transaksi</span>
            </button>

            {/* LOGOUT BUTTON IN HEADER */}
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                router.push("/login");
                router.refresh();
              }}
              title="Keluar dari akun"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-500 hover:text-rose-600" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* BODY */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* WELCOME BANNER ON FRESH START */}
          {wallets.length === 0 && (
            <div className="p-6 rounded-2xl bg-white border border-blue-200 shadow-sm shadow-blue-500/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Selamat Datang di FinTrack!</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xl font-medium">
                  Sistem pencatatan keuangan Anda siap digunakan. Tambahkan rekening bank, dompet digital, atau uang tunai Anda untuk mulai mengelola keuangan secara profesional.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsAddWalletOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm shadow-blue-500/20"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Tambah Dompet</span>
                </button>
                <button
                  onClick={() => setIsAddGoalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <PiggyBank className="w-4 h-4 text-slate-600" />
                  <span>Buat Target</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "dashboard" && (
            <>
              {/* 1. METRICS */}
              <MetricCards
                netWorth={totalNetWorth}
                monthlyIncome={monthlyIncome}
                monthlyExpense={monthlyExpense}
                totalSavings={totalSavings}
                budgetLimit={budgetLimit}
              />

              {/* 2. AI ADVISOR */}
              <AiAdvisorWidget
                summary={{
                  totalBalance: totalNetWorth,
                  income: monthlyIncome,
                  expense: monthlyExpense,
                  topCategory: dynamicCategoryData[0]?.name || "Belum Ada",
                  activeGoalTitle: goals[0]?.title || "Belum Ditetapkan",
                  goalCurrent: goals[0]?.currentAmount || 0,
                  goalTarget: goals[0]?.targetAmount || 0,
                }}
              />

              {/* 3. CHARTS */}
              <AnalyticsCharts
                cashFlowData={dynamicCashFlowData}
                categoryData={categoryData}
              />

              {/* 4. WALLETS */}
              <WalletList
                wallets={wallets}
                onAddWallet={() => setIsAddWalletOpen(true)}
              />

              {/* 5. GOALS */}
              <SavingsGoalsList
                goals={goals}
                onAddGoal={() => setIsAddGoalOpen(true)}
                onDepositGoal={(goalId) => {
                  const g = goals.find((item) => item.id === goalId);
                  if (g) setDepositingGoal(g);
                }}
              />

              {/* 6. TRANSACTIONS */}
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
                onAddWallet={() => setIsAddWalletOpen(true)}
              />
            </div>
          )}

          {activeTab === "goals" && (
            <div className="space-y-4">
              <SavingsGoalsList
                goals={goals}
                onAddGoal={() => setIsAddGoalOpen(true)}
                onDepositGoal={(goalId) => {
                  const g = goals.find((item) => item.id === goalId);
                  if (g) setDepositingGoal(g);
                }}
              />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <AnalyticsCharts
                cashFlowData={dynamicCashFlowData}
                categoryData={categoryData}
              />
            </div>
          )}
        </div>
      </main>

      {/* MODALS */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        wallets={wallets}
        onAddTransaction={handleAddTransaction}
      />

      <AddWalletModal
        isOpen={isAddWalletOpen}
        onClose={() => setIsAddWalletOpen(false)}
        onAddWallet={handleAddWallet}
      />

      <AddGoalModal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        onAddGoal={handleAddGoal}
      />

      <DepositGoalModal
        isOpen={!!depositingGoal}
        onClose={() => setDepositingGoal(null)}
        goal={depositingGoal}
        wallets={wallets}
        onDeposit={handleDepositGoal}
      />
    </div>
  );
}
