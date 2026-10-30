import { NextRequest, NextResponse } from "next/server";
import { signToken, AuthSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    const monnUser = (process.env.AUTH_MONN_USERNAME || "monn").trim().toLowerCase();
    const monnPassword = (process.env.AUTH_MONN_PASSWORD || "monn123").trim();

    const partnerUser = (process.env.AUTH_PARTNER_USERNAME || "pasangan").trim().toLowerCase();
    const partnerPassword = (process.env.AUTH_PARTNER_PASSWORD || "partner123").trim();

    let session: AuthSession | null = null;

    if (
      (cleanUser === monnUser || cleanUser === "monn" || cleanUser === "admin") &&
      cleanPass === monnPassword
    ) {
      session = {
        user: "monn",
        name: "Monn",
        role: "OWNER",
        createdAt: Date.now(),
      };
    } else if (
      (cleanUser === partnerUser || cleanUser === "pasangan" || cleanUser === "partner") &&
      cleanPass === partnerPassword
    ) {
      session = {
        user: "partner",
        name: "Pasangan",
        role: "PARTNER",
        createdAt: Date.now(),
      };
    }

    if (!session) {
      return NextResponse.json(
        { error: "Username atau kata sandi tidak cocok. Silakan periksa kembali." },
        { status: 401 }
      );
    }

    const token = await signToken(session);

    const response = NextResponse.json({
      success: true,
      user: session,
    });

    response.cookies.set("fintrack_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
