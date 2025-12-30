const prisma = require("../db");

const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { id: "asc" },
    });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};

const createRole = async (req, res) => {
  try {
    const { role_name, rate_per_kg } = req.body;
    const role = await prisma.role.create({
      data: {
        role_name,
        rate_per_kg,
        active: true,
      },
    });
    res.status(201).json(role);
  } catch (error) {
    if (error.code === "P2002") {
      // Unique constraint violation
      return res.status(400).json({ error: "Role name already exists" });
    }
    res.status(500).json({ error: "Failed to create role" });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name, rate_per_kg, active } = req.body;
    const role = await prisma.role.update({
      where: { id: parseInt(id) },
      data: {
        role_name,
        rate_per_kg,
        active,
      },
    });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: "Failed to update role" });
  }
};

module.exports = { getRoles, createRole, updateRole };
