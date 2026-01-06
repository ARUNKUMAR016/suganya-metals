require("dotenv").config();
const url = process.env.DATABASE_URL || "";
console.log("URL Length:", url.length);
console.log("First 15 chars:", url.substring(0, 15));
console.log("Contains quote?", url.includes('"'));
console.log("Contains space?", url.includes(" "));
