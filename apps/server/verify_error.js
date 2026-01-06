const axios = require("axios");

async function verifyError() {
  try {
    console.log("Testing /api/test-error...");
    await axios.get("http://localhost:3000/api/test-error");
  } catch (error) {
    if (error.response) {
      console.log("✅ Received Error Response:", error.response.status);
      console.log("Response Body:", error.response.data);

      if (
        error.response.status === 500 &&
        error.response.data.success === false &&
        error.response.data.message === "This is a test error for verification"
      ) {
        console.log("✅ Error format is correct!");
      } else {
        console.error("❌ Unexpected error format.");
      }
    } else {
      console.error("❌ Failed to connect/receive response:", error.message);
    }
  }
}

verifyError();
