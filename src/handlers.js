const { InlineKeyboard } = require("grammy");
const { upsertUser, logApproval } = require("./database");
const { DISCLAIMER, startText, approvedGroupText, approvedDmText } = require("./messages");
const { BOT_USERNAME, CHANNEL1, CHANNEL2 } = require("./config");

// ── /start ────────────────────────────────────────────────────────────────────

async function handleStart(ctx) {
  const user = ctx.from;
  await upsertUser(user).catch(() => {});

  const keyboard = new InlineKeyboard()
    .url("Add me to Group", `https://t.me/${BOT_USERNAME}?startgroup=true`)
    .url("Add me to Channel", `https://t.me/${BOT_USERNAME}?startchannel=true`)
    .row()
    .url("Bot Updates", `https://t.me/${CHANNEL1}`)
    .url("More Bots", `https://t.me/${CHANNEL2}`)
    .row()
    .text("Disclaimer", "disclaimer");

  await ctx.reply(startText(user.first_name, BOT_USERNAME), {
    parse_mode: "HTML",
    reply_markup: keyboard,
    disable_web_page_preview: true,
  });
}

// ── /disclaimer ───────────────────────────────────────────────────────────────

async function handleDisclaimer(ctx) {
  await ctx.reply(DISCLAIMER, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
}

// ── Disclaimer callback ───────────────────────────────────────────────────────

async function handleDisclaimerCallback(ctx) {
  await ctx.answerCallbackQuery();
  await ctx.reply(DISCLAIMER, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
}

// ── Auto-approve join requests ────────────────────────────────────────────────

async function handleJoinRequest(ctx) {
  const { chat, from: user } = ctx.chatJoinRequest;

  try {
    await ctx.api.approveChatJoinRequest(chat.id, user.id);
  } catch (err) {
    console.error("[approve] Failed to approve request:", err.message);
    return;
  }

  await logApproval(chat.id, chat.title, user.id).catch(() => {});

  const knowMoreBtn = new InlineKeyboard().url(
    "Know More",
    `https://t.me/${BOT_USERNAME}?start=approved`
  );

  if (chat.type === "group" || chat.type === "supergroup") {
    const text = approvedGroupText(user.first_name, user.id, chat.title, BOT_USERNAME);
    await ctx.api
      .sendMessage(chat.id, text, {
        parse_mode: "HTML",
        reply_markup: knowMoreBtn,
        disable_web_page_preview: true,
      })
      .catch((err) => console.warn("[approve] Group msg failed:", err.message));
  } else {
    const text = approvedDmText(user.first_name, chat.title, CHANNEL1);
    await ctx.api
      .sendMessage(user.id, text, {
        parse_mode: "HTML",
        reply_markup: knowMoreBtn,
        disable_web_page_preview: true,
      })
      .catch((err) => console.warn("[approve] DM failed:", err.message));
  }
}

module.exports = {
  handleStart,
  handleDisclaimer,
  handleDisclaimerCallback,
  handleJoinRequest,
};
