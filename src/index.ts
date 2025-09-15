/**
 * 🤖 ULTIMATE TOWNS PROTOCOL BOT STARTER TEMPLATE
 * 
 * Perfect for AI-assisted development with Cursor + Claude/ChatGPT
 * All imports, functions, and patterns ready for AI agents to build upon
 * 
 * DESIGNED FOR: Complete beginners using AI coding assistants
 * AI OPTIMIZED: Every function documented with usage examples
 * PRODUCTION READY: Based on proven patterns from working bots
 */

// ===== CORE TOWNS PROTOCOL IMPORTS =====
import { makeTownsBot } from '@towns-protocol/bot'
import { 
  isChannelStreamId,
  isDMChannelStreamId, 
  isGDMChannelStreamId,
  isDefaultChannelId
} from '@towns-protocol/sdk'
import { MembershipOp } from '@towns-protocol/proto'

// ===== SERVER AND UTILITIES =====
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { Database } from 'bun:sqlite'

// ===== OPTIONAL IMPORTS (uncomment as needed) =====
// import { readFileSync } from 'fs'           // For reading files
// import { join } from 'path'                 // For file paths

// ===== DATABASE SETUP (OPTIONAL - uncomment to use) =====
// Uncomment these lines if you want to store data
/*
const db = new Database('bot.db')

// Initialize database tables
db.run(`CREATE TABLE IF NOT EXISTS user_data (
  user_id TEXT PRIMARY KEY,
  space_id TEXT NOT NULL,
  data TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
)`)

console.log('🗄️ Database initialized')
*/

// ===== BOT CONFIGURATION =====
const config = {
  // Bot behavior settings (customize these!)
  respondToGM: true,
  respondToHello: true,
  welcomeNewUsers: true,
  
  // Add your custom settings here
  // maxMessagesPerMinute: 10,
  // requireVerification: false,
}

// ===== CREATE BOT INSTANCE =====
const bot = await makeTownsBot(
  process.env.APP_PRIVATE_DATA_BASE64!,
  process.env.JWT_SECRET!
)

console.log('🤖 Ultimate Towns Bot starting...')
console.log('🎯 Bot ID:', bot.botId)

// ===== EVENT HANDLERS =====

/**
 * 📨 MESSAGE HANDLER - Triggered for ALL messages
 * 
 * AI PROMPT EXAMPLES:
 * "Make the bot respond to 'wagmi' with 'WAGMI 🚀'"
 * "Add a response when someone says 'moon' - reply with rocket emojis"
 * "Make the bot count how many times users say specific words"
 */
bot.onMessage(async (handler, { message, userId, channelId, spaceId, eventId, isDm, isGdm }) => {
  // 🚨 CRITICAL: Always skip bot's own messages (prevents infinite loops)
  if (userId === bot.botId) return

  console.log(`💬 Message from ${userId.slice(0, 8)}...: ${message.substring(0, 50)}...`)

  // Detect message type for different handling
  if (isDm) {
    console.log('📱 Direct message received')
    // Handle DM logic here
    // await handler.sendDm(userId, "Thanks for your DM!")
    return
  }
  
  if (isGdm) {
    console.log('👥 Group DM received')
    // Handle group DM logic here
    return
  }

  // Handle regular channel messages
  const lowerMessage = message.toLowerCase()

  // ===== GREETING RESPONSES (customize these!) =====
  if (config.respondToGM && (lowerMessage.includes('gm') || lowerMessage.includes('good morning'))) {
    await handler.sendMessage(channelId, `GM <@${userId}>! ☀️`)
    console.log(`☀️ Responded to GM from ${userId.slice(0, 8)}...`)
  }

  if (lowerMessage.includes('gn') || lowerMessage.includes('good night')) {
    await handler.sendMessage(channelId, `Good night <@${userId}>! 🌙`)
    console.log(`🌙 Responded to GN from ${userId.slice(0, 8)}...`)
  }

  if (config.respondToHello && lowerMessage.match(/\b(hello|hi|hey)\b/)) {
    await handler.sendMessage(channelId, `Hello <@${userId}>! 👋`)
    console.log(`👋 Responded to greeting from ${userId.slice(0, 8)}...`)
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
})

/**
 * 📢 MENTION HANDLER - Triggered when @bot is mentioned
 * 
 * AI PROMPT EXAMPLES:
 * "Add a @bot stats command that shows bot usage"
 * "Create a @bot help command with custom information"
 * "Add a @bot joke command that tells random jokes"
 */
bot.onMentioned(async (handler, { message, channelId, userId, spaceId, eventId }) => {
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
})

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
    console.log(`🤖 Bot joined channel: ${channelId.slice(0, 8)}...`)
    return
  }

  console.log(`👥 User ${userId.slice(0, 8)}... joined ${channelId.slice(0, 8)}...`)

  // Welcome new users (customize this!)
  if (config.welcomeNewUsers) {
    await handler.sendMessage(channelId, `🎉 Welcome <@${userId}>! Say "GM" and I'll say it back! ☀️`)
  }

  // ===== ADD YOUR CUSTOM WELCOME LOGIC HERE =====
  // AI EXAMPLES:
  // await handler.sendMessage(channelId, `Welcome <@${userId}>! Please read our rules and react with ✅ to verify.`)
  // 
  // Store user join in database:
  // db.run('INSERT OR IGNORE INTO user_data (user_id, space_id) VALUES (?, ?)', [userId, spaceId])
})

/**
 * 👍 REACTION HANDLER - Triggered when users react to messages
 * 
 * AI PROMPT EXAMPLES:
 * "Make the bot thank users when they react with 👍 to bot messages"
 * "Add a verification system using ✅ reactions"
 * "Count reactions for user statistics"
 */
bot.onReaction(async (handler, { reaction, messageId, userId, channelId, spaceId }) => {
  console.log(`👍 Reaction ${reaction} from ${userId.slice(0, 8)}... on message ${messageId.slice(0, 8)}...`)

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
})

/**
 * ✏️ MESSAGE EDIT HANDLER - Triggered when messages are edited
 * 
 * AI PROMPT EXAMPLES:
 * "Log all message edits for moderation purposes"
 * "Re-check edited messages for violations"
 */
bot.onMessageEdit(async (handler, { refEventId, message, userId, channelId, spaceId, eventId }) => {
  console.log(`✏️ Message edited by ${userId.slice(0, 8)}...: ${message.substring(0, 50)}...`)
  
  // ===== ADD YOUR CUSTOM EDIT LOGIC HERE =====
  // AI EXAMPLES:
  // Check edited message for violations
  // Log edit for audit trail
})

/**
 * �� THREAD MESSAGE HANDLER - Triggered for messages in threads
 * 
 * AI PROMPT EXAMPLES:
 * "Make the bot participate in thread conversations"
 * "Add context-aware responses in threads"
 */
bot.onThreadMessage(async (handler, { threadId, message, userId, channelId, spaceId, eventId }) => {
  if (userId === bot.botId) return
  
  console.log(`🧵 Thread message from ${userId.slice(0, 8)}... in thread ${threadId.slice(0, 8)}...`)
  
  // ===== ADD YOUR CUSTOM THREAD LOGIC HERE =====
  // AI EXAMPLES:
  // Respond in threads with context
  // await handler.sendMessage(channelId, "Thread response", { threadId })
})

/**
 * 📢 THREAD MENTION HANDLER - Triggered when @bot is mentioned in threads
 */
bot.onMentionedInThread(async (handler, { threadId, message, userId, channelId, spaceId, eventId }) => {
  console.log(`📢 Bot mentioned in thread by ${userId.slice(0, 8)}...`)
  
  // Respond in the thread
  await handler.sendMessage(channelId, `Hello <@${userId}>! 👋`, { threadId })
})

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
const formatUser = (userId: string) => `<@${userId}>`

/**
 * 🔧 Helper function to shorten IDs for logging
 * Usage: `console.log(shortId(userId))` → "0x1234...abcd"
 */
const shortId = (id: string) => `${id.slice(0, 6)}...${id.slice(-4)}`

/**
 * 🔧 Helper function to check if message contains specific words
 * Usage: `if (containsWords(message, ['hello', 'hi'])) { ... }`
 */
const containsWords = (message: string, words: string[]) => {
  const lowerMessage = message.toLowerCase()
  return words.some(word => lowerMessage.includes(word.toLowerCase()))
}

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
bot.onMessage(async (handler, { message, userId, channelId }) => {
  if (userId === bot.botId) return

  const lowerMessage = message.toLowerCase()

  // Basic greeting responses
  if (lowerMessage.includes('gm') || lowerMessage.includes('good morning')) {
    await handler.sendMessage(channelId, `GM ${formatUser(userId)}! ☀️`)
  }
})

// Bot mention responses
bot.onMentioned(async (handler, { message, channelId }) => {
  if (message.toLowerCase().includes('help')) {
    await handler.sendMessage(channelId, `🤖 **Ultimate Towns Bot**

I'm ready for AI customization! Ask your AI assistant to add features.

Current features:
• Responds to GM with GM back
• This help command

*Use Cursor + Claude to add unlimited features!*`)
  } else {
    await handler.sendMessage(channelId, `Hello! 👋 Mention me with "help" for info.`)
  }
})

// Welcome new users
bot.onChannelJoin(async (handler, { userId, channelId }) => {
  if (userId === bot.botId) return
  
  await handler.sendMessage(channelId, `🎉 Welcome ${formatUser(userId)}! Say "GM" to test the bot!`)
})

// ===== SERVER SETUP =====
const { jwtMiddleware, handler } = await bot.start()

const app = new Hono()

// Webhook endpoint for Towns Protocol
app.post('/webhook', jwtMiddleware, handler)

// Health check endpoint
app.get('/health', (c) => c.json({ 
  status: 'ok',
  bot: 'Ultimate Towns Bot Starter',
  timestamp: Date.now(),
  features: Object.keys(config)
}))

// Start server
const port = process.env.PORT || 5123
serve({
  fetch: app.fetch,
  port: Number(port)
})

console.log(`🚀 Ultimate Towns Bot running on port ${port}`)
console.log(`🔗 Webhook: http://localhost:${port}/webhook`)
console.log(`💊 Health: http://localhost:${port}/health`)
console.log(`🤖 Bot ID: ${bot.botId}`)
console.log(`✨ Ready for AI-assisted customization with Cursor!`)

// ===== AVAILABLE HANDLER FUNCTIONS FOR AI TO USE =====
/*

COMPLETE FUNCTION REFERENCE FOR AI AGENTS:

=== MESSAGE FUNCTIONS ===
await handler.sendMessage(channelId, "Hello!")                    // Send to channel
await handler.sendMessage(channelId, "Reply", { threadId })       // Send in thread
await handler.sendMessage(channelId, "Reply", { replyId })        // Reply to message
await handler.sendDm(userId, "Private message")                   // Direct message
await handler.editMessage(channelId, messageId, "New text")       // Edit bot's message
await handler.removeEvent(channelId, messageId)                   // Delete bot's message
await handler.adminRemoveEvent(channelId, messageId)              // Delete user's message

=== REACTION FUNCTIONS ===
await handler.sendReaction(channelId, messageId, "👍")           // Add reaction
await handler.sendReaction(channelId, messageId, "❤️")           // Heart reaction
await handler.sendReaction(channelId, messageId, "white_check_mark") // ✅ reaction

=== BOT IDENTITY FUNCTIONS ===
await handler.setUsername(channelId, "MyBot")                    // Set bot username
await handler.setDisplayName(channelId, "🤖 My Bot")             // Set display name

=== USER DATA FUNCTIONS ===
await handler.getUserData(channelId, userId)                     // Get user info (deprecated)

=== EVENT HANDLER SIGNATURES ===
bot.onMessage(async (handler, { message, userId, channelId, spaceId, eventId, isDm, isGdm }) => {})
bot.onMentioned(async (handler, { message, userId, channelId, spaceId, eventId }) => {})
bot.onReaction(async (handler, { reaction, messageId, userId, channelId, spaceId }) => {})
bot.onChannelJoin(async (handler, { userId, channelId, spaceId, eventId }) => {})
bot.onChannelLeave(async (handler, { userId, channelId, spaceId, eventId }) => {})
bot.onReply(async (handler, { message, userId, channelId, spaceId, eventId }) => {})
bot.onThreadMessage(async (handler, { threadId, message, userId, channelId, spaceId, eventId }) => {})
bot.onMentionedInThread(async (handler, { threadId, message, userId, channelId, spaceId, eventId }) => {})
bot.onMessageEdit(async (handler, { refEventId, message, userId, channelId, spaceId, eventId }) => {})
bot.onRedaction(async (handler, { refEventId, userId, channelId, spaceId, eventId }) => {})

=== UTILITY FUNCTIONS ===
isChannelStreamId(streamId)     // Check if public channel
isDMChannelStreamId(streamId)   // Check if direct message
isGDMChannelStreamId(streamId)  // Check if group DM
isDefaultChannelId(channelId)   // Check if default channel

=== DATABASE PATTERNS (if using database) ===
db.run('INSERT INTO table VALUES (?, ?)', [param1, param2])      // Insert data
db.query('SELECT * FROM table WHERE id = ?').get(param)          // Get single row
db.query('SELECT * FROM table WHERE id = ?').all(param)          // Get all rows

*/
