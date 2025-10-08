# Towns Protocol Bot Development Guide
**SDK v0.0.364 | Production-Tested | AI-Optimized**

## Getting Bot Credentials

### Step 1: Create Bot in Towns Developer Portal

1. Go to: **https://app.alpha.towns.com/developer**
2. Click **"Create New Bot"**
3. Fill in:
   - **Name**: Your bot name
   - **Description**: What your bot does
   - **Avatar**: Upload image (optional)
4. Set **Permissions** (enable these):
   - ✅ **Read** - Access messages (required)
   - ✅ **Write** - Send messages (required)
   - ✅ **React** - Add reactions
   - ✅ **Redact** - Delete messages (if moderating)
   - ✅ **JoinSpace** - Auto-join spaces
5. Click **"Create"**

### Step 2: Copy Credentials

After creating bot, you'll see:
- **APP_PRIVATE_DATA** - Long base64 string (copy ALL of it!)
- **JWT_SECRET** - Secret string

**IMPORTANT:** Copy the **ENTIRE** APP_PRIVATE_DATA value. If it's cut off, webhook will fail with "premature EOF" error.

---

## Render.com Deployment (Production)

### Step 1: Create Render Service

1. Go to: **https://dashboard.render.com/**
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `your-bot-name`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Runtime**: Leave as detected
   - **Build Command**: `bun install && bun run build`
   - **Start Command**: `bun run start`
   - **Instance Type**: `Free` (for testing) or `Starter` (for production)

### Step 2: Add Environment Variables

In Render dashboard, add these **3 environment variables**:

```
Key: APP_PRIVATE_DATA
Value: [paste your FULL key from Towns Developer Portal]

Key: JWT_SECRET
Value: [paste your JWT secret from Towns Developer Portal]

Key: PORT
Value: 5123
```

**Critical:** Make sure APP_PRIVATE_DATA has NO spaces at start/end!

### Step 3: Deploy

1. Click **"Create Web Service"**
2. Wait 2-3 minutes for deployment
3. You'll get a URL like: `https://your-bot.onrender.com`
4. Check logs - should see:
   ```
   ✅ Bot ID: 0x...
   ✅ Your service is live 🎉
   ```

### Step 4: Configure Webhook in Towns

1. Go back to: **https://app.alpha.towns.com/developer**
2. Click on your bot
3. Set **Webhook URL**: `https://your-bot.onrender.com/webhook`
4. Enable **Message Forwarding**:
   - ✅ All Messages
   - ✅ Mentions
   - ✅ Replies
5. Click **"Save"**
6. Webhook should verify successfully ✅

### Step 5: Install Bot to Space

1. In **Towns app**, go to your space
2. **Settings** → **Bots** → **Install Bot**
3. Find your bot and click **"Install"**
4. Test by saying "GM" or "@bot help"

---

## Package Versions (Verified)
```json
{
  "@towns-protocol/bot": "^0.0.364",
  "@towns-protocol/sdk": "^0.0.364",
  "@hono/node-server": "^1.14.0",
  "hono": "^4.7.11"
}
```

### Minimal Bot
```typescript
import { makeTownsBot } from '@towns-protocol/bot'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import commands from './commands.js'

const bot = await makeTownsBot(
  process.env.APP_PRIVATE_DATA!,
  process.env.JWT_SECRET!,
  { commands } as any
)

bot.onMessage(async (handler, event) => {
  const { message, userId, channelId, isMentioned } = event
  if (userId === bot.botId) return
  
  if (isMentioned) {
    await handler.sendMessage(channelId, "Hello!")
  }
})

const { jwtMiddleware, handler } = await bot.start()
const app = new Hono()
app.post('/webhook', jwtMiddleware, handler)
app.get('/health', (c) => c.json({ status: 'ok' }))

serve({ fetch: app.fetch, port: 5123 })
```

### Commands (src/commands.ts) - Required!
```typescript
export default [
  { name: 'help', description: 'Show help' },
]
```

---

## Event Handlers

### Available Handlers
```typescript
// Primary Handlers
bot.onMessage()           // All messages (use this)
bot.onReaction()          // Emoji reactions
bot.onChannelJoin()       // User joins
bot.onChannelLeave()      // User leaves

// Legacy Handlers (still work, but prefer onMessage)
bot.onMentioned()         // @bot mentions → use isMentioned in onMessage
bot.onReply()             // Replies to bot
bot.onThreadMessage()     // Thread messages → check threadId in onMessage
bot.onMentionedInThread() // Thread mentions → check threadId + isMentioned

// Advanced
bot.onMessageEdit()       // Message edits
bot.onRedaction()         // Message deletions
bot.onEventRevoke()       // Event revokes
bot.onStreamEvent()       // Raw events
```

### onMessage (Current Approach)
```typescript
bot.onMessage(async (handler, event) => {
  const { 
    message,      // Message text
    userId,       // User ID
    channelId,    // Channel ID
    spaceId,      // Space ID
    eventId,      // Event ID
    isMentioned,  // Bot was @mentioned
    threadId,     // Thread ID (if in thread)
    replyId,      // Reply ID (if reply)
    mentions,     // Mentioned users
  } = event
  
  if (userId === bot.botId) return // Required!
  
  try {
    // Handle @mentions
    if (isMentioned) {
      await handler.sendMessage(channelId, "Response")
      return
    }
    
    // Handle regular messages
    if (message.toLowerCase().includes('hello')) {
      await handler.sendMessage(channelId, `Hello <@${userId}>!`)
    }
  } catch (error) {
    console.error(error)
  }
})
```

### onMentioned (Legacy - Still Works)
```typescript
bot.onMentioned(async (handler, event) => {
  const { message, channelId, userId } = event
  await handler.sendMessage(channelId, "Hello!")
})
```

### onReaction
```typescript
bot.onReaction(async (handler, event) => {
  const { reaction, messageId, userId, channelId, spaceId } = event
  
  if (userId === bot.botId) return
  
  if (reaction === 'white_check_mark') {
    await handler.sendMessage(channelId, `✅ <@${userId}> verified!`)
  }
})
```

### onChannelJoin
```typescript
bot.onChannelJoin(async (handler, event) => {
  const { userId, channelId, spaceId, eventId } = event
  
  if (userId === bot.botId) return
  
  await handler.sendMessage(channelId, `Welcome <@${userId}>!`)
})
```

---

## Handler Actions

### Messages
```typescript
// Send to channel
await handler.sendMessage(channelId, "Text")
await handler.sendMessage(channelId, "Text", { threadId })
await handler.sendMessage(channelId, "Text", { replyId })

// Send DM
await handler.sendDm(userId, "Private message")

// Edit/Delete
await handler.editMessage(channelId, messageId, "New text")
await handler.removeEvent(channelId, messageId)        // Bot's messages
await handler.adminRemoveEvent(channelId, messageId)   // User's messages
```

### Reactions
```typescript
await handler.sendReaction(channelId, messageId, "👍")
await handler.sendReaction(channelId, messageId, "❤️")
await handler.sendReaction(channelId, messageId, "white_check_mark")
```

### Utilities
```typescript
import { 
  isDMChannelStreamId, 
  isGDMChannelStreamId,
  isChannelStreamId,
  isDefaultChannelId
} from '@towns-protocol/sdk'

if (isDMChannelStreamId(channelId)) { /* DM */ }
if (isGDMChannelStreamId(channelId)) { /* Group DM */ }
if (isChannelStreamId(channelId)) { /* Public channel */ }
```

---

## Database

### Bun SQLite
```typescript
import { Database } from 'bun:sqlite'

const db = new Database('bot.db')

// Create table (use db.run not db.exec)
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT,
    space_id TEXT,
    data TEXT,
    PRIMARY KEY (user_id, space_id)
  )
`)

// Insert
db.run('INSERT OR IGNORE INTO users VALUES (?, ?, ?)', [userId, spaceId, data])

// Query one
const user = db.query('SELECT * FROM users WHERE user_id = ?').get(userId)

// Query many
const all = db.query('SELECT * FROM users WHERE space_id = ?').all(spaceId)

// Update
db.run('UPDATE users SET data = ? WHERE user_id = ?', [newData, userId])
```

---

## Render Deployment Troubleshooting

### Check Render Logs

In Render dashboard, click **"Logs"** tab to see:

**Successful deployment:**
```
✅ 🔑 Validating credentials...
   Key length: 596 characters
   First 20: CkIweGQ0ZmFiOWI5...
✅ 🤖 Bot ID: 0xA8Cb65E5687E82B58B9FE86B3decC5BeBD8E464E
✅ 🚀 Bot running on port 10000
✅ Your service is live 🎉
```

**Failed - Missing env vars:**
```
❌ ERROR: APP_PRIVATE_DATA not set!
```
→ Add APP_PRIVATE_DATA in Render environment variables

**Failed - Incomplete key:**
```
RangeError: premature EOF
```
→ Re-copy FULL APP_PRIVATE_DATA from Towns Portal (no spaces!)

**Failed - No commands:**
```
RegisterWebhook: (66:CANNOT_CALL_WEBHOOK)
```
→ Add `{ commands } as any` to makeTownsBot call

### Render Settings Summary

| Setting | Value |
|---------|-------|
| Build Command | `bun install && bun run build` |
| Start Command | `bun run start` |
| Environment | `APP_PRIVATE_DATA`, `JWT_SECRET`, `PORT=5123` |
| Auto-Deploy | ✅ Yes (on git push) |
| Health Check | `/health` endpoint |

---

## Common Errors

### "premature EOF"
**Cause:** APP_PRIVATE_DATA incomplete or has whitespace  
**Fix:** Re-copy full key from Towns Portal, trim it in code:
```typescript
const clean = process.env.APP_PRIVATE_DATA.trim()
const bot = await makeTownsBot(clean, process.env.JWT_SECRET, { commands } as any)
```

### "CANNOT_CALL_WEBHOOK"
**Cause:** Commands not registered  
**Fix:** Ensure bot initialization has `{ commands } as any`:
```typescript
const bot = await makeTownsBot(
  process.env.APP_PRIVATE_DATA,
  process.env.JWT_SECRET,
  { commands } as any  // Required!
)
```

### "Property 'onMentioned' does not exist"
**Cause:** TypeScript strict mode with legacy handler  
**Fix:** Use `isMentioned` in onMessage (current) or keep onMentioned (legacy, still works)

### "db.exec is deprecated"
**Cause:** Using db.exec()  
**Fix:** Use db.run() instead

---

## Patterns

### Greeting Bot
```typescript
bot.onMessage(async (handler, event) => {
  if (event.userId === bot.botId) return
  
  const lower = event.message.toLowerCase()
  
  if (event.isMentioned) {
    await handler.sendMessage(event.channelId, "Hi!")
    return
  }
  
  if (lower.includes('gm')) {
    await handler.sendMessage(event.channelId, `GM <@${event.userId}>!`)
  }
})
```

### Verification System
```typescript
// Database
const db = new Database('bot.db')
db.run(`CREATE TABLE IF NOT EXISTS verified (
  user_id TEXT, space_id TEXT, PRIMARY KEY (user_id, space_id)
)`)

// Welcome
bot.onChannelJoin(async (handler, { userId, channelId, spaceId }) => {
  if (userId === bot.botId) return
  await handler.sendMessage(channelId, `Welcome <@${userId}>! React ✅ to verify`)
})

// Verify
bot.onReaction(async (handler, { reaction, userId, channelId, spaceId }) => {
  if (userId === bot.botId) return
  
  if (reaction === 'white_check_mark') {
    db.run('INSERT OR IGNORE INTO verified VALUES (?, ?)', [userId, spaceId])
    await handler.sendMessage(channelId, `✅ <@${userId}> verified!`)
  }
})
```

### Moderation
```typescript
bot.onMessage(async (handler, event) => {
  if (event.userId === bot.botId) return
  
  const bad = ['spam', 'scam']
  if (bad.some(w => event.message.toLowerCase().includes(w))) {
    await handler.adminRemoveEvent(event.channelId, event.eventId)
    await handler.sendMessage(event.channelId, `🚫 <@${event.userId}> removed`)
  }
})
```

---

## Helper Functions

```typescript
const formatUser = (userId: string) => `<@${userId}>`
const shortId = (id: string) => `${id.slice(0, 6)}...${id.slice(-4)}`
const containsWords = (msg: string, words: string[]) => 
  words.some(w => msg.toLowerCase().includes(w.toLowerCase()))
```

---

## Production Deployment Checklist

**Code Ready:**
- [ ] `src/commands.ts` exists with command definitions
- [ ] Commands imported in `src/index.ts`
- [ ] Bot initialization has `{ commands } as any`
- [ ] Environment validation before bot init
- [ ] All handlers filter bot messages: `if (userId === bot.botId) return`
- [ ] Database uses `db.run()` not `db.exec()`
- [ ] Error handling in all handlers

**GitHub:**
- [ ] Repository created
- [ ] Code pushed to main branch
- [ ] `.gitignore` excludes `.env`, `node_modules`, `dist`, `*.db`

**Render.com:**
- [ ] New Web Service created
- [ ] GitHub repo connected
- [ ] Build Command: `bun install && bun run build`
- [ ] Start Command: `bun run start`
- [ ] Environment Variables set:
  - [ ] `APP_PRIVATE_DATA` (full key, no spaces)
  - [ ] `JWT_SECRET`
  - [ ] `PORT=5123`
- [ ] Deployment succeeds (check logs)
- [ ] See: "Bot ID: 0x..." in logs
- [ ] See: "Your service is live" message
- [ ] No "premature EOF" or "undefined" errors

**Towns Portal:**
- [ ] Bot created at https://app.alpha.towns.com/developer
- [ ] Credentials copied (APP_PRIVATE_DATA, JWT_SECRET)
- [ ] Webhook URL set: `https://your-app.onrender.com/webhook`
- [ ] Message forwarding enabled (All Messages, Mentions, Replies)
- [ ] Webhook verification succeeds (no "CANNOT_CALL_WEBHOOK")
- [ ] Bot installed to test space
- [ ] Bot responds to "GM"
- [ ] Bot responds to "@bot help"
- [ ] No infinite loops (bot ignores own messages)

---

## Critical Rules

1. **Always** filter bot messages: `if (userId === bot.botId) return`
2. **Always** register commands: `{ commands } as any`
3. **Always** validate env before bot init
4. **Always** use try-catch in handlers
5. **Use** `db.run()` not `db.exec()`
6. **Use** `isMentioned` for current approach (or `onMentioned` for legacy)

---

**This guide is production-tested. Every pattern works. No fluff.**
