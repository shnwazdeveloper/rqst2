# Auto Approve Bot (Node.js)

Telegram bot that instantly approves channel / group join requests.
Built with **grammY**, **Mongoose**, and deployable on **Render**.

---

## Project Structure

```
auto-approve-bot/
  src/
    index.js      - entry point, webhook / polling switch
    config.js     - all settings from env vars
    database.js   - Mongoose models + helper functions
    handlers.js   - bot command and event handlers
    messages.js   - all text strings in one place
  package.json
  render.yaml
  .env.example
  .gitignore
```

---

## Local Development

```bash
npm install
cp .env.example .env   # fill in BOT_TOKEN, BOT_USERNAME, MONGO_URI
npm run dev            # nodemon auto-restarts on change
```

Leave `WEBHOOK_URL` empty in `.env` to use long polling locally.

---

## Deploy to Render

1. **MongoDB Atlas** - create a free cluster, whitelist `0.0.0.0/0`, copy the URI.

2. **Push to GitHub**
   ```bash
   git init && git add . && git commit -m "init"
   git remote add origin https://github.com/YOUR/auto-approve-bot.git
   git push -u origin main
   ```

3. **Render Web Service**
   - New > Web Service > connect repo
   - Build: `npm install`
   - Start: `npm start`
   - Add env vars:

   | Key | Value |
   |-----|-------|
   | BOT_TOKEN | your bot token |
   | BOT_USERNAME | username without @ |
   | CHANNEL1 | update channel without @ |
   | CHANNEL2 | second channel without @ |
   | MONGO_URI | Atlas connection string |
   | DB_NAME | auto_approve_bot |
   | WEBHOOK_URL | https://your-app.onrender.com |

4. After first deploy the webhook is set automatically.
   Verify: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`

---

## Telegram Setup

1. Create bot via @BotFather
2. Add bot as **Administrator** to your channel or group
3. Enable **Approve new members** in channel / group settings
