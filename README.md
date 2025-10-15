# Towns Protocol Bot Starter Template
**Production-Ready | Render-Optimized | AI-Friendly**

Complete bot template ready for Render deployment. Works with Cursor AI for easy customization.

## What This Template Does

**Out of the box:**
- Responds to "GM" with "GM back"
- Responds to @bot mentions
- Shares an example image when you mention it with words like "image" or "picture"
- Welcomes new users
- Tracks all events with logging
- Health check endpoint for monitoring

**Ready to add with AI:**
- User verification systems
- Message moderation
- Statistics & leaderboards
- Custom commands
- Games & rewards
- Database storage

---

## Deployment Flow (Follow This Order)

### 1. Get Bot Credentials from Towns

**Portal:** https://app.alpha.towns.com/developer

1. Click **"Create New Bot"**
2. Set permissions: Read, Write, React, JoinSpace
3. Copy credentials:
   - **APP_PRIVATE_DATA** (copy ENTIRE value!)
   - **JWT_SECRET**

### 2. Deploy to Render.com FIRST

**Dashboard:** https://dashboard.render.com

1. **New** → **Web Service**
2. **Connect GitHub** repo
3. **Configure:**
   - Build Command: `bun install && bun run build`
   - Start Command: `bun run start`
4. **Add Environment Variables:**
   ```
   APP_PRIVATE_DATA = [paste full key from Towns]
   JWT_SECRET = [paste secret from Towns]
   PORT = 5123
   ```
5. **Deploy** - Wait for "Your service is live 🎉"
6. **Copy your Render URL**: `https://your-bot.onrender.com`

### 3. Configure Webhook in Towns (After Render is Running)

**IMPORTANT:** Webhook setup only works AFTER bot is deployed and running on Render!

1. Go to Towns Portal → Your Bot → Settings
2. **Webhook URL**: `https://your-bot.onrender.com/webhook`
3. **Enable Forwarding**: All Messages, Mentions, Replies
4. **Save** - Should see "✅ Webhook verified"

### 4. Install to Your Space

1. Open Towns app → Your Space
2. Settings → Bots → Install Bot
3. Select your bot → Install
4. **Test:** Say "GM" in chat

---

## Local Testing (.env must match Render!)

**CRITICAL:** Your `.env` file must have the EXACT same values as Render environment variables!

```bash
# Create .env (copy from .env.sample)
cp .env.sample .env
```

Edit `.env` with **same values** as Render:
```env
APP_PRIVATE_DATA=exact_same_value_as_render
JWT_SECRET=exact_same_value_as_render
PORT=5123
```

Then run:
```bash
bun install
bun run dev
```

Test: http://localhost:5123/health

---

## Project Structure

```
src/
├── index.ts       # Main bot logic
└── commands.ts    # Bot commands (required for webhooks!)

package.json       # Dependencies (auto-updates available)
.cursorrules       # AI coding rules
check-versions.sh  # SDK version checker

COMPLETE_KNOWLEDGE_BASE.md  # All patterns & solutions
```

---

## Customization with AI

This template is optimized for **Cursor + Claude/ChatGPT**.

### Simple Prompts

```
"Add response when users say 'wagmi'"
"Make bot react with 🚀 when someone says 'moon'"
"Add welcome message for new users"
```

### Advanced Prompts

```
"Add user verification system using ✅ reactions"
"Create message moderation for bad words"
"Add statistics tracking with database"
"Build leaderboard system with points"
"Send an image when users say 'show pic'"
```

AI references:
- `COMPLETE_KNOWLEDGE_BASE.md` - All handlers, patterns, deployment
- `.cursorrules` - Latest SDK guidelines
- Template code in `src/index.ts`

---

## Available Scripts

```bash
npm run check-versions  # Check for SDK updates
npm run update-sdk      # Update to latest SDK
npm run setup           # Install + check versions
npm run dev             # Development mode
npm run build           # Build for Render
npm run deploy          # Verify build ready
```

**Version Checker:** Automatically checks npm for latest SDK versions.

---

## Key Technical Details

### Dependencies
```json
{
  "@towns-protocol/bot": "latest",
  "@towns-protocol/sdk": "latest",
  "@hono/node-server": "^1.14.0",
  "hono": "^4.7.11"
}
```

**Keep your SDK updated:**
```bash
bun run check-versions  # Check for updates
bun run update-sdk      # Update to latest
```

### Sending Images & Attachments
```typescript
await handler.sendMessage(channelId, "Here's your visual", {
  attachments: [
    {
      type: 'image',
      url: 'https://example.com/cat.png',
      alt: 'Cute cat',
    },
  ],
})
```
The bot fetches the URL, validates that it is an image, measures dimensions, encrypts the payload, and still delivers the text even if the attachment fails. Add multiple attachments by pushing additional objects into the array.

### Commands Registration (Required!)
```typescript
// src/commands.ts - MUST exist for webhook verification
export default [
  { name: 'help', description: 'Show help' },
]

// src/index.ts - MUST import and register
import commands from './commands.js'
const bot = await makeTownsBot(
  process.env.APP_PRIVATE_DATA,
  process.env.JWT_SECRET,
  { commands } as any  // Required!
)
```

### Bot Message Filtering (Critical!)
```typescript
bot.onMessage(async (handler, event) => {
  if (event.userId === bot.botId) return // Prevents infinite loops!
  // ... your code
})
```

---

## Troubleshooting Render Deployment

### Check Render Logs

**Success:**
```
✅ 🔑 Key length: 596 characters
✅ 🤖 Bot ID: 0x...
✅ Your service is live 🎉
```

**Failed - Missing Env:**
```
❌ ERROR: APP_PRIVATE_DATA not set!
```
→ Add environment variable in Render dashboard

**Failed - Incomplete Key:**
```
RangeError: premature EOF
```
→ Re-copy FULL APP_PRIVATE_DATA from Towns Portal (no spaces!)

**Failed - Webhook:**
```
RegisterWebhook: (66:CANNOT_CALL_WEBHOOK)
```
→ Ensure `{ commands } as any` in bot initialization

### Common Fixes

1. **Environment variables:** Must be set in Render dashboard (not just .env)
2. **APP_PRIVATE_DATA:** Copy full key, no spaces at start/end
3. **Webhook URL:** Bot must be running on Render FIRST before setting webhook
4. **Commands:** src/commands.ts must exist and be imported

---

## Documentation

- **COMPLETE_KNOWLEDGE_BASE.md** - Deployment, handlers, patterns, errors
- **.cursorrules** - AI guidelines for latest SDK

---

**Render-Ready | Auto-Deploy on Git Push | Always Current**

https://github.com/Crisvond-hnt/Townsbot-vibecoding
