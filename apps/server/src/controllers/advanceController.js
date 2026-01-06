const prisma = require("../db");

const createAdvance = async (req, res) => {
  try {
    const { labour_id, amount, date, notes } = req.body;

    if (!labour_id || !amount || !date) {
      return res
        .status(400)
        .json({ error: "Labour, amount, and date are required" });
    }

    const advance = await prisma.labourAdvance.create({
      data: {
        labour_id: parseInt(labour_id),
        amount: parseFloat(amount),
        date: new Date(date),
        notes,
      },
      include: {
        labour: true,
      },
    });

    res.status(201).json(advance);
  } catch (error) {
    console.error("Error creating advance:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to create advance" });
  }
};

const getAdvances = async (req, res) => {
  try {
    const { startOfWeek, endOfWeek, labourId } = req.query;

    const where = {};

    if (startOfWeek && endOfWeek) {
      where.date = {
        gte: new Date(startOfWeek),
        lte: new Date(endOfWeek),
      };
    }

    if (labourId) {
      where.labour_id = parseInt(labourId);
    }

    const advances = await prisma.labourAdvance.findMany({
      where,
      include: {
        labour: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.json(advances);
  } catch (error) {
    console.error("Error fetching advances:", error);
    res.status(500).json({ error: "Failed to fetch advances" });
  }
};

const deleteAdvance = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.labourAdvance.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Advance deleted successfully" });
  } catch (error) {
    console.error("Error deleting advance:", error);
    res.status(500).json({ error: "Failed to delete advance" });
  }
};

module.exports = {
  createAdvance,
  getAdvances,
  deleteAdvance,
};
