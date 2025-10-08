# Agent Playbook: Towns Bot Vibes

## 1. Start Here
- Clone or open the repo in Cursor.
- Keep `.cursorrules`, `README.md`, and `COMPLETE_KNOWLEDGE_BASE.md` handy—this playbook fuses all three.
- Work in this exact order every session:
  1. Environment setup
  2. File + dependency check
  3. Code edits with required patterns
  4. Build, then deploy to Render
  5. Wire the webhook in Towns Portal

## 2. Environment Setup (no shortcuts)
```bash
# 1. Make sure Bun exists
bun --version

# 2. Install Bun if missing
curl -fsSL https://bun.sh/install | bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# 3. Verify SDK versions
npm run check-versions
# If out of date
npm run update-sdk

# 4. Install deps
bun install
```

## 3. Mandatory Files & Versions
Confirm these before touching bot logic:
- `src/index.ts`
- `src/commands.ts`
- `package.json`
- `.env.sample`
- `tsconfig.json`
- `esbuild.config.mjs`

`package.json` must include:
```json
{
  "@towns-protocol/bot": "^0.0.364",
  "@towns-protocol/sdk": "^0.0.364",
  "@hono/node-server": "^1.14.0",
  "hono": "^4.7.11"
}
```

`srv/commands.ts` stays simple and must export the default command:
```typescript
export default [
  { name: 'help', description: 'Show help' },
]
```

## 4. Core Bot Blueprint
`src/index.ts` has to look and behave like this skeleton:
```typescript
import { makeTownsBot } from '@towns-protocol/bot'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import commands from './commands.js'

if (!process.env.APP_PRIVATE_DATA || !process.env.JWT_SECRET) {
  console.error('❌ Missing credentials!')
  process.exit(1)
}

const bot = await makeTownsBot(
  process.env.APP_PRIVATE_DATA.trim(),
  process.env.JWT_SECRET,
  { commands } as any
)

bot.onMessage(async (handler, event) => {
  if (event.userId === bot.botId) return

  try {
    if (event.isMentioned) {
      await handler.sendMessage(event.channelId, 'Hello!')
      return
    }
    // custom logic
  } catch (error) {
    console.error('Error:', error)
  }
})

const { jwtMiddleware, handler } = await bot.start()
const app = new Hono()
app.post('/webhook', jwtMiddleware, handler)
app.get('/health', (c) => c.json({ status: 'ok', botId: bot.botId }))

serve({ fetch: app.fetch, port: Number(process.env.PORT || 5123) })
```
Keep the real file richer, but never remove:
- Env validation
- `{ commands } as any`
- `if (event.userId === bot.botId) return`
- `try/catch`

## 5. Local Dev Loop
1. Copy `.env.sample` to `.env`; match Render values exactly.
2. Run `bun install` once per change to dependencies.
3. Start dev server: `bun run dev`.
4. Hit `http://localhost:5123/health` to confirm status.
5. Modify handlers—use AI prompts like “Add response when users say ‘wagmi’”.
6. Re-run tests/build as needed: `bun run build`.

## 6. Render Deployment Flow
1. Push code to GitHub first.
2. On Render: New → Web Service → connect repo.
3. Configure build & start commands:
   - Build: `bun install && bun run build`
   - Start: `bun run start`
4. Add env vars exactly:
```
APP_PRIVATE_DATA=[full value from Towns]
JWT_SECRET=[secret from Towns]
PORT=5123
```
5. Deploy and wait for “Your service is live 🎉”.
6. Note the public URL: `https://your-bot.onrender.com`.

## 7. Towns Portal Webhook
Only do this after Render is green:
1. https://app.alpha.towns.com/developer → your bot.
2. Webhook URL: `https://your-bot.onrender.com/webhook`.
3. Enable: All Messages, Mentions, Replies.
4. Save; expect Verification success.
5. Install bot into your space; test with “GM”.

## 8. Handler Patterns You Must Keep
```typescript
bot.onMessage(async (handler, event) => {
  if (event.userId === bot.botId) return

  try {
    if (event.isMentioned) {
      await handler.sendMessage(event.channelId, 'Response')
      return
    }

    if (event.message.toLowerCase().includes('gm')) {
      await handler.sendMessage(event.channelId, `GM <@${event.userId}>!`)
    }
  } catch (error) {
    console.error('Error:', error)
  }
})
```
Other supported hooks (activate as needed):
- `bot.onReaction`
- `bot.onChannelJoin`
- `bot.onChannelLeave`
- `bot.onMessageEdit`
- `bot.onReply`
- `bot.onThreadMessage`
All must follow the same safety rules: skip bot ID and wrap in try/catch.

## 9. Database Quickstart (optional)
```typescript
import { Database } from 'bun:sqlite'
const db = new Database('bot.db')

db.run(`CREATE TABLE IF NOT EXISTS users (
  user_id TEXT,
  space_id TEXT,
  data TEXT,
  PRIMARY KEY (user_id, space_id)
)`)

db.run('INSERT OR IGNORE INTO users VALUES (?, ?, ?)', [userId, spaceId, data])
const user = db.query('SELECT * FROM users WHERE user_id = ?').get(userId)
```
Rules:
- Use `db.run()` (never `db.exec()`).
- Guard all DB work with try/catch inside handlers.

## 10. Build & Ship Checklist
- [ ] `src/commands.ts` exists and exported default list.
- [ ] `src/index.ts` imports commands + `{ commands } as any`.
- [ ] Env validation before `makeTownsBot`.
- [ ] Every handler skips bot ID and uses try/catch.
- [ ] `bun run build` succeeds.
- [ ] `dist/index.mjs` is generated.
- [ ] Render logs show bot ID and no errors.
- [ ] Webhook verified in Towns Portal.
- [ ] Bot responds to “GM” and mention “help”.

## 11. Troubleshooting Decoder Ring
| Symptom | Likely Cause | Fix |
| --- | --- | --- |
| `premature EOF` | `APP_PRIVATE_DATA` incomplete | Re-copy full key, trim whitespace. |
| `CANNOT_CALL_WEBHOOK` | `{ commands } as any` missing | Add commands import + pass to `makeTownsBot`. |
| No mention response | Removed `isMentioned` logic | Restore mention block in `onMessage`. |
| Infinite replies | Forgot `if (userId === bot.botId) return` | Add the guard at the top of every handler. |
| DB warning about `exec` | Using `db.exec()` | Switch to `db.run()`. |

## 12. AI Prompt Recipes
Simple adds:
```
"Make the bot react with 🚀 when someone says 'moon'"
"Add a welcome DM when users join"
"Track points when users say 'gm'"
```
Larger features:
```
"Create a verification flow using ✅ reactions"
"Build a moderation filter that removes banned words"
"Add a leaderboard persisted in bun:sqlite"
```
Always remind the model to keep the safety guards and deployment checklist.

## 13. Reference Map
- `README.md`: High-level flow + deployment context.
- `.cursorrules`: Non-negotiable guardrails (this playbook mirrors them).
- `COMPLETE_KNOWLEDGE_BASE.md`: Full patterns, troubleshooting, advanced handlers.
- `agent.md`: Your quick-start for Cursor or any AI co-pilot.

Stay in flow, follow the order, and ship your Towns bot without surprises. Have fun building!
