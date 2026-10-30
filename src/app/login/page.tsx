"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck, Heart } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Silakan isi username dan kata sandi.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk. Periksa kembali username dan kata sandi.");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (user: string) => {
    setUsername(user);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col justify-center items-center p-4 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      <div className="w-full max-w-md">
        {/* LOGO & BRANDING */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-2xl shadow-md shadow-blue-500/20 mb-3">
            F
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center justify-center gap-2">
            FinTrack
            <span className="text-[11px] font-semibold uppercase bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-md">
              Private
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manajemen Keuangan Personal & Bersama Pasangan
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="p-7 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm shadow-slate-200/60 relative">
          {/* USER PROFILE SELECTOR */}
          <div className="mb-6">
            <span className="block text-xs font-semibold text-slate-700 mb-2">
              Pilih Akun:
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickSelect("monn")}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center gap-2.5 ${
                  username.toLowerCase() === "monn"
                    ? "bg-blue-50/80 border-blue-500 text-blue-900 ring-1 ring-blue-500/20"
                    : "bg-slate-50/80 border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                  M
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-900 truncate">Monn</p>
                  <p className="text-[10px] text-slate-500">Pemilik Utama</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect("pasangan")}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center gap-2.5 ${
                  username.toLowerCase() === "pasangan" || username.toLowerCase() === "partner"
                    ? "bg-rose-50/80 border-rose-500 text-rose-900 ring-1 ring-rose-500/20"
                    : "bg-slate-50/80 border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-rose-500 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-900 truncate">Pasangan</p>
                  <p className="text-[10px] text-slate-500">Partner</p>
                </div>
              </button>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* USERNAME FIELD */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Ketik 'monn' atau 'pasangan'..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-sans"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs leading-relaxed animate-in fade-in duration-150">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-md shadow-blue-500/20 mt-2"
            >
              <span>{loading ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* FOOTNOTE */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Terkunci privat untuk Monn & Pasangan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
