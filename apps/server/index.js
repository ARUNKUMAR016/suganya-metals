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
const paymentRoutes = require("./src/routes/paymentRoutes");
const authRoutes = require("./src/routes/authRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/labours", labourRoutes);
app.use("/api/products", productRoutes);
app.use("/api/production", productionRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/advances", require("./src/routes/advanceRoutes"));

app.use("/api/payments", paymentRoutes);

// Serve static files from the client app
app.use(express.static(path.join(__dirname, "../client/dist")));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Trigger restart
