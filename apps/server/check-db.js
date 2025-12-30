const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkConnection() {
  try {
    console.log("Attempting to connect to database...");
    console.log(
      `URL: ${process.env.DATABASE_URL || "Not loaded from environment!"}`
    );

    // Attempt to query
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ SUCCESS: Connected to the database!");
  } catch (e) {
    console.error("❌ ERROR: Connection failed.");
    console.error("Reason:", e.message);
    console.error("\nTIP: Check your password in server/.env file.");
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();
