const prisma = require("../db");

// Get Production History (filtered by date range)
const getProduction = async (req, res) => {
  const { startDate, endDate, labourId } = req.query;
  const where = {};

  if (startDate && endDate) {
    where.date = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  if (labourId) {
    where.labour_id = parseInt(labourId);
  }

  try {
    const production = await prisma.productionDay.findMany({
      where,
      include: {
        labour: true,
        role: true,
        items: {
          include: { product: true },
        },
      },
      orderBy: { date: "desc" },
    });
    res.json(production);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch production history" });
  }
};

// Create Daily Entry
const createProductionEntry = async (req, res) => {
  const { date, labour_id, items } = req.body; // items: [{ product_id, pcs, quantity_kg }]

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "No items provided" });
  }

  try {
    // 1. Fetch Labour and their current Role Rate
    const labour = await prisma.labour.findUnique({
      where: { id: parseInt(labour_id) },
      include: { role: true },
    });

    if (!labour || !labour.active) {
      return res.status(400).json({ error: "Invalid or inactive labour" });
    }

    const currentRate = labour.role.rate_per_kg;

    // 2. Create Production Day Header (Snapshot Rate)
    // We used upsert to handle if an entry already exists for this day/labour,
    // BUT the requirements sort of imply "Daily Production Entry", usually meaning one sheet per day.
    // If the user wants to ADD to an existing day, we should probably find it first.
    // Let's assume one "ProductionDay" entry per labour per day is unique.

    // Check if entry exists for this day
    const entryDate = new Date(date);

    let productionDay = await prisma.productionDay.findFirst({
      where: {
        date: entryDate,
        labour_id: parseInt(labour_id),
      },
    });

    // Transaction to ensure data integrity
    await prisma.$transaction(async (tx) => {
      if (!productionDay) {
        productionDay = await tx.productionDay.create({
          data: {
            date: entryDate,
            labour_id: parseInt(labour_id),
            role_id: labour.role_id,
            rate_per_kg: currentRate, // LATCH RATE HERE
          },
        });
      } else {
        // Existing day: We do NOT update the rate. The rate is locked to the day created.
        // Unless the business logic specifically asks to update rate for "today" entries if role changes?
        // "Rate must be copied at entry time and never recalculated for past data"
        // So we stick to the rate on the existing header.
      }

      // 3. Create Line Items
      for (const item of items) {
        const amount =
          parseFloat(item.quantity_kg) * parseFloat(productionDay.rate_per_kg);

        await tx.productionItem.create({
          data: {
            production_day_id: productionDay.id,
            product_id: parseInt(item.product_id),
            pcs: parseInt(item.pcs || 0),
            quantity_kg: parseFloat(item.quantity_kg),
            amount: amount,
          },
        });
      }
    });

    res.status(201).json({ message: "Production entry saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create production entry" });
  }
};

module.exports = { getProduction, createProductionEntry };
