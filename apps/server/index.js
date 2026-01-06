const express = require("express");
const path = require("path");

const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const roleRoutes = require("./src/routes/roleRoutes");
const labourRoutes = require("./src/routes/labourRoutes");
const productRoutes = require("./src/routes/productRoutes");
const productionRoutes = require("./src/routes/productionRoutes");
const salaryRoutes = require("./src/routes/salaryRoutes");

const authRoutes = require("./src/routes/authRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

const { protect } = require("./src/middleware/authMiddleware");

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);
app.use("/api/roles", protect, roleRoutes);
app.use("/api/labours", protect, labourRoutes);
app.use("/api/products", protect, productRoutes);
app.use("/api/production", protect, productionRoutes);
app.use("/api/salary", protect, salaryRoutes);

app.use("/api/advances", protect, require("./src/routes/advanceRoutes"));

// Serve static files from the client app
app.use(express.static(path.join(__dirname, "../client/dist")));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Global Error Handler
const { errorMiddleware } = require("./src/middleware/errorMiddleware");
app.use(errorMiddleware);

// Validate essential environment variables
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(
    "❌ FATAL ERROR: Missing required environment variables:\n" +
      missingEnvVars.map((key) => `   - ${key}`).join("\n") +
      "\n\nPlease create a .env file based on .env.example"
  );
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Trigger restart
