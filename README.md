# 🔍 Secret Word Hunt Bot - Towns Protocol
**Gamified Community Engagement Through Word Discovery**

Create an exciting treasure hunt experience in your Towns community! Hide a secret word and watch as members hunt for it to win prizes. Perfect for boosting engagement and rewarding active community members.

## 🎯 What This Bot Does

### Core Features
- 🔍 **Secret Word Detection** - Automatically detects when users say the magic word
- 🎁 **Prize Management** - Admins can set custom prizes and congratulations messages
- 🏆 **Winner Tracking** - Each user can only win once (anti-spam protection)
- 👑 **Admin System** - Secure admin commands for game management
- 📊 **Status Dashboard** - Track game configuration and winner count
- 🗄️ **Database Storage** - SQLite database for persistent data

### Admin Commands
- `/addadmin @user` - Add a new admin (first user becomes admin automatically)
- `/setword <word>` - Set the secret word users need to find
- `/setprize <description>` - Set the prize description
- `/setdescription <message>` - Customize the congratulations message
- `/status` - View current game configuration and winner count

### User Experience
- 🎮 **Simple Gameplay** - Just chat naturally and discover the word
- 🎉 **Instant Rewards** - Automatic detection and congratulations
- 📱 **Welcome Messages** - New users are greeted with hunt information
- 💡 **Help Command** - @bot help explains how to play

**Perfect for community engagement, member rewards, and gamification!**

## 🚀 Quick Start Guide

### 1. Setup Bot (5 minutes)
```bash
# Install dependencies
bun install

# Create .env file
cp .env.sample .env
# Then edit .env with your bot credentials from Towns Developer Portal
```

### 2. Run Locally (1 minute)
```bash
bun run dev
```

### 3. Setup First Admin (In your Towns space)
```
/addadmin
```
This makes YOU the first admin! 🎉

### 4. Configure the Hunt
```
/setword treasure
/setprize 100 USDC
/setdescription Congrats! You found it!
/status
```

### 5. Start the Hunt! 🏁
Your community members will now hunt for the word "treasure"!

---

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

**If your bot starts without errors - SUCCESS!** 🎉

---

## 🎮 Example Usage Scenario

### Admin Sets Up the Hunt
```
Admin: /setword moonshot
Bot: ✅ Secret word set! Users can now hunt for it! 🔍

Admin: /setprize 50 USDC
Bot: ✅ Prize set to: 50 USDC

Admin: /setdescription Amazing! You discovered the moonshot word! 🚀
Bot: ✅ Congratulations message set!

Admin: /status
Bot: 📊 Secret Word Hunt Status

🔑 Secret Word: moonshot
🎁 Prize: 50 USDC
💬 Message: Amazing! You discovered the moonshot word! 🚀
🏆 Winners: 0

✅ Game is ready!
```

### User Discovers the Word
```
User: I think this project is going to moonshot! 🚀
Bot: 🎊 WINNER! @User

Amazing! You discovered the moonshot word! 🚀

🎁 Your Prize: 50 USDC

✨ An admin will now tip you your prize!
```

### New Users Join
```
Bot: 🎉 Welcome @NewUser! 

There's a secret word hidden somewhere in this server... Find it and win a prize! 🎁

Mention me with "help" to learn more! 🔍
```

---

## 🤖 Bot Architecture & Database

### Database Schema
The bot uses SQLite (bun:sqlite) with three tables:

#### 1. `secret_config` - Game Configuration
```sql
CREATE TABLE secret_config (
  space_id TEXT PRIMARY KEY,
  secret_word TEXT,
  prize TEXT,
  description TEXT,
  created_at INTEGER
)
```
Stores the secret word, prize, and congratulations message per space.

#### 2. `winners` - Winner Tracking
```sql
CREATE TABLE winners (
  user_id TEXT,
  space_id TEXT,
  found_at INTEGER,
  PRIMARY KEY (user_id, space_id)
)
```
Tracks which users have already won (prevents duplicate wins).

#### 3. `admins` - Admin Management
```sql
CREATE TABLE admins (
  user_id TEXT,
  space_id TEXT,
  added_at INTEGER,
  PRIMARY KEY (user_id, space_id)
)
```
Stores admin permissions per space.

### Bot Logic Flow

#### Message Processing
1. **Bot Message Filter** - Skip bot's own messages
2. **Admin Command Detection** - Check for `/` commands
3. **Permission Check** - Verify user is admin for admin commands
4. **Secret Word Detection** - Check if message contains secret word
5. **Winner Check** - Verify user hasn't already won
6. **Winner Recording** - Store winner and send congratulations

#### Event Handlers
- `onMessage` - Main handler for commands and word detection
- `onMentioned` - Help system with context-aware responses
- `onChannelJoin` - Welcome new users with hunt information

### Security Features
- ✅ Admin-only commands with permission checks
- ✅ One win per user (anti-spam protection)
- ✅ Per-space configuration (multi-space support)
- ✅ Database constraints prevent duplicates
- ✅ Error handling on all operations

---

## 📚 Technical Documentation

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

## ✅ Success Checklist

### Local Development
- [ ] Bun installed and working (`bun --version`)
- [ ] Bot credentials added to `.env`
- [ ] Bot starts without errors (`bun run dev`)
- [ ] Health check responds (http://localhost:5123/health)
- [ ] Database tables created (`bot.db` file exists)

### Production Deployment
- [ ] GitHub repository created and pushed
- [ ] Render service deployed successfully
- [ ] Environment variables configured in Render
- [ ] Webhook URL configured in Towns (`/webhook` endpoint)
- [ ] Bot installed to Towns space
- [ ] Bot online and responsive

### Game Configuration
- [ ] First admin set up (`/addadmin` command used)
- [ ] Secret word configured (`/setword` command)
- [ ] Prize description set (`/setprize` command)
- [ ] Congratulations message set (`/setdescription` command)
- [ ] Status checked (`/status` shows all configuration)

### Testing & Verification
- [ ] Test message with secret word triggers win
- [ ] Winner receives congratulations message
- [ ] Duplicate win attempt blocked (same user tries again)
- [ ] New users receive welcome message
- [ ] Help command works (`@bot help`)
- [ ] Admin commands work correctly

**Once all ✅ - your Secret Word Hunt is ready to engage your community!**

## 🎯 Tips for Running a Successful Hunt

### Strategy Ideas
1. **Hide Hints** - Drop hints in announcements or pinned messages
2. **Time-Limited** - Create urgency with limited-time hunts
3. **Multiple Rounds** - Reset the word weekly for ongoing engagement
4. **Varied Prizes** - Mix token rewards with NFTs, roles, or access
5. **Community Clues** - Let previous winners give hints to others

### Best Practices
- 🎪 **Announce the hunt** - Build excitement before starting
- 🔄 **Rotate words** - Keep it fresh with new challenges
- 💰 **Fair prizes** - Make rewards worth the effort
- 📊 **Track engagement** - Use `/status` to see participation
- 🎉 **Celebrate winners** - Make winning feel special

## 🚀 What's Next?

### For Admins
1. **Set up your first hunt** - Use the quick start commands
2. **Promote the game** - Announce in your space
3. **Monitor winners** - Check `/status` regularly
4. **Reward winners** - Tip prizes promptly
5. **Start new rounds** - Keep the community engaged

### For Developers
1. **Customize messages** - Edit congratulations text
2. **Add features** - Use AI to extend functionality
3. **Integrate rewards** - Auto-tip winners (advanced)
4. **Multi-space support** - Deploy to multiple communities
5. **Analytics** - Track engagement metrics

**Welcome to gamified community engagement with Towns Protocol! 🎮✨**
