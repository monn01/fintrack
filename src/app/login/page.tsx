"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Heart, 
  TrendingUp, 
  Wallet, 
  PiggyBank, 
  Sparkles,
  CircleDollarSign,
  LineChart,
  BadgeCheck
} from "lucide-react";

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
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-100 selection:text-blue-700 relative overflow-hidden">
      {/* BACKGROUND DECORATIVE PATTERNS (FINTECH VIBES) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/50 via-blue-50/20 to-transparent pointer-events-none rounded-full blur-3xl -z-10" />
      <div className="absolute top-12 left-10 text-blue-200/50 hidden lg:block pointer-events-none">
        <LineChart className="w-32 h-32" />
      </div>
      <div className="absolute bottom-10 right-10 text-indigo-100/60 hidden lg:block pointer-events-none">
        <PiggyBank className="w-36 h-36" />
      </div>

      <div className="w-full max-w-5xl bg-white border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/70 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* LEFT COLUMN: VISUAL BRANDING & HIGHLIGHTS */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* LOGO */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-white text-blue-700 flex items-center justify-center font-black text-2xl shadow-lg shadow-black/10">
                F
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
                  FinTrack
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-xs border border-white/20">
                    Pro
                  </span>
                </span>
                <p className="text-xs text-blue-100/80 font-medium">Smart Financial Assistant</p>
              </div>
            </div>

            {/* HEADLINE */}
            <div className="space-y-3 mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                Kelola Arus Kas & Tabungan Tanpa Rumit.
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed font-normal">
                Sistem pencatatan terpadu untuk keuangan personal dan rencana bersama pasangan, dilengkapi visualisasi analitik & saran finansial cerdas.
              </p>
            </div>

            {/* HIGHLIGHT PILLS */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Lacak Arus Kas Otomatis</p>
                  <p className="text-[10px] text-blue-100/70">Pemasukan, pengeluaran & grafik tren bulanan</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Ruang Keuangan Bersama</p>
                  <p className="text-[10px] text-blue-100/70">Dompet kas rumah tangga & target tabungan bareng</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">AI Financial Health Advisor</p>
                  <p className="text-[10px] text-blue-100/70">Deteksi kebocoran belanja & saran penghematan</p>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM GUARANTEE */}
          <div className="pt-6 mt-6 border-t border-white/15 flex items-center gap-2 text-[11px] text-blue-100/70 font-medium">
            <BadgeCheck className="w-4 h-4 text-emerald-300" />
            <span>Tersinkronisasi aman ke PostgreSQL Supabase</span>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                Area Privat
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Masuk ke FinTrack
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Masukkan username dan kata sandi Anda untuk mengakses akun.
              </p>
            </div>

            {/* FORM INPUTS */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Masukkan username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  />
                </div>
              </div>

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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-sans font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs leading-relaxed animate-in fade-in duration-150 font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-md shadow-blue-500/25 mt-2"
              >
                <span>{loading ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Sesi terenkripsi & dilindungi cookie privat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
