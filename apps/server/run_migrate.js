const { execSync } = require("child_process");
require("dotenv").config();

try {
  console.log("Running migration...");
  execSync("npx prisma migrate dev --name add_labour_advance", {
    stdio: "inherit",
  });
} catch (error) {
  console.error("Migration failed:", error.message);
  process.exit(1);
}
