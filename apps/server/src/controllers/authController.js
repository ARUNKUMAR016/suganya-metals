const login = async (req, res) => {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "sugany123";

  if (username === adminUsername && password === adminPassword) {
    res.json({
      success: true,
      message: "Login successful",
      user: { username: adminUsername, role: "admin" },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
};

module.exports = { login };
