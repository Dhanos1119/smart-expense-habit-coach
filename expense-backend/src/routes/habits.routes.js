import express from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/requireAuth.js";
import { predictHabit } from "../services/mlClient.js";

const router = express.Router();
const prisma = new PrismaClient();

/* ================= HELPERS ================= */
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/* =====================================================
   GET /api/habits
===================================================== */
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const today = startOfDay(new Date());

    const habits = await prisma.habit.findMany({
      where: { userId },
      include: {
        completions: { orderBy: { date: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = await Promise.all(
      habits.map(async (h) => {
        /* ---------- STREAK ---------- */
        let streak = 0;
        let expected = new Date(today);

        for (const c of h.completions) {
          const d = startOfDay(new Date(c.date));
          if (d.getTime() === expected.getTime()) {
            streak++;
            expected.setDate(expected.getDate() - 1);
          } else break;
        }

        const completedToday =
          h.completions.length > 0 &&
          startOfDay(new Date(h.completions[0].date)).getTime() ===
            today.getTime();

        /* ---------- ML ---------- */
        const features = {
          currentStreak: streak,
          longestStreak: streak,
          completionRate30: streak > 0 ? 50 : 0,
          missCountLast7: Math.max(0, 7 - streak),
          daysSinceLastDone: completedToday ? 0 : 2,
        };

        let ml = null;
        try {
          ml = await predictHabit(features);
        } catch {}

        return {
          id: h.id,
          title: h.title,
          icon: h.icon,
          color: h.color,
          streak,
          completedToday, // ✅ THIS IS THE KEY
          ml,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("GET /habits error:", err);
    res.status(500).json({ message: "Failed to load habits" });
  }
});

/* =====================================================
   POST /api/habits
===================================================== */
router.post("/", requireAuth, async (req, res) => {
  const { title } = req.body;
  const userId = req.userId;

  const colors = ["#22C55E", "#3B82F6", "#F97316", "#A855F7"];
  const icons = ["checkmark-circle", "flash", "heart", "sparkles"];

  const count = await prisma.habit.count({ where: { userId } });

  const habit = await prisma.habit.create({
    data: {
      userId,
      title,
      color: colors[count % colors.length],
      icon: icons[count % icons.length],
    },
  });

  res.json(habit);
});

/* =====================================================
   POST /api/habits/:id/complete
===================================================== */
router.post("/:id/complete", requireAuth, async (req, res) => {
  const today = startOfDay(new Date());

  await prisma.habitCompletion.upsert({
    where: {
      habitId_date: {
        habitId: Number(req.params.id),
        date: today,
      },
    },
    update: {},
    create: {
      habitId: Number(req.params.id),
      userId: req.userId,
      date: today,
    },
  });

  res.json({ success: true });
});

/* =====================================================
   DELETE /api/habits/:id/complete
===================================================== */
router.delete("/:id/complete", requireAuth, async (req, res) => {
  const today = startOfDay(new Date());

  await prisma.habitCompletion.deleteMany({
    where: {
      habitId: Number(req.params.id),
      userId: req.userId,
      date: today,
    },
  });

  res.json({ success: true });
});

/* =====================================================
   DELETE /api/habits/:id   🔥 (DELETE HABIT ITSELF)
===================================================== */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const habitId = Number(req.params.id);
    const userId = req.userId;

    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    await prisma.habit.delete({
      where: { id: habitId },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /habits/:id error", err);
    res.status(500).json({ message: "Failed to delete habit" });
  }
});


export default router;
