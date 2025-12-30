const prisma = require("../db");

const getLabours = async (req, res) => {
  try {
    const labours = await prisma.labour.findMany({
      include: {
        role: true,
      },
      orderBy: { name: "asc" },
    });
    res.json(labours);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch labours" });
  }
};

const createLabour = async (req, res) => {
  try {
    const { name, role_id } = req.body;
    const labour = await prisma.labour.create({
      data: {
        name,
        role_id: parseInt(role_id),
        active: true,
      },
      include: {
        role: true,
      },
    });
    res.status(201).json(labour);
  } catch (error) {
    res.status(500).json({ error: "Failed to create labour" });
  }
};

const updateLabour = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role_id, active } = req.body;
    const labour = await prisma.labour.update({
      where: { id: parseInt(id) },
      data: {
        name,
        role_id: parseInt(role_id),
        active,
      },
      include: { role: true },
    });
    res.json(labour);
  } catch (error) {
    res.status(500).json({ error: "Failed to update labour" });
  }
};

module.exports = { getLabours, createLabour, updateLabour };
