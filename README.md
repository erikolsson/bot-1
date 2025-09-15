# 🤖 Ultimate Towns Protocol Bot Starter Template
**Zero to Running Bot in 30 Minutes Using AI - No Coding Experience Required**

This is the **PERFECT foundation** for building Towns Protocol bots with AI assistance. The template includes ALL SDK functions, complete documentation, and is specifically designed for Cursor + Claude/ChatGPT development.

## 🎯 What This Template Provides

### Complete Bot Foundation
- 🤖 **All Towns SDK imports** - Every function ready to use
- 📚 **Complete knowledge base** - All functions documented for AI
- 🔧 **Helper functions** - formatUser, shortId, containsWords
- 🗄️ **Database patterns** - SQLite examples ready to uncomment
- ⚡ **Production patterns** - Based on working bots

### AI Will Help You Build
- 🌅 **Greeting bots** - GM, hello, welcome responses
- 🤖 **Command bots** - @bot help, @bot stats, custom commands  
- 🛡️ **Moderation bots** - Delete bad messages, user verification
- 📊 **Analytics bots** - User stats, leaderboards, tracking
- 🎮 **Interactive bots** - Games, polls, reactions, points systems
- 🔔 **Utility bots** - Scheduled messages, notifications, integrations

**Perfect foundation for AI agents to build ANY type of sophisticated bot!**

## 🛠️ Prerequisites (10 minutes) - CRITICAL SETUP

### 1. Install Cursor (AI Code Editor) - MOST IMPORTANT
1. **Download**: https://cursor.com/
2. **Install** for your operating system
3. **Open Cursor** and sign up for account
4. **Setup AI**: 
   - Go to **Settings** → **Models** 
   - Choose **Claude 3.5 Sonnet** (recommended) or **GPT-4**
   - **Sign up** for Claude/OpenAI account if needed
5. **Test AI**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows)
   - Type: "Hello, can you help me code?"
   - If AI responds → You're ready! ✅

### 2. Install Bun Runtime
```bash
# Mac/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)  
powershell -c "irm bun.sh/install.ps1 | iex"

# Test installation
bun --version
```

### 3. Install Git (if not installed)
- **Mac**: `xcode-select --install`
- **Windows**: Download from https://git-scm.com/
- **Linux**: `sudo apt install git`

### 4. Create GitHub Account
- **Go to**: https://github.com/
- **Sign up** (free account is perfect)
- You'll need this for deployment

## Step 1: Create Your Bot Account (5 minutes)

### Towns Developer Portal Setup

1. **Go to**: https://app.alpha.towns.com/developer
2. **Connect your wallet** (MetaMask, Coinbase, etc.)
3. **Click "Create New Bot"**
4. **Fill in details**:
   - **Bot Name**: "My GM Bot" (or whatever you want)
   - **Description**: "Friendly greeting bot"
   - **Avatar**: Upload an image (optional)

5. **Set Bot Permissions** (CRITICAL):
   - ✅ **Read** - Access to messages and events
   - ✅ **Write** - Send messages and reactions  
   - ✅ **React** - Add emoji reactions
   - ✅ **JoinSpace** - Auto-join capabilities

6. **SAVE YOUR CREDENTIALS** (VERY IMPORTANT):
   - Copy the **APP_PRIVATE_KEY**
   - Copy the **JWT_SECRET**
   - Store them safely - you'll need them in Step 3!

## Step 2: Get the Bot Template (3 minutes)

### Download Template
```bash
# Method 1: Use Towns CLI (recommended)
npx towns-bot init my-gm-bot

# Method 2: Clone this template
git clone https://github.com/towns-protocol/simple-bot-starter
cd simple-bot-starter

# Install dependencies
bun install
```

### What You Get
```
simple-bot-starter/
├── src/index.ts          # Your bot code (customize this!)
├── package.json          # Dependencies (don't change)
├── .cursorrules         # AI coding rules (don't change)
├── .env.sample          # Environment template
└── README.md            # This guide
```

## Step 3: Configure Your Bot (2 minutes)

### Setup Environment Variables
```bash
# Copy the template
cp .env.sample .env
```

### Edit .env File
Open `.env` and add your credentials from Step 1:
```env
APP_PRIVATE_DATA_BASE64=paste_your_app_private_key_here
JWT_SECRET=paste_your_jwt_secret_here
PORT=5123
```

**CRITICAL**: Replace the placeholder values with your actual credentials!

## Step 4: Test Your Bot Locally (5 minutes)

### Start the Bot
```bash
bun run dev
```

### Expected Output
```
🤖 Simple GM Bot starting...
🎯 Bot ID: 0x1234...
🚀 Simple GM Bot running on port 5123
✨ Ready to spread good vibes! Say GM to test it!
```

### Test Health Check
Open: **http://localhost:5123/health**

Should show:
```json
{"status":"ok","bot":"Simple GM Bot","timestamp":1234567890}
```

**If you see this - your bot is working locally!** ✅

## Step 5: Deploy to Render.com (10 minutes)

### Create GitHub Repository
```bash
# Initialize git (if not done)
git init
git add .
git commit -m "My first Towns Protocol bot"

# Create repository on GitHub.com and connect it
git remote add origin https://github.com/yourusername/my-gm-bot.git
git push -u origin main
```

### Deploy on Render
1. **Go to**: https://render.com/
2. **Sign up/Login** with GitHub
3. **Click "New" → "Web Service"**
4. **Connect your bot repository**
5. **Configure deployment**:
   - **Name**: "my-gm-bot" (or whatever you want)
   - **Build Command**: `bun run render:build`
   - **Start Command**: `bun run start`
   - **Instance Type**: "Free" (perfect for testing)

6. **Add Environment Variables** (click "Advanced"):
   - `APP_PRIVATE_DATA_BASE64`: Your bot's private key
   - `JWT_SECRET`: Your bot's JWT secret
   - `PORT`: 5123

7. **Click "Deploy"**

### Wait for Deployment
- Takes 2-5 minutes
- You'll get a URL like: `https://my-gm-bot.onrender.com`
- **Save this URL** - you need it for Step 6!

## Step 6: Connect Bot to Towns (5 minutes)

### Configure Webhook
1. **Go back to**: https://app.alpha.towns.com/developer
2. **Edit your bot settings**
3. **Set Webhook URL**: `https://your-render-url.onrender.com/webhook`
   - **IMPORTANT**: Add `/webhook` to the end!
4. **Configure Message Forwarding**:
   - ✅ **All Messages** (so bot can respond to "GM")
   - ✅ **Mentions** (when @bot is mentioned)
   - ✅ **Replies** (when someone replies to bot)
5. **Save Changes**

### Install Bot to Your Space
1. **In Towns app**, go to your space
2. **Space Settings** → **Bots** → **Install Bot**
3. **Find your bot** and click **"Install"**
4. **Test it**: Say "GM" in the channel!

**If your bot starts without errors - SUCCESS!** 🎉 (The bot won't respond to anything yet - that's what AI will help you build!)

---

## 🤖 AI Customization Guide - The Magic Happens Here!

### Copy-Paste AI Prompts (Use in Cursor/Claude/ChatGPT)

#### 🌅 Start with Simple Greeting Bot (Perfect First Project)
```
"Make the bot respond to 'gm' or 'good morning' with 'GM @user! ☀️'. Use the onMessage handler and follow the .cursorrules patterns."

"Add a response when someone says 'hello', 'hi', or 'hey' with 'Hello @user! 👋'. Show me the complete code."

"Make the bot welcome new users when they join with '🎉 Welcome @user! Say GM to test the bot!'. Use the onChannelJoin handler."

"Add a @bot help command that explains what the bot does. Use the onMentioned handler pattern."
```

#### ⚡ Add Interactive Features
```
"Make the bot react with 🚀 emoji when someone mentions 'moon' or 'rocket'. Use the sendReaction function."

"Add a @bot joke command that tells random programming jokes. Show me how to add this to the onMentioned handler."

"Create a points system where users earn points for saying GM. Add database storage using bun:sqlite patterns from the template."

"Make the bot respond differently based on time of day - 'Good morning' before noon, 'Good evening' after 6 PM."
```

#### 🛡️ Add Moderation Features
```
"Add simple moderation - delete messages containing specific bad words and send warnings. Use adminRemoveEvent function and follow .cursorrules."

"Create a user verification system where new users must react with ✅ to welcome messages before chatting. Use reaction handler."

"Add rate limiting - warn users who send too many messages too quickly. Track messages in database."

"Make the bot delete messages with suspicious links and send safety warnings."
```

#### 📊 Add Analytics and Stats
```
"Add a database to track user activity (messages, reactions, join dates). Use the bun:sqlite patterns in the template comments."

"Create a @bot stats command that shows community statistics - active users, total messages, top contributors."

"Add a leaderboard system where users earn points for activity and can check rankings with @bot leaderboard."

"Track which commands are used most and show analytics to space owners."
```

#### Database Features
```
"Add a SQLite database using bun:sqlite to track how many times each user says GM. Add a @bot stats command. Follow .cursorrules patterns."

"Create a points system where users earn points for saying GM. Add leaderboard commands with database storage."
```

#### Moderation Features
```
"Add simple moderation - delete messages containing specific bad words and send short warnings. Use adminRemoveEvent following .cursorrules."

"Add user verification system where new users must react with ✅ to a welcome message before they can chat."
```

### 🎯 How to Use Cursor + AI (Step-by-Step)

#### 1. Open Project in Cursor
- **Open Cursor** application
- **File** → **Open Folder** → Select your bot project folder
- **Wait** for Cursor to load the project

#### 2. Start AI Chat
- **Press `Cmd+K` (Mac) or `Ctrl+K` (Windows)**
- **Or click** the AI chat icon in sidebar

#### 3. Use Perfect AI Prompts
- **Copy a prompt** from the examples above
- **Paste into AI chat**
- **Always add**: "Follow the .cursorrules and keep existing functionality"
- **Press Enter** and watch AI write perfect code!

#### 4. Apply AI Changes
- **Review the code** AI suggests
- **Click "Apply"** if it looks good
- **Test locally**: `bun run dev`
- **Commit changes**: `git add . && git commit -m "Add feature"`

### 🧠 AI Coding Tips for Best Results

1. **Always mention .cursorrules**: "Follow the .cursorrules for Towns Protocol best practices"
2. **Reference the template**: "Use the event handler patterns from src/index.ts"
3. **Keep existing code**: "Don't change the basic bot setup, just add this feature"
4. **Ask for complete examples**: "Show me the complete function with error handling"
5. **Test incrementally**: "Add this feature but keep all existing functionality working"
6. **Use the knowledge base**: "Reference the function examples in the template comments"
7. **Be specific**: "Add this to the onMessage handler" instead of "add message handling"

---

## 📚 COMPLETE TOWNS PROTOCOL KNOWLEDGE BASE FOR AI

*This section contains everything your AI assistant needs to build perfect bots*

### 🎯 ALL Available Event Handlers

```typescript
// === PRIMARY HANDLERS (Most Important) ===
bot.onMessage()           // ALL messages trigger this - most important handler
bot.onMentioned()         // When @bot is mentioned - perfect for commands
bot.onReaction()          // When users react with emojis - great for interactions
bot.onChannelJoin()       // When users join - perfect for welcome systems

// === ADVANCED HANDLERS ===
bot.onReply()             // When someone replies to bot messages
bot.onThreadMessage()     // Messages in conversation threads
bot.onMentionedInThread() // @bot mentioned in threads
bot.onMessageEdit()       // When users edit their messages
bot.onRedaction()         // When messages are deleted
bot.onChannelLeave()      // When users leave channels
bot.onEventRevoke()       // When moderators revoke events
bot.onStreamEvent()       // Raw protocol events (advanced)
```

### 🔧 ALL Available Handler Functions

```typescript
// === SENDING MESSAGES ===
handler.sendMessage(channelId, "Text")                    // Send to channel
handler.sendMessage(channelId, "Text", { threadId })      // Send in thread
handler.sendMessage(channelId, "Text", { replyId })       // Reply to message
handler.sendDm(userId, "Private message")                 // Direct message

// === MESSAGE MANAGEMENT ===
handler.editMessage(channelId, messageId, "New text")     // Edit bot's message
handler.removeEvent(channelId, messageId)                 // Delete bot's message
handler.adminRemoveEvent(channelId, messageId)            // Delete user's message

// === REACTIONS ===
handler.sendReaction(channelId, messageId, "👍")         // Add any emoji
handler.sendReaction(channelId, messageId, "❤️")         // Heart
handler.sendReaction(channelId, messageId, "white_check_mark") // ✅

// === BOT IDENTITY ===
handler.setUsername(channelId, "BotName")                 // Set username
handler.setDisplayName(channelId, "🤖 Display Name")      // Set display name

// === USER DATA ===
handler.getUserData(channelId, userId)                    // Get user info (deprecated)
```

### 🗄️ Database Integration Patterns

```typescript
// === SETUP DATABASE ===
import { Database } from 'bun:sqlite'
const db = new Database('bot.db')

// === CREATE TABLES ===
db.run(`CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  points INTEGER DEFAULT 0,
  messages INTEGER DEFAULT 0,
  last_active INTEGER DEFAULT (strftime('%s', 'now'))
)`)

// === DATABASE OPERATIONS ===
db.run('INSERT OR REPLACE INTO users (user_id, points) VALUES (?, ?)', [userId, points])
const user = db.query('SELECT * FROM users WHERE user_id = ?').get(userId)
const allUsers = db.query('SELECT * FROM users ORDER BY points DESC').all()
```

### 🎯 Message Formatting Examples

```typescript
// === USER MENTIONS (Clickable) ===
`Hello <@${userId}>!`                    // Mentions user (clickable in Towns)
`Welcome <@${userId}> to the server!`    // Welcome with mention

// === MARKDOWN FORMATTING ===
`**Bold text** *italic text* \`code text\``  // Basic markdown
`[Link text](https://example.com)`           // Links

// === MULTI-LINE MESSAGES ===
`Line 1
Line 2
Line 3`

// === EMOJIS ===
`Hello! 👋`              // Unicode emojis work perfectly
`GM! ☀️ Good morning!`   // Sun emoji for morning
```

## Towns Protocol Knowledge Base

### Essential Functions
- `bot.onMessage()` - Handle all messages
- `bot.onMentioned()` - Handle @bot mentions
- `bot.onReaction()` - Handle emoji reactions
- `bot.onChannelJoin()` - Handle new users joining
- `handler.sendMessage()` - Send messages to channels
- `handler.sendDm()` - Send direct messages
- `handler.sendReaction()` - Add emoji reactions

### Critical Rules
- Always filter bot messages: `if (userId === bot.botId) return`
- Use exact package versions from package.json
- Never modify tsconfig.json or esbuild.config.mjs
- Always use environment variables for credentials
- Test locally before deploying

## Success Checklist

### Local Development ✅
- [ ] Bun installed and working
- [ ] Bot credentials added to .env
- [ ] Bot starts without errors
- [ ] Health check responds
- [ ] Bot responds to "GM" locally

### Production Deployment ✅  
- [ ] GitHub repository created
- [ ] Render service deployed
- [ ] Environment variables configured
- [ ] Webhook URL configured in Towns
- [ ] Bot installed to Towns space
- [ ] Bot responds in production

### AI Customization Ready ✅
- [ ] Cursor installed and project opened
- [ ] .cursorrules file present
- [ ] AI prompts ready to use
- [ ] Understanding of bot structure

**Once all ✅ - you have a working Towns Protocol bot ready for unlimited customization!**

## What's Next?

1. **Test your bot** - Say "GM" in your Towns space
2. **Open in Cursor** - Start AI-assisted customization
3. **Use AI prompts** - Add features easily
4. **Deploy changes** - Git push auto-deploys
5. **Build your community** - Share your awesome bot!

**Welcome to the future of bot development with Towns Protocol! 🚀**
