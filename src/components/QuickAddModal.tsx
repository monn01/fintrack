"use client";

import React, { useState } from "react";
import { X, Sparkles, ArrowRight, Check } from "lucide-react";
import { WalletItem } from "./WalletList";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: WalletItem[];
  onAddTransaction: (newTx: any) => void;
}

export default function QuickAddModal({
  isOpen,
  onClose,
  wallets,
  onAddTransaction,
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

        setActiveTab("manual"); // Switch to manual tab so user can review and confirm
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

    // Reset & close
    setAmount("");
    setDescription("");
    setAiPrompt("");
    setTagInput("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121215] border border-[#27272a] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* MODAL HEADER */}
        <div className="p-4 border-b border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">Catat Transaksi</h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
              Baru
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-[#27272a] bg-[#09090b]">
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === "ai"
                ? "text-emerald-400 border-b-2 border-emerald-400 bg-[#121215]"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Smart Logger</span>
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === "manual"
                ? "text-emerald-400 border-b-2 border-emerald-400 bg-[#121215]"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>Form Manual</span>
          </button>
        </div>

        {/* TAB 1: AI SMART LOGGER */}
        {activeTab === "ai" ? (
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Ketik kalimat bebas transaksi Anda:
              </label>
              <textarea
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Contoh: Makan soto 35rb bayar pake Gopay tadi siang&#10;atau: Gaji freelance 2.5jt masuk rekening BCA"
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 resize-none font-sans"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#09090b]/50 border border-[#27272a] text-[11px] text-zinc-400 space-y-1">
              <p className="font-semibold text-zinc-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Tips Cerdas:
              </p>
              <p>• Sebutkan nominal (misal: 25rb, 50k, 1.5jt) dan nama dompet jika ingin otomatis terpilih.</p>
              <p>• AI akan otomatis mendeteksi apakah itu pengeluaran atau pemasukan.</p>
            </div>

            <button
              onClick={handleAiParse}
              disabled={isAiLoading || !aiPrompt.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAiLoading ? "Sedang Menganalisis..." : "Ekstrak & Isi Form"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* TAB 2: MANUAL FORM */
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* TYPE SWITCHER */}
            <div className="grid grid-cols-3 gap-1 bg-[#09090b] border border-[#27272a] p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setType("EXPENSE")}
                className={`py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  type === "EXPENSE" ? "bg-rose-500 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setType("INCOME")}
                className={`py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  type === "INCOME" ? "bg-emerald-500 text-black font-semibold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Pemasukan
              </button>
              <button
                type="button"
                onClick={() => setType("TRANSFER")}
                className={`py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  type === "TRANSFER" ? "bg-sky-500 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Transfer
              </button>
            </div>

            {/* AMOUNT */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Nominal (IDR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-zinc-500">
                  Rp
                </span>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl pl-10 pr-3 py-2 text-sm text-white font-mono font-bold placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {/* WALLET SELECTION */}
            <div className={type === "TRANSFER" ? "grid grid-cols-2 gap-3" : "block"}>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  {type === "TRANSFER" ? "Dari Dompet" : "Dompet / Akun"}
                </label>
                <select
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
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
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Ke Dompet Tujuan
                  </label>
                  <select
                    value={destinationWalletId}
                    onChange={(e) => setDestinationWalletId(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
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

            {/* CATEGORY (for income & expense) */}
            {type !== "TRANSFER" && (
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
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
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Deskripsi / Catatan
              </label>
              <input
                type="text"
                placeholder="misal: Nasi Padang siang, Kopi susu, dll."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* TAGS */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Tagar (pisahkan dengan koma)
              </label>
              <input
                type="text"
                placeholder="misal: #kuliner, #weekend, #urgent"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-mono text-[11px]"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Transaksi</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
