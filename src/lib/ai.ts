import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export interface ParsedTransaction {
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  categoryName: string;
  walletName: string;
  description: string;
  date?: string;
}

export async function parseTransactionWithAI(prompt: string): Promise<ParsedTransaction> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const { text } = await generateText({
        model: google("gemini-1.5-flash"),
        system: `Anda adalah parser transaksi keuangan cerdas berbahasa Indonesia.
Tugas Anda adalah membaca kalimat bebas dari pengguna tentang pengeluaran/pemasukan/transfer uang, lalu mengekstraknya menjadi objek JSON murni tanpa markdown formatting atau backticks:
{
  "type": "EXPENSE" | "INCOME" | "TRANSFER",
  "amount": number (dalam Rupiah angka bulat, misal 25000),
  "categoryName": string (misal: "Makan & Minum", "Transportasi", "Gaji", "Belanja", "Tagihan", "Hiburan", dll.),
  "walletName": string (misal: "GoPay", "BCA", "Tunai", "OVO", "Mandiri", dll. Default ke "Tunai" jika tidak disebut),
  "description": string (keterangan singkat transaksi)
}`,
        prompt: prompt,
      });

      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.warn("AI parsing fallback activated due to API error:", error);
    }
  }

  // Smart Regex/Rule-based Fallback bila API Key belum diatur
  const lower = prompt.toLowerCase();
  let type: "INCOME" | "EXPENSE" | "TRANSFER" = "EXPENSE";
  if (lower.includes("gaji") || lower.includes("dapat") || lower.includes("terima") || lower.includes("masuk") || lower.includes("bonus")) {
    type = "INCOME";
  } else if (lower.includes("transfer") || lower.includes("pindah") || lower.includes("kirim")) {
    type = "TRANSFER";
  }

  // Extract amount (e.g. 25rb, 25k, 25000, 2.5jt, dll.)
  let amount = 0;
  const jtMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:jt|juta)/);
  const rbMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:rb|ribu|k)/);
  const rawNumberMatch = lower.match(/(\d[\d.,]*)/);

  if (jtMatch) {
    amount = parseFloat(jtMatch[1].replace(",", ".")) * 1_000_000;
  } else if (rbMatch) {
    amount = parseFloat(rbMatch[1].replace(",", ".")) * 1_000;
  } else if (rawNumberMatch) {
    const cleanedNum = rawNumberMatch[1].replace(/\./g, "").replace(",", ".");
    amount = parseFloat(cleanedNum);
  }

  // Detect Wallet
  let walletName = "Tunai";
  if (lower.includes("gopay") || lower.includes("go-pay")) walletName = "GoPay";
  else if (lower.includes("bca")) walletName = "BCA";
  else if (lower.includes("mandiri")) walletName = "Mandiri";
  else if (lower.includes("ovo")) walletName = "OVO";
  else if (lower.includes("jago")) walletName = "Bank Jago";
  else if (lower.includes("shopee") || lower.includes("spay")) walletName = "ShopeePay";

  // Detect Category
  let categoryName = "Lain-lain";
  if (lower.includes("makan") || lower.includes("kopi") || lower.includes("soto") || lower.includes("bakso") || lower.includes("resto") || lower.includes("cafe")) {
    categoryName = "Makan & Minum";
  } else if (lower.includes("bensin") || lower.includes("gojek") || lower.includes("grab") || lower.includes("toll") || lower.includes("parkir")) {
    categoryName = "Transportasi";
  } else if (lower.includes("listrik") || lower.includes("wifi") || lower.includes("pulsa") || lower.includes("tagihan") || lower.includes("kos")) {
    categoryName = "Tagihan & Utilitas";
  } else if (lower.includes("belanja") || lower.includes("baju") || lower.includes("supermarket") || lower.includes("minimarket")) {
    categoryName = "Belanja";
  } else if (type === "INCOME") {
    categoryName = "Gaji / Penghasilan";
  }

  return {
    type,
    amount: isNaN(amount) ? 0 : amount,
    categoryName,
    walletName,
    description: prompt.trim(),
  };
}
