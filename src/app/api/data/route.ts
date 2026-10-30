import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// Ensure default household & user exists
async function getOrCreateUser(sessionUser: string) {
  const email = sessionUser === "partner" ? "partner@fintrack.app" : "monn@fintrack.app";
  const name = sessionUser === "partner" ? "Pasangan" : "Monn";
  const role = sessionUser === "partner" ? ("PARTNER" as const) : ("OWNER" as const);

  // Check or create primary household
  let household = await prisma.household.findFirst();
  if (!household) {
    household = await prisma.household.create({
      data: {
        name: "Rumah Tangga Monn & Pasangan",
        inviteCode: "FINTRACK",
      },
    });
  }

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        householdId: household.id,
      },
    });
  }

  return { user, household };
}

// GET: Load all data from Supabase
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("fintrack_session")?.value;
    const session = token ? await verifyToken(token) : null;
    const sessionUser = session?.user || "monn";

    const { user, household } = await getOrCreateUser(sessionUser);

    // Get wallets (personal + shared)
    const wallets = await prisma.wallet.findMany({
      where: {
        OR: [
          { userId: user.id },
          { householdId: household.id, isShared: true },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    // Get savings goals (personal + shared)
    const goals = await prisma.savingsGoal.findMany({
      where: {
        OR: [
          { userId: user.id },
          { householdId: household.id, isShared: true },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { userId: user.id },
          { wallet: { isShared: true } },
        ],
      },
      include: {
        wallet: true,
        destinationWallet: true,
        category: true,
      },
      orderBy: { date: "desc" },
      take: 200,
    });

    return NextResponse.json({
      success: true,
      wallets: wallets.map((w: any) => ({
        id: w.id,
        name: w.name,
        type: w.type,
        balance: Number(w.balance),
        isShared: w.isShared,
        accountNumber: w.accountNumber || undefined,
      })),
      goals: goals.map((g: any) => ({
        id: g.id,
        title: g.title,
        targetAmount: Number(g.targetAmount),
        currentAmount: Number(g.currentAmount),
        targetDate: g.targetDate ? new Date(g.targetDate).toISOString().split("T")[0] : undefined,
        isShared: g.isShared,
      })),
      transactions: transactions.map((t: any) => ({
        id: t.id,
        type: t.type,
        amount: Number(t.amount),
        category: t.category?.name || "Lain-lain",
        wallet: t.wallet?.name || "Dompet",
        destinationWallet: t.destinationWallet?.name,
        date: t.date ? new Date(t.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        description: t.description || "",
        tags: t.tags || [],
      })),
    });
  } catch (error: any) {
    console.error("Fetch data error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Save new record to Supabase
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("fintrack_session")?.value;
    const session = token ? await verifyToken(token) : null;
    const sessionUser = session?.user || "monn";

    const { user, household } = await getOrCreateUser(sessionUser);
    const body = await req.json();
    const { action, payload } = body;

    if (action === "ADD_WALLET") {
      const created = await prisma.wallet.create({
        data: {
          name: payload.name,
          type: payload.type || "BANK",
          balance: payload.balance || 0,
          isShared: payload.isShared || false,
          accountNumber: payload.accountNumber,
          userId: user.id,
          householdId: household.id,
        },
      });
      return NextResponse.json({ success: true, item: created });
    }

    if (action === "ADD_GOAL") {
      const created = await prisma.savingsGoal.create({
        data: {
          title: payload.title,
          targetAmount: payload.targetAmount,
          currentAmount: payload.currentAmount || 0,
          targetDate: payload.targetDate ? new Date(payload.targetDate) : null,
          isShared: payload.isShared || false,
          userId: user.id,
          householdId: household.id,
        },
      });
      return NextResponse.json({ success: true, item: created });
    }

    if (action === "ADD_TRANSACTION") {
      // Find source wallet by name or id
      let wallet = await prisma.wallet.findFirst({
        where: {
          OR: [{ id: payload.walletId }, { name: payload.wallet }],
        },
      });

      if (!wallet) {
        // Create wallet if not found
        wallet = await prisma.wallet.create({
          data: {
            name: payload.wallet || "Dompet Utama",
            type: "BANK",
            balance: 0,
            userId: user.id,
            householdId: household.id,
          },
        });
      }

      // Update wallet balance
      if (payload.type === "INCOME") {
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: payload.amount } },
        });
      } else if (payload.type === "EXPENSE") {
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: { decrement: payload.amount } },
        });
      } else if (payload.type === "TRANSFER" && payload.destinationWallet) {
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: { decrement: payload.amount } },
        });

        const destWallet = await prisma.wallet.findFirst({
          where: { name: payload.destinationWallet },
        });
        if (destWallet) {
          await prisma.wallet.update({
            where: { id: destWallet.id },
            data: { balance: { increment: payload.amount } },
          });
        }
      }

      // Find or create category
      let category = null;
      if (payload.category) {
        category = await prisma.category.findFirst({
          where: { name: payload.category },
        });
        if (!category) {
          category = await prisma.category.create({
            data: {
              name: payload.category,
              type: payload.type === "INCOME" ? "INCOME" : "EXPENSE",
            },
          });
        }
      }

      const createdTx = await prisma.transaction.create({
        data: {
          type: payload.type || "EXPENSE",
          amount: payload.amount,
          date: payload.date ? new Date(payload.date) : new Date(),
          description: payload.description,
          tags: payload.tags || [],
          walletId: wallet.id,
          categoryId: category?.id,
          userId: user.id,
        },
      });

      return NextResponse.json({ success: true, item: createdTx });
    }

    if (action === "DEPOSIT_GOAL") {
      const { goalId, walletId, amount } = payload;
      // Deduct from wallet
      await prisma.wallet.update({
        where: { id: walletId },
        data: { balance: { decrement: amount } },
      });
      // Add to goal
      await prisma.savingsGoal.update({
        where: { id: goalId },
        data: { currentAmount: { increment: amount } },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Save data error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
