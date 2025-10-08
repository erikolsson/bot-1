# 🔍 Secret Word Hunt Bot - Setup Complete!

## ✅ What Was Built

Your bot is now a fully-functional **Secret Word Hunt** game with:

### 🎮 Core Features
- ✅ Secret word detection in messages
- ✅ Admin command system
- ✅ Winner tracking (one win per user)
- ✅ Prize and congratulations management
- ✅ SQLite database for persistence
- ✅ Multi-space support

### 👑 Admin Commands
```
/addadmin           - First user becomes admin automatically
/addadmin @user     - Add another admin
/setword <word>     - Set the secret word to find
/setprize <prize>   - Set prize description (e.g., "100 USDC")
/setdescription <msg> - Set custom congratulations message
/status             - View current game configuration
```

### 🎯 User Features
- Automatic detection when secret word is spoken
- One-time win per user (anti-spam)
- Welcome messages for new members
- Help command (@bot help)
- Winner celebrations with reactions

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# If you have Bun (recommended)
bun install

# Or with npm (also supported now)
npm install
```

### 2. Create .env File
```bash
# Copy the sample
cp .env.sample .env

# Then edit .env and add your credentials from Towns Developer Portal
```

Your `.env` should look like:
```env
APP_PRIVATE_DATA_BASE64=your_private_key_from_towns
JWT_SECRET=your_jwt_secret_from_towns
PORT=5123
```

### 3. Run the Bot
```bash
# Development mode (auto-reload)
bun run dev
# or
npm run dev

# Production mode
bun run build && bun run start
# or
npm run build && npm run start
```

### 4. Setup First Admin
In your Towns space, type:
```
/addadmin
```
This makes YOU the first admin!

### 5. Configure the Game
```
/setword treasure
/setprize 50 USDC
/setdescription Wow! You found the secret treasure! 🏴‍☠️
/status
```

### 6. Test It!
Try saying the word "treasure" in chat. You should win! 🎉

## 📊 Database Schema

The bot creates `bot.db` with three tables:

### `secret_config` - Game settings per space
- `space_id` - Towns space identifier
- `secret_word` - The word users need to find
- `prize` - Prize description
- `description` - Custom congratulations message

### `winners` - Track who won
- `user_id` + `space_id` - Unique per user per space
- `found_at` - Timestamp of win

### `admins` - Admin permissions
- `user_id` + `space_id` - Admin access per space
- `added_at` - When admin was added

## 🎯 How It Works

### Message Flow
1. User sends a message in chat
2. Bot checks if it's a command (`/setword`, etc.)
   - If admin command → verify permissions
   - If secret word → check if configured
3. Bot checks if message contains secret word
   - If yes → check if user already won
   - If first time → record win and celebrate!
4. Bot reacts with 🎉 and sends congratulations

### Security
- ✅ Admin-only commands with permission checks
- ✅ One win per user (prevents spam)
- ✅ Per-space isolation (multi-space support)
- ✅ Bot message filtering (no infinite loops)
- ✅ Error handling on all operations

## 🎪 Example Game Flow

```
Admin: /setword moonshot
Bot: ✅ Secret word set! Users can now hunt for it! 🔍

Admin: /setprize 100 USDC
Bot: ✅ Prize set to: 100 USDC

User: I think this project will moonshot!
Bot: 🎊 WINNER! @User

Congratulations! You found the secret word! 🎉

🎁 Your Prize: 100 USDC

✨ An admin will now tip you your prize!
```

## 🔧 Technical Details

### Built With
- **Runtime**: Bun (recommended) or Node.js
- **Framework**: Towns Protocol SDK v0.0.321+
- **Database**: bun:sqlite (SQLite)
- **Server**: Hono + @hono/node-server
- **Language**: TypeScript

### Key Files
- `src/index.ts` - Main bot logic
- `bot.db` - SQLite database (created automatically)
- `.env` - Your bot credentials (never commit!)
- `package.json` - Dependencies

### Event Handlers
- `bot.onMessage()` - Detects commands and secret words
- `bot.onMentioned()` - Help system
- `bot.onChannelJoin()` - Welcome new users

## 🚀 Deployment to Render.com

1. **Push to GitHub**
```bash
git add .
git commit -m "Secret Word Hunt Bot ready"
git push origin main
```

2. **Create Render Service**
- Go to render.com
- New → Web Service
- Connect your repo
- Build: `npm install && npm run build`
- Start: `bun run start` (or `npm start` for Node.js)
- Add environment variables from `.env`

3. **Configure Webhook**
- Copy your Render URL: `https://your-bot.onrender.com`
- Go to Towns Developer Portal
- Add webhook: `https://your-bot.onrender.com/webhook`
- Enable message forwarding

4. **Install to Space**
- In Towns, go to your space
- Settings → Bots → Install Bot
- Find your bot and install it

## 🎮 Tips for Success

### Strategy Ideas
1. **Announce the Hunt** - Build hype before starting
2. **Drop Hints** - Help users find the word
3. **Time Limits** - Create urgency (reset weekly)
4. **Rotate Words** - Keep it fresh
5. **Fair Prizes** - Make it worth playing

### Community Engagement
- Share hints in announcements
- Let winners give clues
- Create themed hunts (holidays, events)
- Track participation with `/status`
- Celebrate each winner publicly

## 🆘 Troubleshooting

### Bot Won't Start
- Check `.env` has correct credentials
- Verify dependencies installed (`node_modules` exists)
- Check port 5123 isn't in use

### Commands Don't Work
- Run `/addadmin` first to set up admin
- Check spelling (case-sensitive!)
- Verify bot has proper permissions in Towns

### Secret Word Not Detected
- Use `/status` to verify word is set
- Word detection is case-insensitive
- Word must be complete match (not partial)

### User Won Multiple Times
- This shouldn't happen! Check database
- Winners table has unique constraint
- Try restarting bot

## 📚 Next Steps

### For Admins
1. Set up your first hunt
2. Promote it in your space
3. Monitor with `/status`
4. Reward winners promptly
5. Start new rounds regularly

### For Developers
1. Customize messages (edit `src/index.ts`)
2. Add features (use Cursor AI)
3. Integrate auto-tipping (advanced)
4. Add analytics
5. Multi-language support

---

**Your Secret Word Hunt Bot is ready! 🎯**

Get credentials from Towns Developer Portal, configure `.env`, and start engaging your community!

