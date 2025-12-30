const prisma = require("../db");

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get start of week (Monday)
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // 1. Today's Production
    const todayProduction = await prisma.productionDay.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        items: true,
        labour: true,
      },
    });

    const todayStats = todayProduction.reduce(
      (acc, prod) => {
        const totalKg = prod.items.reduce(
          (sum, item) => sum + parseFloat(item.quantity_kg),
          0
        );
        const totalAmount = prod.items.reduce(
          (sum, item) => sum + parseFloat(item.amount),
          0
        );
        return {
          labours: acc.labours + 1,
          totalKg: acc.totalKg + totalKg,
          totalAmount: acc.totalAmount + totalAmount,
        };
      },
      { labours: 0, totalKg: 0, totalAmount: 0 }
    );

    // 2. This Week's Summary
    const weekProduction = await prisma.productionDay.findMany({
      where: {
        date: {
          gte: startOfWeek,
        },
      },
      include: {
        items: true,
      },
    });

    const weekStats = weekProduction.reduce(
      (acc, prod) => {
        const totalKg = prod.items.reduce(
          (sum, item) => sum + parseFloat(item.quantity_kg),
          0
        );
        const totalAmount = prod.items.reduce(
          (sum, item) => sum + parseFloat(item.amount),
          0
        );
        return {
          days: new Set([...acc.days, prod.date.toISOString().split("T")[0]]),
          totalKg: acc.totalKg + totalKg,
          totalAmount: acc.totalAmount + totalAmount,
        };
      },
      { days: new Set(), totalKg: 0, totalAmount: 0 }
    );

    // 3. Active Resources
    const activeLabours = await prisma.labour.count({
      where: { active: true },
    });
    const activeRoles = await prisma.role.count({ where: { active: true } });
    const totalProducts = await prisma.product.count();

    // 4. Recent Payments
    const recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: { paid_on: "desc" },
      include: {
        labour: true,
      },
    });

    res.json({
      today: {
        labours: todayStats.labours,
        totalKg: todayStats.totalKg.toFixed(2),
        totalAmount: todayStats.totalAmount.toFixed(2),
      },
      week: {
        days: weekStats.days.size,
        totalKg: weekStats.totalKg.toFixed(2),
        totalAmount: weekStats.totalAmount.toFixed(2),
      },
      resources: {
        activeLabours,
        activeRoles,
        totalProducts,
      },
      recentPayments: recentPayments.map((p) => ({
        id: p.id,
        labourName: p.labour.name,
        amount: parseFloat(p.total_amount).toFixed(2),
        paidOn: p.paid_on,
        weekStart: p.week_start,
        weekEnd: p.week_end,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

module.exports = { getDashboardStats };
