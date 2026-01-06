const prisma = require("../db");

const getWeeklySalary = async (req, res) => {
  const { startOfWeek, endOfWeek, labourId } = req.query;

  if (!startOfWeek || !endOfWeek) {
    return res.status(400).json({ error: "Start and End date required" });
  }

  const where = {
    date: {
      gte: new Date(startOfWeek),
      lte: new Date(endOfWeek),
    },
  };

  if (labourId) {
    where.labour_id = parseInt(labourId);
  }

  try {
    // We need to fetch production days and their items to sum them up.
    // Prisma aggregation is good, but since Amount is on Item level and Grouping is on Labour level,
    // we might do a findMany and Aggregate in Code or use Raw Query for performance if needed.
    // Given 50 labours, logic in code is fine.

    // 1. Fetch Production Data
    const productionDays = await prisma.productionDay.findMany({
      where,
      include: {
        labour: true,
        items: true,
      },
    });

    // 2. Check for Payments and Advances made in this week

    const advances = await prisma.labourAdvance.findMany({
      where: {
        date: {
          gte: new Date(startOfWeek),
          lte: new Date(endOfWeek),
        },
        ...(labourId ? { labour_id: parseInt(labourId) } : {}),
      },
    });

    // 3. Aggregate
    const salaryMap = {};

    productionDays.forEach((day) => {
      const lid = day.labour_id;
      if (!salaryMap[lid]) {
        salaryMap[lid] = {
          labour_id: lid,
          labour_name: day.labour.name,
          total_kg: 0,
          total_amount: 0,
          total_advance: 0,
          net_payable: 0,
          days_worked: 0,
        };
      }

      let dayAmount = 0;
      day.items.forEach((item) => {
        salaryMap[lid].total_kg += parseFloat(item.quantity_kg);
        dayAmount += parseFloat(item.amount);
      });

      salaryMap[lid].total_amount += dayAmount;
      salaryMap[lid].days_worked += 1;
    });

    // 4. Calculate Net Payable with Advances
    Object.values(salaryMap).forEach((s) => {
      const labourAdvances = advances.filter(
        (a) => a.labour_id === s.labour_id
      );
      const advanceSum = labourAdvances.reduce(
        (sum, a) => sum + parseFloat(a.amount),
        0
      );
      s.total_advance = advanceSum;
      s.net_payable = s.total_amount - s.total_advance;
    });

    // 5. Transform to Array and Attach Payment Status
    const salaryReport = Object.values(salaryMap).map((s) => {
      return s;
    });

    res.json(salaryReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to calculate salary" });
  }
};

module.exports = { getWeeklySalary };
