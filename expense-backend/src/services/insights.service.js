import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getSpendingInsights(userId) {
  const now = new Date();

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  /* ================= USER BUDGET ================= */
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { monthlyBudget: true },
  });

  if (!user?.monthlyBudget || user.monthlyBudget <= 0) {
    return null;
  }

  /* ================= EXPENSES ================= */
  const thisMonthExpenses = await prisma.expense.findMany({
    where: {
      userId,
      createdAt: { gte: startOfThisMonth },
    },
  });

  const lastMonthExpenses = await prisma.expense.findMany({
    where: {
      userId,
      createdAt: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
  });

  const sum = (arr) => arr.reduce((s, e) => s + e.amount, 0);

  const thisMonthTotal = sum(thisMonthExpenses);
  const lastMonthTotal = sum(lastMonthExpenses);

  /* ================= PERCENTAGE ================= */
  const rawPercent = (thisMonthTotal / user.monthlyBudget) * 100;

  // ❗ Clamp to avoid 202% ugly UI
  const budgetUsedPercent = Math.min(Math.round(rawPercent), 999);

  /* ================= FOOD ANALYSIS ================= */
  const foodThisMonth = sum(
    thisMonthExpenses.filter((e) => e.category === "Food")
  );

  const foodLastMonth = sum(
    lastMonthExpenses.filter((e) => e.category === "Food")
  );

  const foodIncreasePercent =
    foodLastMonth > 0
      ? Math.round(((foodThisMonth - foodLastMonth) / foodLastMonth) * 100)
      : 0;

  /* ================= ALERT LOGIC ================= */
  let level = "SAFE"; // SAFE | WARNING | DANGER
  let message = null;
  let showBanner = false;
  let triggerNotification = false;

  if (budgetUsedPercent >= 90) {
    level = "DANGER";
    showBanner = true;
    triggerNotification = true;
    message = `You've used ${budgetUsedPercent}% of your monthly budget. Spend carefully.`;
  } else if (budgetUsedPercent >= 60) {
    level = "WARNING";
    showBanner = true;
    message = `You've already used ${budgetUsedPercent}% of your monthly budget. Keep an eye on spending.`;
  }

  // Food insight (secondary message – optional)
  if (foodIncreasePercent > 20) {
    message =
      message ??
      `Food expenses increased by ${foodIncreasePercent}% compared to last month.`;
  }

  /* ================= RETURN ================= */
  return {
    budgetUsedPercent,
    currentSpent: thisMonthTotal,
    monthlyBudget: user.monthlyBudget,
    foodIncreasePercent,

    // UI / logic helpers
    level, // SAFE | WARNING | DANGER
    showBanner,
    triggerNotification,
    message,
  };
}
