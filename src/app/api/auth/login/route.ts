import { NextRequest, NextResponse } from "next/server";
import { signToken, AuthSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const monnPassword = process.env.AUTH_MONN_PASSWORD || "monn123";
    const partnerPassword = process.env.AUTH_PARTNER_PASSWORD || "partner123";

    let session: AuthSession | null = null;

    if (username.toLowerCase() === "monn" && password === monnPassword) {
      session = {
        user: "monn",
        name: "Monn",
        role: "OWNER",
        createdAt: Date.now(),
      };
    } else if (
      (username.toLowerCase() === "pasangan" || username.toLowerCase() === "partner") &&
      password === partnerPassword
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
        { error: "Username atau kata sandi tidak valid." },
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
