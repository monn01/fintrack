"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Heart, ArrowRight, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<"monn" | "partner">("monn");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: selectedUser,
          password: password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk. Periksa kata sandi Anda.");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center items-center p-4 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      <div className="w-full max-w-md">
        {/* LOGO & BRANDING */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-black font-black text-2xl shadow-xl shadow-emerald-500/20 mb-3">
            F
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            FinTrack
            <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Ruang Privat
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Sistem Pencatatan Finansial Pribadi & Pasangan
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#121215] border border-[#27272a] shadow-2xl relative overflow-hidden">
          {/* PROFILE SELECTOR */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              Pilih Profil Pengguna:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedUser("monn")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  selectedUser === "monn"
                    ? "bg-[#18181b] border-emerald-500/50 shadow-sm shadow-emerald-500/10"
                    : "bg-[#09090b]/60 border-[#27272a] hover:border-zinc-700 text-zinc-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    selectedUser === "monn"
                      ? "bg-emerald-500 text-black"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  M
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Monn</p>
                  <p className="text-[10px] text-zinc-400">Pemilik Akun</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedUser("partner")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  selectedUser === "partner"
                    ? "bg-[#18181b] border-rose-500/50 shadow-sm shadow-rose-500/10"
                    : "bg-[#09090b]/60 border-[#27272a] hover:border-zinc-700 text-zinc-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    selectedUser === "partner"
                      ? "bg-rose-500 text-white"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Pasangan</p>
                  <p className="text-[10px] text-zinc-400">Partner Akses</p>
                </div>
              </button>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Kata Sandi / PIN:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs leading-relaxed">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-md mt-2"
            >
              <span>{loading ? "Memverifikasi..." : "Masuk ke FinTrack"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* SECURITY FOOTNOTE */}
          <div className="mt-6 pt-4 border-t border-[#27272a] flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terkunci secara privat untuk Anda dan pasangan</span>
          </div>
        </div>

        {/* DEFAULT PASSWORD HINT (FOR DEV / FIRST TIME) */}
        <div className="mt-4 p-3 rounded-xl bg-[#121215]/50 border border-[#27272a]/60 text-center text-[11px] text-zinc-400">
          <p>
            Kata sandi bawaan: Monn (<code className="text-emerald-400 font-mono">monn123</code>) • Pasangan (
            <code className="text-rose-400 font-mono">partner123</code>)
          </p>
        </div>
      </div>
    </div>
  );
}
