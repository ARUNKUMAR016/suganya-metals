const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Testing Role connection...");
    const roles = await prisma.role.findMany();
    console.log("Roles found:", roles.length);
    console.log("Connection successful!");
  } catch (e) {
    console.error("Connection failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
