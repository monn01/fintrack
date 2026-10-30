import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("fintrack_session")?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = await verifyToken(token);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const formatDisplayName = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return "User";
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  };

  const monnEnvUser = process.env.AUTH_MONN_USERNAME || "jaee";
  const partnerEnvUser = process.env.AUTH_PARTNER_USERNAME || "ryuu";

  let displayName = session.name;
  if (!displayName || displayName.toLowerCase() === "monn") {
    displayName = process.env.AUTH_MONN_NAME || formatDisplayName(monnEnvUser);
  } else if (session.user === "partner" && displayName.toLowerCase() === "pasangan") {
    displayName = process.env.AUTH_PARTNER_NAME || formatDisplayName(partnerEnvUser);
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      ...session,
      name: displayName,
    },
  });
}
