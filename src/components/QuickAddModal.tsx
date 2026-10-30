"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight, Check } from "lucide-react";
import { WalletItem } from "./WalletList";
import { TransactionItem } from "./TransactionFeed";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: WalletItem[];
  onAddTransaction: (newTx: any) => void;
  transactionToEdit?: TransactionItem | null;
  onEditTransaction?: (updatedTx: TransactionItem) => void;
}

export default function QuickAddModal({
  isOpen,
  onClose,
  wallets,
  onAddTransaction,
  transactionToEdit,
  onEditTransaction,
}: QuickAddModalProps) {
  const [activeTab, setActiveTab] = useState<"ai" | "manual">("ai");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Form states
  const [type, setType] = useState<"EXPENSE" | "INCOME" | "TRANSFER">("EXPENSE");
  const [amount, setAmount] = useState<string>("");
  const [walletId, setWalletId] = useState<string>(wallets[0]?.id || "");
  const [destinationWalletId, setDestinationWalletId] = useState<string>(wallets[1]?.id || "");
  const [category, setCategory] = useState<string>("Makan & Minum");
  const [description, setDescription] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");

  useEffect(() => {
    if (transactionToEdit) {
      setActiveTab("manual");
      setType(transactionToEdit.type || "EXPENSE");
      setAmount(transactionToEdit.amount !== undefined ? String(transactionToEdit.amount) : "");
      setDescription(transactionToEdit.description || "");
      setCategory(transactionToEdit.category || "Makan & Minum");
      setTagInput((transactionToEdit.tags || []).join(", "));

      const matchedSource = wallets.find((w) => w.name === transactionToEdit.wallet);
      if (matchedSource) setWalletId(matchedSource.id);

      const matchedDest = wallets.find((w) => w.name === transactionToEdit.destinationWallet);
      if (matchedDest) setDestinationWalletId(matchedDest.id);
    } else {
      setActiveTab("ai");
      setType("EXPENSE");
      setAmount("");
      setDescription("");
      setCategory("Makan & Minum");
      setTagInput("");
      setAiPrompt("");
      if (wallets.length > 0) setWalletId(wallets[0].id);
      if (wallets.length > 1) setDestinationWalletId(wallets[1].id);
    }
  }, [transactionToEdit, isOpen, wallets]);

  if (!isOpen) return null;

  const categories = [
    "Makan & Minum",
    "Transportasi",
    "Belanja",
    "Tagihan & Utilitas",
    "Hiburan & Hobi",
    "Kesehatan",
    "Pendidikan",
    "Gaji / Penghasilan",
    "Investasi",
    "Lain-lain",
  ];

  const handleAiParse = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/ai/parse-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const item = data.data;
        setType(item.type || "EXPENSE");
        setAmount(item.amount?.toString() || "");
        setDescription(item.description || aiPrompt);

        // Match category
        const matchedCat = categories.find((c) =>
          c.toLowerCase().includes(item.categoryName.toLowerCase())
        );
        if (matchedCat) setCategory(matchedCat);

        // Match wallet
        const matchedWallet = wallets.find((w) =>
          w.name.toLowerCase().includes(item.walletName.toLowerCase())
        );
        if (matchedWallet) setWalletId(matchedWallet.id);

        setActiveTab("manual");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount.replace(/\./g, "").replace(/,/g, ""));
    if (isNaN(num) || num <= 0) return;

    const selectedWallet = wallets.find((w) => w.id === walletId)?.name || "Dompet";
    const selectedDest = wallets.find((w) => w.id === destinationWalletId)?.name;

    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (transactionToEdit && onEditTransaction) {
      onEditTransaction({
        ...transactionToEdit,
        type,
        amount: num,
        category,
        wallet: selectedWallet,
        destinationWallet: type === "TRANSFER" ? selectedDest : undefined,
        description: description || (type === "INCOME" ? "Pemasukan" : "Pengeluaran"),
        tags,
      });
    } else {
      onAddTransaction({
        id: "tx-" + Date.now(),
        type,
        amount: num,
        category,
        wallet: selectedWallet,
        destinationWallet: type === "TRANSFER" ? selectedDest : undefined,
        description: description || (type === "INCOME" ? "Pemasukan" : "Pengeluaran"),
        date: new Date().toISOString(),
        tags,
      });
    }

    setAmount("");
    setDescription("");
    setAiPrompt("");
    setTagInput("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* HEADER */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              {transactionToEdit ? "Edit Transaksi" : "Catat Transaksi"}
            </h3>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              {transactionToEdit ? "Perbarui" : "Baru"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === "ai"
                ? "text-blue-700 border-b-2 border-blue-600 bg-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Smart Logger</span>
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === "manual"
                ? "text-blue-700 border-b-2 border-blue-600 bg-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>Form Manual</span>
          </button>
        </div>

        {/* TAB 1: AI */}
        {activeTab === "ai" ? (
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ketik kalimat bebas transaksi Anda:
              </label>
              <textarea
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Contoh: Makan soto 35rb bayar pake Gopay tadi siang&#10;atau: Gaji freelance 2.5jt masuk rekening BCA"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 resize-none font-sans"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-blue-900 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                Tips Penggunaan:
              </p>
              <p>• Masukkan nominal (misal: 25rb, 50k, 1.5jt) dan nama akun/dompet Anda.</p>
              <p>• AI akan otomatis menentukan jenis transaksi, kategori, dan nominalnya.</p>
            </div>

            <button
              onClick={handleAiParse}
              disabled={isAiLoading || !aiPrompt.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-blue-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAiLoading ? "Sedang Menganalisis..." : "Ekstrak & Isi Form"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* TAB 2: MANUAL */
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* TYPE SWITCHER */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 border border-slate-200 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setType("EXPENSE")}
                className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  type === "EXPENSE" ? "bg-rose-500 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setType("INCOME")}
                className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  type === "INCOME" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Pemasukan
              </button>
              <button
                type="button"
                onClick={() => setType("TRANSFER")}
                className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  type === "TRANSFER" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Transfer
              </button>
            </div>

            {/* AMOUNT */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nominal (IDR)
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-900 font-mono font-bold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* WALLET SELECTION */}
            <div className={type === "TRANSFER" ? "grid grid-cols-2 gap-3" : "block"}>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {type === "TRANSFER" ? "Dari Dompet" : "Dompet / Akun"}
                </label>
                <select
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:bg-white focus:border-blue-500"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.isShared ? "Bersama" : "Pribadi"})
                    </option>
                  ))}
                </select>
              </div>

              {type === "TRANSFER" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ke Dompet Tujuan
                  </label>
                  <select
                    value={destinationWalletId}
                    onChange={(e) => setDestinationWalletId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:bg-white focus:border-blue-500"
                  >
                    {wallets.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* CATEGORY */}
            {type !== "TRANSFER" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:bg-white focus:border-blue-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* DESCRIPTION */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Keterangan
              </label>
              <input
                type="text"
                placeholder="misal: Belanja sayur mingguan, Kopi susu, dll."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
              />
            </div>

            {/* TAGS */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tagar (opsional, pisahkan koma)
              </label>
              <input
                type="text"
                placeholder="misal: #kuliner, #weekend"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 font-mono text-[11px]"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20"
              >
                <Check className="w-4 h-4" />
                <span>{transactionToEdit ? "Simpan Perubahan" : "Simpan Transaksi"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
