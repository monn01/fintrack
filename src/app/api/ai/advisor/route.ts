import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: NextRequest) {
  try {
    const { summary } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const { text } = await generateText({
          model: google("gemini-1.5-flash"),
          system: `Anda adalah penasihat keuangan pribadi (Financial Advisor) profesional, empatik, objektif, dan realistis.
Berikan analisis ringkas maksimal 3-4 poin actionable berdasarkan data keuangan pengguna:
1. Skor Kesehatan Keuangan (Skala 1-100) & Status (Sehat / Perlu Waspada / Kritis).
2. Deteksi Kebocoran / Anomali Pengeluaran terbesar.
3. Rekomendasi Tabungan & Budgeting Praktis (termasuk strategi aturan 50/30/20).
4. Dampak ke Target Tabungan.
Gunakan gaya bahasa profesional, ramah, to-the-point, tanpa basa-basi klise.`,
          prompt: `Berikut ringkasan keuangan saat ini:
- Total Saldo Semua Akun: Rp ${summary.totalBalance.toLocaleString("id-ID")}
- Pemasukan Bulan Ini: Rp ${summary.income.toLocaleString("id-ID")}
- Pengeluaran Bulan Ini: Rp ${summary.expense.toLocaleString("id-ID")}
- Pengeluaran Terbesar: ${summary.topCategory || "Makan & Minum"}
- Target Tabungan Aktif: ${summary.activeGoalTitle || "Dana Darurat"} (Terkumpul Rp ${summary.goalCurrent?.toLocaleString("id-ID")} dari target Rp ${summary.goalTarget?.toLocaleString("id-ID")})`,
        });

        return NextResponse.json({ success: true, advice: text });
      } catch (err) {
        console.warn("AI generation failed, using intelligent rule generator:", err);
      }
    }

    // Default intelligent rule-based generator
    const savingsRatio = summary.income > 0 ? Math.round(((summary.income - summary.expense) / summary.income) * 100) : 0;
    const score = Math.max(30, Math.min(95, 50 + savingsRatio));
    
    let statusText = "Stabil";
    if (savingsRatio >= 30) statusText = "Sangat Sehat";
    else if (savingsRatio < 10) statusText = "Perlu Penghematan Segera";

    const advice = `### Evaluasi Kesehatan Keuangan: Skor ${score}/100 (${statusText})

* **Rasio Arus Kas:** Rasio tabungan Anda bulan ini sebesar **${savingsRatio}%** dari total pemasukan. ${savingsRatio >= 20 ? "Kondisi arus kas Anda berada pada batas ideal (di atas 20%)." : "Sebaiknya tekan pengeluaran diskresioner untuk mencapai minimal 20% alokasi tabungan."}
* **Sorotan Pengeluaran:** Kategori **${summary.topCategory || "Makan & Minum"}** menyerap porsi terbesar pengeluaran Anda. Pertimbangkan alokasi mingguan ketat untuk pos ini.
* **Proyeksi Target Tabungan:** Dengan sisa arus kas saat ini, target **${summary.activeGoalTitle || "Target Tabungan"}** dapat diakselerasi dengan menyisihkan minimal 15% dari sisa saldo di awal gajian.`;

    return NextResponse.json({ success: true, advice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Advisor error" }, { status: 500 });
  }
}
