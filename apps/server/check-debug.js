require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

console.log(
  "DATABASE_URL length:",
  process.env.DATABASE_URL ? process.env.DATABASE_URL.length : "MISSING"
);
console.log(
  "DATABASE_URL starts with:",
  process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 10) : "N/A"
);

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main() {
  try {
    console.log("Connecting...");
    await prisma.$connect();
    console.log("Connected!");
    const roles = await prisma.role.findMany();
    console.log("Roles:", roles.length);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
