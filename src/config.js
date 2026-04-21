require("dotenv").config();

const config = {
  BOT_TOKEN: process.env.BOT_TOKEN || "",
  BOT_USERNAME: process.env.BOT_USERNAME || "",
  CHANNEL1: process.env.CHANNEL1 || "",
  CHANNEL2: process.env.CHANNEL2 || "",
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/auto_approve_bot",
  DB_NAME: process.env.DB_NAME || "auto_approve_bot",
  PORT: parseInt(process.env.PORT || "3000", 10),
  WEBHOOK_URL: process.env.WEBHOOK_URL || "",
  NODE_ENV: process.env.NODE_ENV || "development",
};

const missing = ["BOT_TOKEN", "BOT_USERNAME"].filter((k) => !config[k]);
if (missing.length) {
  console.error("[config] Missing required env vars:", missing.join(", "));
  process.exit(1);
}

module.exports = config;
