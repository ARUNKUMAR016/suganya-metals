const { PrismaClient } = require("@prisma/client");

async function testPassword(password) {
  const url = `postgresql://postgres:${password}@127.0.0.1:5432/sugany_metals?schema=public`;
  console.log(`Trying password: '${password}' ...`);

  const prisma = new PrismaClient({
    datasources: {
      db: { url },
    },
  });

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log(`\n✅ SUCCESS! The correct password is: '${password}'`);
    return true;
  } catch (e) {
    // console.log(e.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function findPassword() {
  const commonPasswords = [
    "postgres",
    "admin",
    "root",
    "password",
    "1234",
    "12345",
    "admin123",
    "sugany",
    "dbpass",
  ];

  console.log("🔍 Searching for correct database password...");

  for (const pass of commonPasswords) {
    if (await testPassword(pass)) {
      console.log("\nPlease update your server/.env file with this password!");
      process.exit(0);
    }
  }

  console.log(
    "\n❌ Failed to find password. Please reset your PostgreSQL password manually."
  );
  process.exit(1);
}

findPassword();
