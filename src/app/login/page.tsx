"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, User, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";

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

  const handleQuickSelect = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError(null);
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
          {/* QUICK FILL CHIPS */}
          <div className="mb-5">
            <span className="block text-[11px] font-medium text-zinc-400 mb-2">
              Pilih Cepat Akun:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickSelect("monn", "monn123")}
                className={`py-2 px-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center gap-2 ${
                  username.toLowerCase() === "monn"
                    ? "bg-[#18181b] border-emerald-500/50 text-white"
                    : "bg-[#09090b]/60 border-[#27272a] hover:border-zinc-700 text-zinc-400"
                }`}
              >
                <div className="w-6 h-6 rounded-md bg-emerald-500 text-black font-bold flex items-center justify-center text-[11px] shrink-0">
                  M
                </div>
                <div className="truncate">
                  <p className="font-semibold text-white truncate">Monn</p>
                  <p className="text-[10px] text-zinc-400">Pemilik Utama</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect("pasangan", "partner123")}
                className={`py-2 px-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center gap-2 ${
                  username.toLowerCase() === "pasangan" || username.toLowerCase() === "partner"
                    ? "bg-[#18181b] border-rose-500/50 text-white"
                    : "bg-[#09090b]/60 border-[#27272a] hover:border-zinc-700 text-zinc-400"
                }`}
              >
                <div className="w-6 h-6 rounded-md bg-rose-500 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                  P
                </div>
                <div className="truncate">
                  <p className="font-semibold text-white truncate">Pasangan</p>
                  <p className="text-[10px] text-zinc-400">Partner</p>
                </div>
              </button>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* USERNAME FIELD */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Username:
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  required
                  placeholder="Ketik 'monn' atau 'pasangan'..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors font-sans"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Kata Sandi:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs leading-relaxed animate-in fade-in duration-150">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-md mt-2"
            >
              <span>{loading ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* FOOTNOTE */}
          <div className="mt-6 pt-4 border-t border-[#27272a] flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terkunci privat untuk Monn & Pasangan</span>
          </div>
        </div>

        {/* DEFAULT PASSWORD HINT */}
        <div className="mt-4 p-3 rounded-xl bg-[#121215]/50 border border-[#27272a]/60 text-center text-[11px] text-zinc-400">
          <p>
            Kata sandi default: Monn (<code className="text-emerald-400 font-mono">monn123</code>) • Pasangan (
            <code className="text-rose-400 font-mono">partner123</code>)
          </p>
        </div>
      </div>
    </div>
  );
}
