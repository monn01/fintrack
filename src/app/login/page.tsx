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
  CheckCircle2,
  Building2,
  Wallet,
  ArrowLeftRight
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
      setError("Silakan masukkan username dan kata sandi.");
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
        throw new Error(data.error || "Username atau kata sandi tidak sesuai.");
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
    <div className="min-h-screen bg-[#f4f6fa] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-blue-100 selection:text-blue-700">
      <div className="w-full max-w-4xl bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* LEFT COLUMN: BANKING INTRO BANNER */}
        <div className="lg:col-span-5 bg-[#0052cc] p-8 sm:p-10 text-white flex flex-col justify-between">
          <div>
            {/* BRAND */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-white text-[#0052cc] flex items-center justify-center font-black text-xl shadow-sm">
                F
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-white block">
                  FinTrack
                </span>
                <span className="text-xs text-blue-100 font-medium">Digital Financial Space</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
                Pencatatan Keuangan Harian Lebih Pasti & Transparan.
              </h2>
              <p className="text-sm text-blue-100/90 leading-relaxed font-normal">
                Satu aplikasi untuk memantau saldo rekening bank, dompet kas bersama, dan target tabungan pribadi secara real-time.
              </p>
            </div>

            {/* QUICK FEATURE LIST */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                <span className="text-sm text-blue-50 font-medium">Multi-rekening & dompet digital</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                <span className="text-sm text-blue-50 font-medium">Sinkronisasi data bersama pasangan</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                <span className="text-sm text-blue-50 font-medium">Keamanan sesi dengan proteksi privat</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-blue-400/30 flex items-center gap-2 text-xs text-blue-100">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Terproteksi sistem otentikasi resmi</span>
          </div>
        </div>

        {/* RIGHT COLUMN: PROFESSIONAL LOGIN FORM */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Selamat Datang
              </h3>
              <p className="text-sm text-slate-500 mt-1 font-normal">
                Silakan masuk dengan akun terdaftar Anda.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Masukkan username Anda..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Masukkan kata sandi..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-11 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm leading-relaxed font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-5 rounded-xl bg-[#0052cc] hover:bg-[#0747a6] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-sm mt-3"
              >
                <span>{loading ? "Memproses..." : "Masuk"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
