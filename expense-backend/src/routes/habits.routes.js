import express from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();
const prisma = new PrismaClient();

/* ================= HELPERS ================= */
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/* =====================================================
   GET /habits
   → habits + streak + completedToday
===================================================== */
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const today = startOfDay(new Date());

    const habits = await prisma.habit.findMany({
      where: { userId },
      include: {
        completions: {
          orderBy: { date: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = habits.map((h) => {
      let streak = 0;
      let expected = startOfDay(new Date(today));

      for (const c of h.completions) {
        const d = startOfDay(new Date(c.date));

        if (d.getTime() === expected.getTime()) {
          streak++;
          expected.setDate(expected.getDate() - 1);
        } else {
          break;
        }
      }

      const completedToday =
        h.completions.length > 0 &&
        startOfDay(new Date(h.completions[0].date)).getTime() ===
          today.getTime();

      return {
        id: h.id,
        title: h.title,
        icon: h.icon,
        color: h.color,
        streak,
        lastCompletedDate: completedToday
          ? today.toISOString().slice(0, 10)
          : null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("GET /habits error:", err);
    res.status(500).json({ message: "Failed to load habits" });
  }
});

/* =====================================================
   POST /habits
   → create habit
===================================================== */
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title required" });
    }

    const colors = ["#22C55E", "#3B82F6", "#F97316", "#A855F7"];
    const icons = ["checkmark-circle", "flash", "heart", "sparkles"];

    const count = await prisma.habit.count({ where: { userId } });

    const habit = await prisma.habit.create({
      data: {
        userId,
        title: title.trim(),
        color: colors[count % colors.length],
        icon: icons[count % icons.length],
      },
    });

    res.status(201).json(habit);
  } catch (err) {
    console.error("POST /habits error:", err);
    res.status(500).json({ message: "Failed to create habit" });
  }
});

/* =====================================================
   POST /habits/:id/complete
   → mark habit completed today
===================================================== */
router.post("/:id/complete", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const habitId = Number(req.params.id);
    const today = startOfDay(new Date());

    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    await prisma.habitCompletion.upsert({
      where: {
        habitId_date: {
          habitId,
          date: today,
        },
      },
      update: {},
      create: {
        habitId,
        userId,
        date: today,
      },
    });

    res.json({ message: "Habit completed" });
  } catch (err) {
    console.error("POST /habits/:id/complete error:", err);
    res.status(500).json({ message: "Failed to complete habit" });
  }
});

/* =====================================================
   DELETE /habits/:id/complete
   → UNDO today completion
===================================================== */
router.delete("/:id/complete", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const habitId = Number(req.params.id);
    const today = startOfDay(new Date());

    await prisma.habitCompletion.deleteMany({
      where: {
        habitId,
        userId,
        date: today,
      },
    });

    res.json({ message: "Habit uncompleted" });
  } catch (err) {
    console.error("DELETE /habits/:id/complete error:", err);
    res.status(500).json({ message: "Failed to undo habit" });
  }
});

/* =====================================================
   PUT /habits/:id
   → rename habit
===================================================== */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const habitId = Number(req.params.id);
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title required" });
    }

    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const updated = await prisma.habit.update({
      where: { id: habitId },
      data: { title: title.trim() },
    });

    res.json(updated);
  } catch (err) {
    console.error("PUT /habits error:", err);
    res.status(500).json({ message: "Failed to update habit" });
  }
});

/* =====================================================
   DELETE /habits/:id
   → delete habit
===================================================== */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const habitId = Number(req.params.id);

    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    await prisma.habit.delete({
      where: { id: habitId },
    });

    res.json({ message: "Habit deleted" });
  } catch (err) {
    console.error("DELETE /habits error:", err);
    res.status(500).json({ message: "Failed to delete habit" });
  }
});

/* =====================================================
   GET /habits/stats
   → weekly & monthly consistency
===================================================== */
router.get("/stats", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const today = startOfDay(new Date());

    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);

    const monthAgo = new Date(today);
    monthAgo.setDate(today.getDate() - 29);

    const weekly = await prisma.habitCompletion.count({
      where: {
        userId,
        date: { gte: weekAgo },
      },
    });

    const monthly = await prisma.habitCompletion.count({
      where: {
        userId,
        date: { gte: monthAgo },
      },
    });

    res.json({
      weeklyCompletions: weekly,
      monthlyCompletions: monthly,
    });
  } catch (err) {
    console.error("GET /habits/stats error:", err);
    res.status(500).json({ message: "Failed to load stats" });
  }
});

export default router;
