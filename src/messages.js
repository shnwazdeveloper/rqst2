// All bot text in one place.
// Uses Unicode small-cap letters for stylised headings instead of emojis.

const DISCLAIMER = `<b>\u1d00\u1d1c\u1d1b\u1d0f \u1d00\u1d18\u1d18\u0280\u1d0f\u1d20\u1d07 \u0299\u1d0f\u1d1b \u1d00\u1d18\u1d18\u0280\u1d0f\u1d20\u1d07 \u1d0a\u1d0f\u026a\u0274 \u0280\u1d07\u1d0a\u1d1c\u1d07\u0262 \u1d00\u1d18\u1d18\u0280\u1d07\u1d00\u1d05 \u0299\u1d0f\u1d1b \u1d00\u1d18\u1d18\u0280\u1d0f\u1d20\u1d07 \u0299\u1d0f\u1d1b</b>

This bot is an <b>automated system</b> that approves join requests in Telegram channels and groups. By using this bot, you agree to the following:

<b>No Liability</b>
The bot owner and developers are <b>not responsible</b> for any unauthorized access, spam, or misuse. Admins must configure settings responsibly.

<b>Automated Decisions</b>
The bot works <b>automatically</b>. It does <b>not verify</b> user intent or guarantee member authenticity.

<b>Admin Responsibility</b>
Channel and group admins are <b>fully responsible</b> for moderation. The bot only accepts requests and does not enforce rules.

<b>No Responsibility for Content</b>
The bot does <b>not control, monitor, or endorse</b> any messages, media, or content posted in the group or channel. Admins and users are solely responsible for all shared content.

<b>Privacy Notice</b>
The bot does <b>not store or share personal data</b> beyond what is needed for join-request processing.

<b>Use this bot responsibly to keep your channel or group secure.</b>`;


function startText(firstName, botUsername) {
  return (
    `Hi <a href="tg://settings">${firstName}</a>, ` +
    `I am an <b>Auto Approve Bot</b>.\n` +
    `I approve channel and group join requests instantly.\n\n` +
    `<b>Setup</b>\n` +
    `Add me as an <b>administrator</b> to your group or channel.\n\n` +
    `Disclaimer \u2192 /disclaimer\n\n` +
    `Created by <b>@Culsor</b>`
  );
}

function approvedGroupText(firstName, userId, chatTitle, botUsername) {
  return (
    `Hello <a href="tg://user?id=${userId}">${firstName}</a>,\n\n` +
    `Your request to join <b>${chatTitle}</b> has been approved.\n\n` +
    `<a href="https://t.me/${botUsername}?start=approved">Tap here</a> to know more.`
  );
}

function approvedDmText(firstName, chatTitle, channel1) {
  return (
    `Hello <a href="tg://settings">${firstName}</a>,\n\n` +
    `Your request to join <b>${chatTitle}</b> has been approved.\n\n` +
    `Use /start to know more.\n\n` +
    `Created by <b>@${channel1}</b>`
  );
}

module.exports = { DISCLAIMER, startText, approvedGroupText, approvedDmText };
