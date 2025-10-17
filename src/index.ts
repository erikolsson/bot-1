/**
 * 🤖 ULTIMATE TOWNS PROTOCOL BOT STARTER TEMPLATE
 * Production Ready | Render Optimized | VIBE CODING READY
 *
 * Perfect for AI-assisted development with Cursor + Claude/ChatGPT
 * All imports, functions, and patterns ready for AI agents to build upon
 *
 * ✅ DESIGNED FOR: Complete beginners using AI coding assistants
 * ✅ AI OPTIMIZED: Every function documented with usage examples
 * ✅ PRODUCTION READY: Based on proven patterns from working bots
 * ✅ RENDER OPTIMIZED: Configured for Render.com deployment
 * ✅ ALWAYS CURRENT: Run `bun run update-sdk` to get latest SDK features
 *
 * 🆕 LATEST SDK FEATURES:
 * • Slash Commands (/help, /ban, /stats) - Commented examples ready to enable
 * • Tip Handlers - Send/receive cryptocurrency tips on messages
 * • Permission System - Admin checks, ban/unban, permission validation
 * • External Integrations - Use bot methods outside handlers (webhooks, timers)
 * • Snapshot Data Access - Get channel/user/space membership info
 * • Complete SDK Reference - All latest features documented in comments
 */

// ===== CORE TOWNS PROTOCOL IMPORTS =====
import { makeTownsBot } from "@towns-protocol/bot";
import { isDMChannelStreamId, isGDMChannelStreamId } from "@towns-protocol/sdk";
// import { Permission } from '@towns-protocol/sdk'  // Uncomment for permission checks

// ===== WEB3 IMPORTS (for tips) =====
// import { parseEther } from 'viem'  // Uncomment for tip functionality

// ===== AI / OPENAI IMPORTS =====
import OpenAI from "openai";

// ===== SERVER AND UTILITIES =====
import { serve } from "@hono/node-server";
import { Hono } from "hono";

// ===== BOT COMMANDS (REQUIRED!) =====
import commands from "./commands.js";

// ===== OPTIONAL IMPORTS (uncomment as needed) =====
// import { readFileSync } from 'fs'           // For reading files
// import { join } from 'path'                 // For file paths

// ===== DATABASE SETUP (OPTIONAL - uncomment to use) =====
// const db = new Database('bot.db')
//
// // Initialize database tables
// db.run(`CREATE TABLE IF NOT EXISTS user_data (
//   user_id TEXT PRIMARY KEY,
//   space_id TEXT NOT NULL,
//   data TEXT,
//   created_at INTEGER DEFAULT (strftime('%s', 'now'))
// )`)
//
// console.log('🗄️ Database initialized')

// ===== ⚠️ CRITICAL: STATELESS ARCHITECTURE WARNING =====
/**
 * 🚨 MOST IMPORTANT CONCEPT: The bot framework is COMPLETELY STATELESS
 *
 * This means:
 * ❌ NO message history - Cannot retrieve previous messages
 * ❌ NO thread context - Only get threadId, not original message content
 * ❌ NO reply context - Only get replyId, not the message being replied to
 * ❌ NO conversation memory - Each webhook call is independent
 * ❌ NO user sessions - Cannot track users across events
 *
 * ✅ To store context, you MUST use:
 * - In-memory storage (Map/Set) - Fast, but lost on restart
 * - Database (SQLite/Postgres) - Persistent, survives restarts
 * - External storage (Redis) - Shared across instances
 *
 * Example patterns below show how to implement context storage!
 */

// ===== IN-MEMORY STORAGE (OPTIONAL - for context tracking) =====
// Uncomment these if you need to track message context, user workflows, etc.
// const messageCache = new Map<string, any>()    // Store messages for context
// const userWorkflows = new Map<string, any>()   // Track multi-step user interactions
// const threadContexts = new Map<string, any>()  // Track thread conversations

// ===== BOT CONFIGURATION =====
const config = {
  // Bot behavior settings (customize these!)
  respondToGM: true,
  respondToHello: true,
  welcomeNewUsers: true,

  // Add your custom settings here
  // maxMessagesPerMinute: 10,
  // requireVerification: false,
};

const IMAGE_KEYWORDS = ["image", "picture", "photo", "pic", "art", "gallery"];

// ===== ENVIRONMENT VARIABLE VALIDATION (CRITICAL!) =====
// Validate before bot initialization to catch errors early
if (!process.env.APP_PRIVATE_DATA) {
  console.error("❌ ERROR: APP_PRIVATE_DATA environment variable is not set!");
  console.error(
    "📝 Get your credentials from: https://app.alpha.towns.com/developer"
  );
  console.error("💡 Add them to Render environment variables in dashboard");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET environment variable is not set!");
  console.error(
    "📝 Get your credentials from: https://app.alpha.towns.com/developer"
  );
  console.error("💡 Add them to Render environment variables in dashboard");
  process.exit(1);
}

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ ERROR: OPENAI_API_KEY environment variable is not set!");
  console.error(
    "📝 Get your API key from: https://platform.openai.com/api-keys"
  );
  console.error("💡 Add it to your environment variables");
  process.exit(1);
}

// Clean the key (remove any whitespace/newlines)
const cleanPrivateKey = process.env.APP_PRIVATE_DATA.trim();

// Log validation info for debugging
console.log(`🔑 Validating credentials...`);
console.log(`   Private key length: ${cleanPrivateKey.length} characters`);
console.log(`   First 20 chars: ${cleanPrivateKey.substring(0, 20)}...`);

// ===== INITIALIZE OPENAI CLIENT =====
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log("🤖 OpenAI client initialized");

// ===== CREATE BOT INSTANCE =====
let bot;
try {
  bot = await makeTownsBot(
    cleanPrivateKey,
    process.env.JWT_SECRET,
    { commands } as any // Required for webhook verification! TypeScript types missing.
  );
} catch (error: any) {
  console.error("\n❌ ERROR: Failed to initialize bot!");
  console.error("📝 This usually means your APP_PRIVATE_DATA is:");
  console.error("   • Incomplete (copy-paste was cut off)");
  console.error("   • Has extra spaces or newlines");
  console.error("   • Wrong format or corrupted");
  console.error("\n💡 Solution:");
  console.error("   1. Go to https://app.alpha.towns.com/developer");
  console.error("   2. Copy the ENTIRE APP_PRIVATE_DATA value");
  console.error("   3. Make sure NO spaces/newlines at start or end");
  console.error("   4. Add it to Render environment variables");
  console.error(`\n🔍 Error details: ${error?.message || error}`);
  process.exit(1);
}

console.log("🤖 Ultimate Towns Bot starting...");
console.log("🎯 Bot ID:", bot.botId);

// ===== EVENT HANDLERS =====

/**
 * 📨 MESSAGE HANDLER - Triggered for ALL messages
 *
 * AI PROMPT EXAMPLES:
 * "Make the bot respond to 'wagmi' with 'WAGMI 🚀'"
 * "Add a response when someone says 'moon' - reply with rocket emojis"
 * "Make the bot count how many times users say specific words"
 */
bot.onMessage(async (handler, event) => {
  const { message, userId, channelId, isMentioned } = event;

  // 🚨 CRITICAL: Always skip bot's own messages (prevents infinite loops)
  if (userId === bot.botId) return;

  try {
    console.log(
      `💬 Message from ${userId.slice(0, 8)}...: ${message.substring(0, 50)}...`
    );

    // ===== HANDLE BOT MENTIONS =====
    // When someone @mentions the bot
    if (isMentioned) {
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("help") || lowerMessage.includes("info")) {
        await handler.sendMessage(
          channelId,
          `🤖 **Ultimate Towns Bot**

I respond to:
• GM / Good Morning → GM! ☀️
• GN / Good Night → Good night! 🌙  
• Hello/Hi/Hey → Hello! 👋

Mention me with "help" for this message.

*This bot is ready for AI customization!*`
        );
        return;
      }

      if (containsWords(lowerMessage, IMAGE_KEYWORDS)) {
        await handler.sendMessage(
          channelId,
          `Sending one over ${formatUser(userId)}!`,
          {
            attachments: [
              {
                type: "image",
                url: "https://towns-protocol-public.s3.us-west-2.amazonaws.com/examples/towns-bot-starter/wagmi.png",
                alt: "WAGMI rocket illustration",
              },
            ],
          }
        );
        return;
      }

      return;
    }

    // ===== DETECT MESSAGE TYPE (if needed) =====
    if (isDMChannelStreamId(channelId)) {
      console.log("📱 Direct message received");
      // Handle DM logic here
      // await handler.sendDm(userId, "Thanks for your DM!")
      return;
    }

    if (isGDMChannelStreamId(channelId)) {
      console.log("👥 Group DM received");
      // Handle group DM logic here
      return;
    }

    // ===== HANDLE REGULAR CHANNEL MESSAGES =====
    const lowerMessage = message.toLowerCase();

    // Greeting responses
    if (
      config.respondToGM &&
      (lowerMessage.includes("gm") || lowerMessage.includes("good morning"))
    ) {
      await handler.sendMessage(channelId, `GM <@${userId}>! ☀️`);
      console.log(`☀️ Responded to GM from ${userId.slice(0, 8)}...`);
    }

    if (lowerMessage.includes("gn") || lowerMessage.includes("good night")) {
      await handler.sendMessage(channelId, `Good night <@${userId}>! 🌙`);
      console.log(`🌙 Responded to GN from ${userId.slice(0, 8)}...`);
    }

    if (config.respondToHello && lowerMessage.match(/\b(hello|hi|hey)\b/)) {
      await handler.sendMessage(channelId, `Hello <@${userId}>! 👋`);
      console.log(`👋 Responded to greeting from ${userId.slice(0, 8)}...`);
    }

    // ===== ADD YOUR CUSTOM MESSAGE RESPONSES HERE =====
    // AI EXAMPLES:
    // if (lowerMessage.includes('wagmi')) {
    //   await handler.sendMessage(channelId, `WAGMI <@${userId}>! 🚀`)
    // }
    //
    // if (lowerMessage.includes('moon')) {
    //   await handler.sendReaction(channelId, eventId, '🚀')
    // }
  } catch (error) {
    console.error("❌ Error in message handler:", error);
  }
});

/**
 * 📢 MENTION HANDLER - Triggered when @bot is mentioned
 * NOTE: Modern approach uses onMessage with isMentioned check (shown above)
 *
 * AI PROMPT EXAMPLES:
 * "Add a @bot stats command that shows bot usage"
 * "Create a @bot help command with custom information"
 * "Add a @bot joke command that tells random jokes"
 */
// bot.onMentioned - DEPRECATED in v0.0.364, handled in onMessage below
/* bot.onMentioned(async (handler, { message, channelId, userId, spaceId, eventId }) => {
  const lowerMessage = message.toLowerCase()
  console.log(`📢 Bot mentioned by ${userId.slice(0, 8)}...: ${message}`)

  // ===== BUILT-IN COMMANDS =====
  if (lowerMessage.includes('help') || lowerMessage.includes('info')) {
    await handler.sendMessage(channelId, 
      `🤖 **Ultimate Towns Bot**

I respond to:
• GM / Good Morning → GM! ☀️
• GN / Good Night → Good night! 🌙  
• Hello/Hi/Hey → Hello! 👋

Mention me with "help" for this message.

*This bot is ready for AI customization!*`)
  } else {
    // Default response for unrecognized mentions
    await handler.sendMessage(channelId, `GM <@${userId}>! 👋 Mention me with "help" for more info!`)
  }

  // ===== ADD YOUR CUSTOM COMMANDS HERE =====
  // AI EXAMPLES:
  // if (lowerMessage.includes('stats')) {
  //   await handler.sendMessage(channelId, 'Bot stats: ...')
  // }
  //
  // if (lowerMessage.includes('joke')) {
  //   await handler.sendMessage(channelId, 'Why do programmers prefer dark mode? Because light attracts bugs! 🐛')
  // }
}) */

/**
 * 👥 USER JOIN HANDLER - Triggered when users join channels/spaces
 *
 * AI PROMPT EXAMPLES:
 * "Make the welcome message include server rules"
 * "Add a verification system where new users must react to verify"
 * "Create different welcome messages based on time of day"
 */
bot.onChannelJoin(async (handler, { userId, channelId, spaceId, eventId }) => {
  // Skip when bot joins channels
  if (userId === bot.botId) {
    console.log(`🤖 Bot joined channel: ${channelId.slice(0, 8)}...`);
    return;
  }

  console.log(
    `👥 User ${userId.slice(0, 8)}... joined ${channelId.slice(0, 8)}...`
  );

  // Welcome new users (customize this!)
  if (config.welcomeNewUsers) {
    await handler.sendMessage(
      channelId,
      `🎉 Welcome <@${userId}>! Say "GM" and I'll say it back! ☀️`
    );
  }

  // ===== ADD YOUR CUSTOM WELCOME LOGIC HERE =====
  // AI EXAMPLES:
  // await handler.sendMessage(channelId, `Welcome <@${userId}>! Please read our rules and react with ✅ to verify.`)
  //
  // Store user join in database:
  // db.run('INSERT OR IGNORE INTO user_data (user_id, space_id) VALUES (?, ?)', [userId, spaceId])
});

/**
 * 👍 REACTION HANDLER - Triggered when users react to messages
 *
 * AI PROMPT EXAMPLES:
 * "Make the bot thank users when they react with 👍 to bot messages"
 * "Add a verification system using ✅ reactions"
 * "Count reactions for user statistics"
 */
bot.onReaction(
  async (handler, { reaction, messageId, userId, channelId, spaceId }) => {
    console.log(
      `👍 Reaction ${reaction} from ${userId.slice(
        0,
        8
      )}... on message ${messageId.slice(0, 8)}...`
    );

    // ===== ADD YOUR CUSTOM REACTION LOGIC HERE =====
    // AI EXAMPLES:
    // if (reaction === '👍') {
    //   await handler.sendMessage(channelId, `Thanks for the thumbs up <@${userId}>!`)
    // }
    //
    // if (reaction === '✅') {
    //   // Verify user logic
    //   db.run('UPDATE user_data SET verified = 1 WHERE user_id = ?', [userId])
    //   await handler.sendMessage(channelId, `<@${userId}> verified! Welcome to the community!`)
    // }
  }
);

/**
 * ✏️ MESSAGE EDIT HANDLER - Triggered when messages are edited
 *
 * AI PROMPT EXAMPLES:
 * "Log all message edits for moderation purposes"
 * "Re-check edited messages for violations"
 */
bot.onMessageEdit(
  async (
    handler,
    { refEventId, message, userId, channelId, spaceId, eventId }
  ) => {
    console.log(
      `✏️ Message edited by ${userId.slice(0, 8)}...: ${message.substring(
        0,
        50
      )}...`
    );

    // ===== ADD YOUR CUSTOM EDIT LOGIC HERE =====
    // AI EXAMPLES:
    // Check edited message for violations
    // Log edit for audit trail
  }
);

/**
 * �� THREAD MESSAGE HANDLER - Triggered for messages in threads
 *
 * AI PROMPT EXAMPLES:
 * "Make the bot participate in thread conversations"
 * "Add context-aware responses in threads"
 */

// ===== SLASH COMMAND HANDLERS (uncomment to use) =====

/**
 * ⚡ SLASH COMMAND HANDLER - Triggered when users type /commands
 * SETUP REQUIRED:
 * 1. Add commands to src/commands.ts
 * 2. Sync: npx towns-bot update-commands src/commands.ts <bearer-token>
 *
 * AI PROMPT EXAMPLES:
 * "Add a /stats command showing bot statistics"
 * "Create a /poll command to create polls"
 * "Add a /help command with all available commands"
 */

// bot.onSlashCommand("help", async (handler, event) => {
//   const { channelId, userId } = event
//   await handler.sendMessage(channelId, `🤖 **Bot Commands**
//
// Available commands:
// • /help - Show this help message
// • /stats - Show bot statistics
//
// *More commands coming soon!*`)
// })

// bot.onSlashCommand("stats", async (handler, event) => {
//   await handler.sendMessage(event.channelId, `📊 **Bot Stats**
//
// • Uptime: ${process.uptime()} seconds
// • Bot ID: ${bot.botId}
//
// *Add your custom stats here!*`)
// })

// ===== ADMIN COMMANDS (uncomment to use) =====

/**
 * 🛡️ ADMIN COMMANDS - Permission-based moderation commands
 *
 * AI PROMPT EXAMPLES:
 * "Add a /ban command for admins to ban users"
 * "Create a /clean command to delete messages"
 * "Add a /mute command to timeout users"
 */

// bot.onSlashCommand("ban", async (handler, event) => {
//   // Check if user is admin
//   if (!await handler.hasAdminPermission(event.userId, event.spaceId)) {
//     await handler.sendMessage(event.channelId, "⛔ Admin only!")
//     return
//   }
//
//   const userToBan = event.mentions[0]?.userId || event.args[0]
//   if (!userToBan) {
//     await handler.sendMessage(event.channelId, "Usage: /ban @user or /ban <address>")
//     return
//   }
//
//   try {
//     await handler.ban(userToBan, event.spaceId)
//     await handler.sendMessage(event.channelId, `🚫 Banned user ${userToBan}`)
//   } catch (error: any) {
//     await handler.sendMessage(event.channelId, `Failed to ban: ${error.message}`)
//   }
// })

// bot.onSlashCommand("unban", async (handler, event) => {
//   if (!await handler.hasAdminPermission(event.userId, event.spaceId)) {
//     await handler.sendMessage(event.channelId, "⛔ Admin only!")
//     return
//   }
//
//   const userToUnban = event.args[0]
//   if (!userToUnban) {
//     await handler.sendMessage(event.channelId, "Usage: /unban <address>")
//     return
//   }
//
//   try {
//     await handler.unban(userToUnban, event.spaceId)
//     await handler.sendMessage(event.channelId, `✅ Unbanned user ${userToUnban}`)
//   } catch (error: any) {
//     await handler.sendMessage(event.channelId, `Failed to unban: ${error.message}`)
//   }
// })

// bot.onSlashCommand("clean", async (handler, event) => {
//   // Check if user has redaction permission
//   const canRedact = await handler.checkPermission(
//     event.channelId,
//     event.userId,
//     Permission.Redact
//   )
//
//   if (!canRedact) {
//     await handler.sendMessage(event.channelId, "⛔ You need Redact permission!")
//     return
//   }
//
//   // Delete the message being replied to
//   if (!event.replyId) {
//     await handler.sendMessage(event.channelId, "Reply to a message to delete it")
//     return
//   }
//
//   try {
//     await handler.adminRemoveEvent(event.channelId, event.replyId)
//     await handler.sendMessage(event.channelId, "🗑️ Message deleted")
//   } catch (error: any) {
//     await handler.sendMessage(event.channelId, `Failed to delete: ${error.message}`)
//   }
// })

// ===== TIP HANDLERS (uncomment to use) =====

/**
 * 💰 TIP HANDLERS - Cryptocurrency tipping functionality
 * REQUIRES: import { parseEther } from 'viem'
 *
 * AI PROMPT EXAMPLES:
 * "Make the bot tip helpful messages automatically"
 * "Add a /reward command to tip users"
 * "Thank users when they tip the bot"
 */

// bot.onTip(async (handler, event) => {
//   const { messageId, senderAddress, receiverAddress, amount, currency, channelId } = event
//
//   // Thank users who tip the bot
//   if (receiverAddress === bot.botId) {
//     const ethAmount = Number(amount) / 1e18
//     await handler.sendMessage(
//       channelId,
//       `🙏 Thank you <@${senderAddress}> for the ${ethAmount} ETH tip!`
//     )
//   }
// })

// // Auto-tip helpful messages
// bot.onMessage(async (handler, event) => {
//   if (event.userId === bot.botId) return
//
//   const helpfulKeywords = ['thanks', 'helpful', 'solved', 'great answer']
//   const isHelpful = helpfulKeywords.some(keyword =>
//     event.message.toLowerCase().includes(keyword)
//   )
//
//   if (isHelpful) {
//     try {
//       const { txHash } = await handler.tip({
//         to: event.userId,
//         amount: parseEther('0.001'), // 0.001 ETH
//         messageId: event.eventId,
//         channelId: event.channelId,
//       })
//       await handler.sendMessage(
//         event.channelId,
//         `💰 Tipped 0.001 ETH for being helpful! TX: ${txHash.slice(0, 10)}...`
//       )
//     } catch (error) {
//       console.error('Tip failed:', error)
//     }
//   }
// })

// ===== ADVANCED PATTERNS (see AGENTS.md for complete examples) =====

/**
 * 📚 For advanced bot patterns, see AGENTS.md:
 *
 * • Pattern 1: Contextual Responses (line 529-561)
 *   Store message context to provide intelligent replies
 *
 * • Pattern 2: Multi-Step Workflows (line 563-599)
 *   Track user state for forms, onboarding, configuration wizards
 *
 * • Pattern 3: Thread Conversations (line 601-647)
 *   Maintain context within thread discussions
 *
 * • External Integrations (line 1131-1259)
 *   GitHub webhooks, scheduled messages, health monitoring
 *   Bot methods work OUTSIDE handlers - call bot.sendMessage() from anywhere!
 *
 * • Storage Strategies (line 949-1031)
 *   In-memory vs Database - choose based on hosting environment
 */

// ===== ADDITIONAL EVENT HANDLERS (uncomment to use) =====

/**
 * 💬 REPLY HANDLER - When someone replies to bot messages
 */
// bot.onReply(async (handler, { message, userId, channelId, spaceId, eventId }) => {
//   console.log(`💬 Reply from ${userId.slice(0, 8)}...: ${message}`)
//   await handler.sendMessage(channelId, `Thanks for your reply <@${userId}>!`)
// })

/**
 * 🗑️ MESSAGE DELETION HANDLER - When messages are deleted
 */
// bot.onRedaction(async (handler, { refEventId, userId, channelId, spaceId, eventId }) => {
//   console.log(`🗑️ Message ${refEventId.slice(0, 8)}... was deleted`)
//   // Clean up any stored data for this message
//   // messageCache.delete(refEventId)
//   // threadContexts.delete(refEventId)
// })

/**
 * 👋 CHANNEL LEAVE HANDLER - When users leave
 */
// bot.onChannelLeave(async (handler, { userId, channelId, spaceId, eventId }) => {
//   console.log(`👋 User ${userId.slice(0, 8)}... left ${channelId.slice(0, 8)}...`)
// })

// ===== UTILITY FUNCTIONS FOR AI TO USE =====

/**
 * 🔧 Helper function to format user mentions
 * Usage: `Hello ${formatUser(userId)}!` → "Hello @user!"
 */
const formatUser = (userId: string) => `<@${userId}>`;

/**
 * 🔧 Helper function to shorten IDs for logging
 * Usage: `console.log(shortId(userId))` → "0x1234...abcd"
 */
const shortId = (id: string) => `${id.slice(0, 6)}...${id.slice(-4)}`;

/**
 * 🔧 Helper function to check if message contains specific words
 * Usage: `if (containsWords(message, ['hello', 'hi'])) { ... }`
 */
const containsWords = (message: string, words: string[]) => {
  const lowerMessage = message.toLowerCase();
  return words.some((word) => lowerMessage.includes(word.toLowerCase()));
};

// ===== DATABASE HELPER FUNCTIONS (uncomment to use) =====
/*
const saveUserData = (userId: string, spaceId: string, data: any) => {
  db.run('INSERT OR REPLACE INTO user_data (user_id, space_id, data) VALUES (?, ?, ?)', 
    [userId, spaceId, JSON.stringify(data)])
}

const getUserData = (userId: string, spaceId: string) => {
  const result = db.query('SELECT data FROM user_data WHERE user_id = ? AND space_id = ?')
    .get(userId, spaceId) as {data: string} | undefined
  return result ? JSON.parse(result.data) : null
}

const countUserMessages = (userId: string, spaceId: string) => {
  const result = db.query('SELECT COUNT(*) as count FROM user_data WHERE user_id = ? AND space_id = ?')
    .get(userId, spaceId) as {count: number}
  return result.count
}
*/

// ===== MAIN BOT LOGIC =====

// Simple greeting responses (customize or expand!)
bot.onMessage(async (handler, event) => {
  const { message, userId, channelId, isMentioned } = event;

  // 🚨 CRITICAL: Always skip bot's own messages
  if (userId === bot.botId) return;

  try {
    const lowerMessage = message.toLowerCase();

    // ===== HANDLE BOT MENTIONS =====
    if (isMentioned) {
      // Use OpenAI to interpret user intent
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful trading bot assistant. Analyze the user's message and determine their intent.

Respond with a JSON object containing:
{
  "intent": "setup" | "trade" | "chat" | "help",
  "response": "A friendly, personality-filled response message",
  "includeCommand": true/false
}

Intent guidelines:
- "setup": User wants to set up their Hyperliquid account (keywords: setup, configure, connect, initialize account)
- "trade": User wants to make a trade (keywords: buy, sell, long, short, leverage, 10x, 20x, 100x, trade, position)
- "help": User explicitly asks for help or commands
- "chat": General conversation, questions, or anything else

For "setup" intent:
- response should be friendly and helpful about setting up their account
- includeCommand should be true

For "trade" intent:
- response should be funny/bold/personality-filled (like "oh wow balls of steel you crazy idiot" vibes)
- includeCommand should be true

For "chat" or "help" intent:
- response should be conversational and helpful
- includeCommand should be false`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");

      // Build the response message
      let responseMessage = result.response || "Hey there! How can I help you?";

      // Add command trigger if needed
      if (result.includeCommand) {
        if (result.intent === "setup") {
          responseMessage += "\n\nhyperliquid-setup";
        } else if (result.intent === "trade") {
          responseMessage += "\n\nhyperliquid-trade";
        }
      }

      await handler.sendMessage(channelId, responseMessage);
      return;
    }

    // ===== BASIC GREETING RESPONSES =====
    if (lowerMessage.includes("gm") || lowerMessage.includes("good morning")) {
      await handler.sendMessage(channelId, `GM ${formatUser(userId)}! ☀️`);
    }
  } catch (error) {
    console.error("❌ Error in message handler:", error);
    // Fallback response on error
    await handler.sendMessage(
      channelId,
      "Oops, something went wrong processing your message! Try again?"
    );
  }
});

// Welcome new users
bot.onChannelJoin(async (handler, { userId, channelId }) => {
  if (userId === bot.botId) return;

  if (config.welcomeNewUsers) {
    await handler.sendMessage(
      channelId,
      `🎉 Welcome ${formatUser(userId)}! Say "GM" and I'll say it back! ☀️`
    );
  }
});

// ===== SERVER SETUP =====
const { jwtMiddleware, handler } = await bot.start();

const app = new Hono();

// Request logging middleware (helpful for debugging)
app.use("*", async (c, next) => {
  const start = Date.now();
  console.log(`📥 ${c.req.method} ${c.req.path}`);
  await next();
  const ms = Date.now() - start;
  console.log(`✅ ${c.req.method} ${c.req.path} - ${ms}ms - ${c.res.status}`);
});

// Webhook endpoint for Towns Protocol
app.post("/webhook", jwtMiddleware, handler);

// Health check endpoint
app.get("/health", (c) =>
  c.json({
    status: "ok",
    bot: "Ultimate Towns Bot",
    timestamp: Date.now(),
    botId: bot.botId,
  })
);

// Root endpoint
app.get("/", (c) =>
  c.json({
    bot: "Ultimate Towns Bot",
    status: "running",
    botId: bot.botId,
    endpoints: {
      webhook: "/webhook",
      health: "/health",
    },
  })
);

// Start server
const port = process.env.PORT || 5123;
serve({
  fetch: app.fetch,
  port: Number(port),
});

console.log(`🚀 Ultimate Towns Bot running on port ${port}`);
console.log(`🤖 Bot ID: ${bot.botId}`);
console.log(`✨ Ready for AI-assisted customization with Cursor!`);
console.log(`\n🌐 Server URLs:`);

// Detect deployment environment
const isRender =
  process.env.RENDER === "true" || process.env.RENDER_EXTERNAL_URL;
if (isRender) {
  const renderUrl = process.env.RENDER_EXTERNAL_URL || "your-render-url";
  console.log(`   🔗 Webhook: ${renderUrl}/webhook`);
  console.log(`   💊 Health:  ${renderUrl}/health`);
  console.log(`   📍 Deployed on Render.com`);
} else {
  console.log(`   🔗 Webhook: http://localhost:${port}/webhook`);
  console.log(`   💊 Health:  http://localhost:${port}/health`);
  console.log(`   📍 Running locally for testing`);
}

console.log(`\n💡 Configure webhook in Towns Developer Portal`);
console.log(`   https://app.alpha.towns.com/developer`);

// ===== COMPLETE SDK FUNCTION REFERENCE FOR AI =====
/*

🎯 ULTIMATE FUNCTION REFERENCE FOR AI AGENTS (Latest SDK)

=== MESSAGE FUNCTIONS ===
await handler.sendMessage(channelId, "Hello!")                              // Send to channel
await handler.sendMessage(channelId, "Reply", { threadId })                 // Send in thread
await handler.sendMessage(channelId, "Reply", { replyId })                  // Reply to message
await handler.sendMessage(channelId, "With image", {                        // Send with attachments
  attachments: [{ type: 'image', url: 'https://...', alt: 'description' }]
})
await handler.sendDm(userId, "Private message")                             // Direct message
await handler.editMessage(channelId, messageId, "New text")                 // Edit bot's message
await handler.removeEvent(channelId, messageId)                             // Delete bot's message
await handler.adminRemoveEvent(channelId, messageId)                        // Delete user's message (needs Permission.Redact)

=== REACTION FUNCTIONS ===
await handler.sendReaction(channelId, messageId, "👍")                     // Add reaction
await handler.sendReaction(channelId, messageId, "❤️")                     // Heart reaction
await handler.sendReaction(channelId, messageId, "white_check_mark")       // ✅ reaction

=== PERMISSION & MODERATION FUNCTIONS (NEW!) ===
await handler.hasAdminPermission(userId, spaceId)                           // Check if user is admin
await handler.checkPermission(channelId, userId, Permission.Redact)         // Check specific permission
await handler.ban(userId, spaceId)                                          // Ban user (requires ModifyBanning)
await handler.unban(userId, spaceId)                                        // Unban user (requires ModifyBanning)

// Available Permission constants:
// Permission.Read, Permission.Write, Permission.Redact, Permission.React
// Permission.ModifyBanning, Permission.PinMessage, Permission.AddRemoveChannels
// Permission.ModifySpaceSettings, Permission.Invite, Permission.JoinSpace

=== TIP FUNCTIONS (NEW! - requires viem) ===
await handler.tip({                                                         // Send cryptocurrency tip
  to: userAddress,
  amount: parseEther('0.001'),
  messageId: eventId,
  channelId: channelId,
  currency: '0x...' // optional, defaults to ETH
})
// Returns: { txHash: string, eventId: string }

=== BOT METHODS (can be called directly, not just in handlers!) ===
await bot.sendMessage(channelId, message, opts?)                           // Send from anywhere
await bot.sendReaction(channelId, messageId, reaction)                     // React from anywhere
await bot.editMessage(channelId, messageId, newMessage)                    // Edit from anywhere
await bot.removeEvent(channelId, eventId)                                  // Delete from anywhere
await bot.hasAdminPermission(userId, spaceId)                              // Check permission from anywhere
console.log(bot.botId)                                                     // Get bot's address

// Use cases: External webhooks, scheduled tasks, health monitoring
// Example: app.post('/github-webhook', async (c) => { 
//   await bot.sendMessage(channelId, "New PR opened!") 
// })

=== SNAPSHOT DATA ACCESS (NEW!) ===
await bot.snapshot.getChannelInception(channelId)                          // Get channel settings
await bot.snapshot.getUserMemberships(userId)                              // Get user memberships
await bot.snapshot.getSpaceMemberships(spaceId)                            // Get space members

=== EVENT HANDLER SIGNATURES ===
bot.onMessage(async (handler, event) => {})
  // event: { message, userId, channelId, spaceId, eventId, isMentioned, threadId?, replyId?, mentions, attachments }

bot.onSlashCommand("commandName", async (handler, event) => {})            // NEW!
  // event: { command, args, userId, channelId, spaceId, mentions, replyId?, threadId? }

bot.onTip(async (handler, event) => {})                                    // NEW!
  // event: { messageId, senderAddress, receiverAddress, amount, currency, channelId }

bot.onReaction(async (handler, event) => {})
  // event: { reaction, messageId, userId, channelId, spaceId }

bot.onChannelJoin(async (handler, event) => {})
  // event: { userId, channelId, spaceId, eventId }

bot.onChannelLeave(async (handler, event) => {})
  // event: { userId, channelId, spaceId, eventId }

bot.onMessageEdit(async (handler, event) => {})
  // event: { refEventId, message, userId, channelId, spaceId, eventId, isMentioned, mentions }

bot.onRedaction(async (handler, event) => {})
  // event: { refEventId, userId, channelId, spaceId, eventId }

=== UTILITY FUNCTIONS ===
isChannelStreamId(streamId)                // Check if public channel
isDMChannelStreamId(streamId)              // Check if direct message
isGDMChannelStreamId(streamId)             // Check if group DM
isDefaultChannelId(channelId)              // Check if default channel

=== DATABASE PATTERNS (Bun SQLite) ===
db.run('INSERT INTO table VALUES (?, ?)', [param1, param2])                // Insert data
db.query('SELECT * FROM table WHERE id = ?').get(param)                    // Get single row
db.query('SELECT * FROM table WHERE id = ?').all(param)                    // Get all rows
// IMPORTANT: Use db.run() NOT db.exec()

=== HELPER FUNCTIONS IN THIS FILE ===
formatUser(userId)                         // Returns: <@userId> for mentions
shortId(id)                               // Returns: shortened ID for logging
containsWords(message, ['word1', 'word2']) // Check if message contains any words

=== CRITICAL PATTERNS ===
// 1. Always filter bot's own messages
// if (userId === bot.botId) return

// 2. Always use try-catch in handlers
// try { handler code } catch (error) { console.error(error) }

// 3. Check permissions before admin actions
// if (!await handler.hasAdminPermission(userId, spaceId)) return

// 4. Slash commands never trigger onMessage (mutually exclusive)

// 5. Store channel IDs for external integrations
// Example:
// let notificationChannelId: string | null = null
// bot.onSlashCommand("setup-here", async (handler, event) => {
//   notificationChannelId = event.channelId
// })

=== QUICK REFERENCES ===

📚 Complete Documentation: See AGENTS.md and COMPLETE_KNOWLEDGE_BASE.md

🔧 Troubleshooting: AGENTS.md lines 1296-1341
  • Bot not responding? Check credentials & webhook URL
  • Lost context? Use persistent storage (Map/Database)
  • Slash commands? Sync with: npx towns-bot update-commands src/commands.ts <token>

💾 Storage Guide: AGENTS.md lines 949-1031
  • Always-On VPS → Map/Set or SQLite (fast)
  • Free Tier → SQLite or Turso (persists through restarts)
  • Production → Redis or PostgreSQL (scalable)

🎨 AI Vibe Coding Prompts:
  • "Add a bot response when users say X"
  • "Create a /command that does Y"
  • "Make it admin-only by checking permissions"
  • "Reward users who say X with 0.001 ETH"

⚡ Quick Commands:
  bun install           # Install dependencies
  bun run build         # Build for production
  bun run start         # Run production build

*/
