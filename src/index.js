const { Bot, webhookCallback } = require("grammy");
const http = require("http");
const { connect } = require("./database");
const {
  handleStart,
  handleDisclaimer,
  handleDisclaimerCallback,
  handleJoinRequest,
} = require("./handlers");
const { BOT_TOKEN, PORT, WEBHOOK_URL } = require("./config");

// ── Bot setup ─────────────────────────────────────────────────────────────────

const bot = new Bot(BOT_TOKEN);

bot.command("start", handleStart);
bot.command("disclaimer", handleDisclaimer);
bot.callbackQuery("disclaimer", handleDisclaimerCallback);
bot.on("chat_join_request", handleJoinRequest);

bot.catch((err) => {
  console.error("[bot] Unhandled error:", err.message);
});

// ── Startup ───────────────────────────────────────────────────────────────────

async function start() {
  await connect();

  if (WEBHOOK_URL) {
    // ── Render / production: webhook ─────────────────────────────────────────
    const webhookPath = `/${BOT_TOKEN}`;
    const handleUpdate = webhookCallback(bot, "http");

    const server = http.createServer(async (req, res) => {
      if (req.method === "POST" && req.url === webhookPath) {
        await handleUpdate(req, res);
      } else {
        // Health check endpoint for Render
        res.writeHead(200);
        res.end("Auto Approve Bot is running.");
      }
    });

    server.listen(PORT, "0.0.0.0", async () => {
      const url = `${WEBHOOK_URL}${webhookPath}`;
      await bot.api.setWebhook(url);
      console.log(`[bot] Webhook set to: ${url}`);
      console.log(`[bot] Server listening on port ${PORT}`);
    });

    // Graceful shutdown
    process.once("SIGINT", () => { server.close(); bot.stop(); });
    process.once("SIGTERM", () => { server.close(); bot.stop(); });
  } else {
    // ── Local development: long polling ──────────────────────────────────────
    console.log("[bot] Starting long polling ...");
    await bot.api.deleteWebhook();
    await bot.start();
  }
}

start().catch((err) => {
  console.error("[boot] Fatal error:", err.message);
  process.exit(1);
});
