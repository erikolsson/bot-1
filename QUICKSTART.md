# 🚀 Quick Start - Secret Word Hunt Bot

## ✅ Dependencies Installed!

All dependencies are now installed with Bun following the `.cursorrules`:

```
✅ Bun v1.2.23 installed
✅ @towns-protocol/bot v0.0.323 installed
✅ @towns-protocol/sdk v0.0.321 installed  
✅ @hono/node-server v1.19.5 installed
✅ hono v4.9.10 installed
✅ All TypeScript types installed
✅ Build completed successfully
```

## 🎯 Next Steps

### 1. Create Your `.env` File

```bash
cp .env.sample .env
```

Then edit `.env` and add your credentials from https://app.alpha.towns.com/developer:

```env
APP_PRIVATE_DATA_BASE64=your_actual_key_here
JWT_SECRET=your_actual_jwt_here
PORT=5123
```

### 2. Run the Bot

```bash
# Development mode (with auto-reload)
bun run dev

# Or build and run production
bun run build
bun run start
```

### 3. Set Up First Admin (in your Towns space)

Once the bot is running and connected:

```
/addadmin
```

This makes YOU the first admin! 🎉

### 4. Configure the Secret Word Hunt

```bash
/setword treasure           # Set the secret word
/setprize 100 USDC          # Set the prize
/setdescription Congrats! You found it! 🏴‍☠️  # Customize message
/status                     # Check configuration
```

### 5. Test It!

Say the word "treasure" in chat and watch the magic happen! ✨

## 🎮 Admin Commands

```bash
/addadmin              # First user becomes admin automatically
/addadmin @user        # Add another admin
/setword <word>        # Set the secret word
/setprize <prize>      # Set prize description
/setdescription <msg>  # Customize win message
/status                # View game configuration
```

## 📝 Important Notes

### Bun Configuration
- ✅ Uses `bun:sqlite` for database (optimal for Bun)
- ✅ Runtime: Bun v1.2.23
- ✅ All dependencies compatible with Bun
- ✅ Auto-reload in dev mode

### Database
The bot automatically creates `bot.db` with three tables:
- `secret_config` - Game settings per space
- `winners` - Winner tracking
- `admins` - Admin permissions

### Bot Behavior
- ✅ Filters its own messages (no infinite loops)
- ✅ One win per user (anti-spam)
- ✅ Multi-space support
- ✅ Case-insensitive word detection
- ✅ Emoji reactions on wins

## 🔧 Troubleshooting

### If Bun command not found in new terminal:
Add to your `~/.zshrc`:
```bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

Then restart terminal or run:
```bash
source ~/.zshrc
```

### If bot won't start:
1. Check `.env` has correct credentials
2. Verify port 5123 is available
3. Check logs for errors

### If commands don't work:
1. Run `/addadmin` first to become admin
2. Check bot is online in Towns
3. Verify webhook is configured

## 📚 Documentation

- `SETUP.md` - Complete setup guide
- `BOT_FEATURES.md` - Full feature documentation
- `README.md` - Overview and deployment guide
- `.cursorrules` - Bot development rules

## 🎯 Example Game Flow

```
Admin: /setword moonshot
Bot: ✅ Secret word set! Users can now hunt for it! 🔍

Admin: /setprize 50 USDC
Bot: ✅ Prize set to: 50 USDC

User: I think this will moonshot! 🚀
Bot: 🎊 WINNER! @User

Congratulations! You found the secret word! 🎉

🎁 Your Prize: 50 USDC

✨ An admin will now tip you your prize!
```

---

**Your bot is ready! Get your credentials and start the hunt! 🔍🎉**

