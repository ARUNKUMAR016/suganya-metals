const prisma = require("../db");

const getPayments = async (req, res) => {
  const { labourId } = req.query;
  const where = {};
  if (labourId) {
    where.labour_id = parseInt(labourId);
  }

  try {
    const payments = await prisma.payment.findMany({
      where,
      include: { labour: true },
      orderBy: { paid_on: "desc" },
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

const createPayment = async (req, res) => {
  const { labour_id, week_start, week_end, total_amount, remarks } = req.body;

  try {
    const payment = await prisma.payment.create({
      data: {
        labour_id: parseInt(labour_id),
        week_start: new Date(week_start),
        week_end: new Date(week_end),
        total_amount: parseFloat(total_amount),
        remarks,
        paid_on: new Date(),
      },
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: "Failed to record payment" });
  }
};

module.exports = { getPayments, createPayment };
