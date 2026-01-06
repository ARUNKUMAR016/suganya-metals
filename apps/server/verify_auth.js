const axios = require("axios");

const API_URL = "http://localhost:3000/api";

async function verifyAuth() {
  try {
    console.log("1. Attempting Login...");
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      username: "admin",
      password: "sugany123",
    });

    if (loginRes.data.success && loginRes.data.token) {
      console.log("✅ Login Successful! Token received.");
      const token = loginRes.data.token;

      console.log("2. Accessing Protected Route (/api/roles)...");
      const rolesRes = await axios.get(`${API_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (rolesRes.status === 200) {
        console.log("✅ Protected Route Accessed Successfully!");
      } else {
        console.error(
          "❌ Failed to access protected route. Status:",
          rolesRes.status
        );
      }
    } else {
      console.error("❌ Login Failed. No token received.");
    }
  } catch (error) {
    console.error(
      "❌ Verification Failed:",
      error.response?.data || error.message
    );
  }
}

verifyAuth();
