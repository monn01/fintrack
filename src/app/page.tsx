"use client";

import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import BankingHero from "@/components/BankingHero";
import AiAdvisorWidget from "@/components/AiAdvisorWidget";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import WalletList, { WalletItem } from "@/components/WalletList";
import SavingsGoalsList, { SavingsGoalItem } from "@/components/SavingsGoalsList";
import TransactionFeed, { TransactionItem } from "@/components/TransactionFeed";
import FinancialCalendar, { CalendarPlanItem } from "@/components/FinancialCalendar";
import QuickAddModal from "@/components/QuickAddModal";
import AddWalletModal from "@/components/AddWalletModal";
import AddGoalModal from "@/components/AddGoalModal";
import DepositGoalModal from "@/components/DepositGoalModal";
import FinancePromoBanners from "@/components/FinancePromoBanners";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import { Plus, LogOut, ArrowLeftRight, CreditCard, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; user: string } | null>(null);

  // Modals & Editing States
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [depositingGoal, setDepositingGoal] = useState<SavingsGoalItem | null>(null);

  const [editingWallet, setEditingWallet] = useState<WalletItem | null>(null);
  const [editingGoal, setEditingGoal] = useState<SavingsGoalItem | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<TransactionItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "WALLET" | "GOAL" | "TRANSACTION";
    id: string;
    title: string;
    description: string;
  } | null>(null);

  // Real Data States
  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [goals, setGoals] = useState<SavingsGoalItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [calendarPlans, setCalendarPlans] = useState<CalendarPlanItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentMonthName, setCurrentMonthName] = useState("Bulan Berjalan");

  // Fetch user session
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
          const savedPlans = localStorage.getItem("fintrack_calendar_plans");
          if (savedPlans) setCalendarPlans(JSON.parse(savedPlans));
        } catch (err) {
          console.error(err);
        }
      })
      .finally(() => {
        const savedPlans = localStorage.getItem("fintrack_calendar_plans");
        if (savedPlans) setCalendarPlans(JSON.parse(savedPlans));
        setIsLoaded(true);
      });
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("fintrack_wallets", JSON.stringify(wallets));
      localStorage.setItem("fintrack_goals", JSON.stringify(goals));
      localStorage.setItem("fintrack_transactions", JSON.stringify(transactions));
      localStorage.setItem("fintrack_calendar_plans", JSON.stringify(calendarPlans));
    } catch (e) {
      console.error(e);
    }
  }, [wallets, goals, transactions, calendarPlans, isLoaded]);

  // Handle Add Transaction
  const handleAddTransaction = async (newTx: TransactionItem) => {
    setTransactions((prev) => [newTx, ...prev]);

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

  // Handle Add Wallet
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

  // Handle Add Goal
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

  // Handle Deposit to Goal
  const handleDepositGoal = async (goalId: string, walletId: string, amount: number) => {
    const sourceWallet = wallets.find((w) => w.id === walletId);
    if (!sourceWallet || sourceWallet.balance < amount) {
      alert("Saldo rekening tidak mencukupi untuk melakukan setoran tabungan ini.");
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

  // Handle Edit Wallet
  const handleEditWallet = async (updatedWallet: WalletItem) => {
    setWallets((prev) => prev.map((w) => (w.id === updatedWallet.id ? updatedWallet : w)));

    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_WALLET", payload: updatedWallet }),
      });
    } catch (err) {
      console.error("Failed to update wallet:", err);
    }
  };

  // Handle Delete Wallet
  const handleDeleteWallet = (walletId: string) => {
    const target = wallets.find((w) => w.id === walletId);
    setDeleteConfirm({
      type: "WALLET",
      id: walletId,
      title: `Hapus Rekening "${target?.name || "Dompet"}"?`,
      description: "Rekening ini beserta seluruh transaksi terkait akan dihapus secara permanen.",
    });
  };

  // Handle Edit Goal
  const handleEditGoal = async (updatedGoal: SavingsGoalItem) => {
    setGoals((prev) => prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));

    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_GOAL", payload: updatedGoal }),
      });
    } catch (err) {
      console.error("Failed to update goal:", err);
    }
  };

  // Handle Delete Goal
  const handleDeleteGoal = (goalId: string) => {
    const target = goals.find((g) => g.id === goalId);
    setDeleteConfirm({
      type: "GOAL",
      id: goalId,
      title: `Hapus Target "${target?.title || "Tabungan"}"?`,
      description: "Target tabungan ini akan dihapus dari daftar impian Anda.",
    });
  };

  // Handle Edit Transaction
  const handleEditTransaction = async (updatedTx: TransactionItem) => {
    const oldTx = transactions.find((t) => t.id === updatedTx.id);

    // Revert old impact and apply new impact on wallets
    if (oldTx) {
      setWallets((prev) =>
        prev.map((w) => {
          let bal = w.balance;
          // Revert old
          if (oldTx.type === "INCOME" && w.name === oldTx.wallet) bal -= oldTx.amount;
          if (oldTx.type === "EXPENSE" && w.name === oldTx.wallet) bal += oldTx.amount;
          if (oldTx.type === "TRANSFER") {
            if (w.name === oldTx.wallet) bal += oldTx.amount;
            if (w.name === oldTx.destinationWallet) bal -= oldTx.amount;
          }

          // Apply new
          if (updatedTx.type === "INCOME" && w.name === updatedTx.wallet) bal += updatedTx.amount;
          if (updatedTx.type === "EXPENSE" && w.name === updatedTx.wallet) bal -= updatedTx.amount;
          if (updatedTx.type === "TRANSFER") {
            if (w.name === updatedTx.wallet) bal -= updatedTx.amount;
            if (w.name === updatedTx.destinationWallet) bal += updatedTx.amount;
          }

          return { ...w, balance: Math.max(0, bal) };
        })
      );
    }

    setTransactions((prev) => prev.map((t) => (t.id === updatedTx.id ? updatedTx : t)));

    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_TRANSACTION", payload: updatedTx }),
      });
    } catch (err) {
      console.error("Failed to update transaction:", err);
    }
  };

  // Handle Delete Transaction
  const handleDeleteTransaction = (txId: string) => {
    const target = transactions.find((t) => t.id === txId);
    setDeleteConfirm({
      type: "TRANSACTION",
      id: txId,
      title: "Hapus Riwayat Transaksi?",
      description: `Transaksi "${target?.description || "Mutasi"}" akan dihapus dan saldo dompet akan dikembalikan ke posisi semula.`,
    });
  };

  // Execute confirmed deletion
  const handleExecuteDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;

    if (type === "WALLET") {
      setWallets((prev) => prev.filter((w) => w.id !== id));
      try {
        await fetch("/api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "DELETE_WALLET", payload: { id } }),
        });
      } catch (err) {
        console.error(err);
      }
    } else if (type === "GOAL") {
      setGoals((prev) => prev.filter((g) => g.id !== id));
      try {
        await fetch("/api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "DELETE_GOAL", payload: { id } }),
        });
      } catch (err) {
        console.error(err);
      }
    } else if (type === "TRANSACTION") {
      const target = transactions.find((t) => t.id === id);
      if (target) {
        // Revert wallet balance
        setWallets((prev) =>
          prev.map((w) => {
            let bal = w.balance;
            if (target.type === "INCOME" && w.name === target.wallet) bal -= target.amount;
            if (target.type === "EXPENSE" && w.name === target.wallet) bal += target.amount;
            if (target.type === "TRANSFER") {
              if (w.name === target.wallet) bal += target.amount;
              if (w.name === target.destinationWallet) bal -= target.amount;
            }
            return { ...w, balance: Math.max(0, bal) };
          })
        );
      }
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      try {
        await fetch("/api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "DELETE_TRANSACTION", payload: { id } }),
        });
      } catch (err) {
        console.error(err);
      }
    }
    setDeleteConfirm(null);
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

  // Category Breakdown
  const categoryMap = new Map<string, number>();
  transactions
    .filter((t) => t.type === "EXPENSE")
    .forEach((t) => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

  const categoryColors = ["#0052cc", "#0747a6", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
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
    <div className="flex min-h-screen bg-[#f4f6fa] text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* NAVIGATION */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        currentUser={currentUser}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 pb-24 md:pb-12 md:ml-64">
        {/* TOPBAR (CLEAN BANKING HEADER) */}
        <header className="h-16 border-b border-slate-200/90 px-6 sm:px-8 flex items-center justify-between bg-white sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 text-sm sm:text-base">
              FinTrack Digital
            </span>
            <span className="hidden sm:inline text-xs text-slate-400 font-medium">| {currentMonthName}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0052cc] hover:bg-[#0747a6] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer btn-tactile"
            >
              <Plus className="w-4 h-4 stroke-[2.5] icon-pop" />
              <span className="hidden sm:inline">Catat Transaksi</span>
            </button>

            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                router.push("/login");
                router.refresh();
              }}
              title="Keluar dari akun"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs sm:text-sm font-semibold transition-all cursor-pointer btn-tactile"
            >
              <LogOut className="w-4 h-4 icon-pop" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* CONTENT VIEWPORT */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <>
              {/* 1. BANKING HERO DASHBOARD (myBCA / GOPAY STYLE) */}
              <BankingHero
                userName={currentUser?.name || "Pengguna"}
                isPartner={currentUser?.user === "partner"}
                netWorth={totalNetWorth}
                monthlyIncome={monthlyIncome}
                monthlyExpense={monthlyExpense}
                totalSavings={totalSavings}
                onOpenQuickAdd={() => setIsQuickAddOpen(true)}
                onOpenAddWallet={() => setIsAddWalletOpen(true)}
                onOpenAddGoal={() => setIsAddGoalOpen(true)}
              />

              {/* 2. PROMO & FINANCE INSIGHT BANNERS (myBCA / GOPAY ADS STYLE) */}
              <FinancePromoBanners
                onOpenAddGoal={() => setIsAddGoalOpen(true)}
                monthlyExpense={monthlyExpense}
              />

              {/* 3. AI FINANCIAL ADVISOR WIDGET */}
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
                onEditWallet={(wallet) => setEditingWallet(wallet)}
                onDeleteWallet={handleDeleteWallet}
              />

              {/* 5. GOALS */}
              <SavingsGoalsList
                goals={goals}
                onAddGoal={() => setIsAddGoalOpen(true)}
                onDepositGoal={(goalId) => {
                  const g = goals.find((item) => item.id === goalId);
                  if (g) setDepositingGoal(g);
                }}
                onEditGoal={(goal) => setEditingGoal(goal)}
                onDeleteGoal={handleDeleteGoal}
              />

              {/* 6. TRANSACTIONS */}
              <TransactionFeed
                transactions={transactions}
                onEditTransaction={(tx) => setEditingTransaction(tx)}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </>
          )}

          {activeTab === "calendar" && (
            <div className="space-y-4">
              <FinancialCalendar
                plans={calendarPlans}
                onAddPlan={(newPlan) => setCalendarPlans((prev) => [...prev, newPlan])}
                onEditPlan={(updatedPlan) =>
                  setCalendarPlans((prev) =>
                    prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
                  )
                }
                onTogglePaid={(planId) =>
                  setCalendarPlans((prev) =>
                    prev.map((p) => (p.id === planId ? { ...p, isPaid: !p.isPaid } : p))
                  )
                }
                onDeletePlan={(planId) =>
                  setCalendarPlans((prev) => prev.filter((p) => p.id !== planId))
                }
              />
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="space-y-4">
              <TransactionFeed
                transactions={transactions}
                onEditTransaction={(tx) => setEditingTransaction(tx)}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
          )}

          {activeTab === "wallets" && (
            <div className="space-y-4">
              <WalletList
                wallets={wallets}
                onAddWallet={() => setIsAddWalletOpen(true)}
                onEditWallet={(wallet) => setEditingWallet(wallet)}
                onDeleteWallet={handleDeleteWallet}
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
                onEditGoal={(goal) => setEditingGoal(goal)}
                onDeleteGoal={handleDeleteGoal}
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
        isOpen={isQuickAddOpen || !!editingTransaction}
        onClose={() => {
          setIsQuickAddOpen(false);
          setEditingTransaction(null);
        }}
        wallets={wallets}
        onAddTransaction={handleAddTransaction}
        transactionToEdit={editingTransaction}
        onEditTransaction={handleEditTransaction}
      />

      <AddWalletModal
        isOpen={isAddWalletOpen || !!editingWallet}
        onClose={() => {
          setIsAddWalletOpen(false);
          setEditingWallet(null);
        }}
        onAddWallet={handleAddWallet}
        walletToEdit={editingWallet}
        onEditWallet={handleEditWallet}
      />

      <AddGoalModal
        isOpen={isAddGoalOpen || !!editingGoal}
        onClose={() => {
          setIsAddGoalOpen(false);
          setEditingGoal(null);
        }}
        onAddGoal={handleAddGoal}
        goalToEdit={editingGoal}
        onEditGoal={handleEditGoal}
      />

      <DepositGoalModal
        isOpen={!!depositingGoal}
        onClose={() => setDepositingGoal(null)}
        goal={depositingGoal}
        wallets={wallets}
        onDeposit={handleDepositGoal}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleExecuteDelete}
        title={deleteConfirm?.title || "Konfirmasi Hapus"}
        description={deleteConfirm?.description || "Tindakan ini tidak dapat dibatalkan."}
      />
    </div>
  );
}
