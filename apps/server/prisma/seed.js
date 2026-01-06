const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const roles = [
    { role_name: "Polisher", rate_per_kg: 14.0 },
    { role_name: "Spinner", rate_per_kg: 18.0 },
    { role_name: "Plasma Welder", rate_per_kg: 1.25 },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { role_name: role.role_name },
      update: {},
      create: role,
    });
  }

  const labours = [
    { name: "Raju", role_name: "Polisher" },
    { name: "Kumar", role_name: "Spinner" },
  ];

  for (const labour of labours) {
    const role = await prisma.role.findUnique({
      where: { role_name: labour.role_name },
    });
    if (role) {
      await prisma.labour.create({
        data: {
          name: labour.name,
          role_id: role.id,
        },
      });
    }
  }

  // Create default admin user
  const adminPassword = await require("bcryptjs").hash("sugany123", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
