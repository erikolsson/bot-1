/**
 * 🤖 ULTIMATE TOWNS PROTOCOL BOT STARTER TEMPLATE
 * SDK v0.0.364+ | Production Ready | Render Optimized
 * 
 * Perfect for AI-assisted development with Cursor + Claude/ChatGPT
 * All imports, functions, and patterns ready for AI agents to build upon
 * 
 * ✅ DESIGNED FOR: Complete beginners using AI coding assistants
 * ✅ AI OPTIMIZED: Every function documented with usage examples
 * ✅ PRODUCTION READY: Based on proven patterns from working bots
 * ✅ RENDER OPTIMIZED: Configured for Render.com deployment
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

// ===== BOT COMMANDS (REQUIRED!) =====
import commands from './commands.js'

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

// ===== ENVIRONMENT VARIABLE VALIDATION (CRITICAL!) =====
// Validate before bot initialization to catch errors early
if (!process.env.APP_PRIVATE_DATA) {
  console.error('❌ ERROR: APP_PRIVATE_DATA environment variable is not set!')
  console.error('📝 Get your credentials from: https://app.alpha.towns.com/developer')
  console.error('💡 Add them to Render environment variables in dashboard')
  process.exit(1)
}

if (!process.env.JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET environment variable is not set!')
  console.error('📝 Get your credentials from: https://app.alpha.towns.com/developer')
  console.error('💡 Add them to Render environment variables in dashboard')
  process.exit(1)
}

// Clean the key (remove any whitespace/newlines)
const cleanPrivateKey = process.env.APP_PRIVATE_DATA.trim()

// Log validation info for debugging
console.log(`🔑 Validating credentials...`)
console.log(`   Private key length: ${cleanPrivateKey.length} characters`)
console.log(`   First 20 chars: ${cleanPrivateKey.substring(0, 20)}...`)

// ===== CREATE BOT INSTANCE =====
let bot
try {
  bot = await makeTownsBot(
    cleanPrivateKey,
    process.env.JWT_SECRET,
    { commands } as any // Required for webhook verification! TypeScript types missing.
  )
} catch (error: any) {
  console.error('\n❌ ERROR: Failed to initialize bot!')
  console.error('📝 This usually means your APP_PRIVATE_DATA is:')
  console.error('   • Incomplete (copy-paste was cut off)')
  console.error('   • Has extra spaces or newlines')
  console.error('   • Wrong format or corrupted')
  console.error('\n💡 Solution:')
  console.error('   1. Go to https://app.alpha.towns.com/developer')
  console.error('   2. Copy the ENTIRE APP_PRIVATE_DATA value')
  console.error('   3. Make sure NO spaces/newlines at start or end')
  console.error('   4. Add it to Render environment variables')
  console.error(`\n🔍 Error details: ${error?.message || error}`)
  process.exit(1)
}

console.log('🤖 Ultimate Towns Bot starting...')
console.log('🎯 Bot ID:', bot.botId)

// ===== EVENT HANDLERS =====

/**
 * 📨 MESSAGE HANDLER - Triggered for ALL messages (SDK v0.0.364+)
 * 
 * AI PROMPT EXAMPLES:
 * "Make the bot respond to 'wagmi' with 'WAGMI 🚀'"
 * "Add a response when someone says 'moon' - reply with rocket emojis"
 * "Make the bot count how many times users say specific words"
 */
bot.onMessage(async (handler, event) => {
  const { message, userId, channelId, spaceId, eventId, isMentioned, threadId } = event
  
  // 🚨 CRITICAL: Always skip bot's own messages (prevents infinite loops)
  if (userId === bot.botId) return

  try {
  console.log(`💬 Message from ${userId.slice(0, 8)}...: ${message.substring(0, 50)}...`)

    // ===== HANDLE BOT MENTIONS (SDK v0.0.364+) =====
    // When someone @mentions the bot
    if (isMentioned) {
      const lowerMessage = message.toLowerCase()
      
      if (lowerMessage.includes('help') || lowerMessage.includes('info')) {
        await handler.sendMessage(channelId, 
          `🤖 **Ultimate Towns Bot**

I respond to:
• GM / Good Morning → GM! ☀️
• GN / Good Night → Good night! 🌙  
• Hello/Hi/Hey → Hello! 👋

Mention me with "help" for this message.

*This bot is ready for AI customization!*`)
        return
      }
      
      // Default mention response
      await handler.sendMessage(channelId, `GM <@${userId}>! 👋 Mention me with "help" for more info!`)
      return
    }

    // ===== DETECT MESSAGE TYPE (if needed) =====
    if (isDMChannelStreamId(channelId)) {
    console.log('📱 Direct message received')
    // Handle DM logic here
    // await handler.sendDm(userId, "Thanks for your DM!")
    return
  }
  
    if (isGDMChannelStreamId(channelId)) {
    console.log('👥 Group DM received')
    // Handle group DM logic here
    return
  }

    // ===== HANDLE REGULAR CHANNEL MESSAGES =====
  const lowerMessage = message.toLowerCase()

    // Greeting responses
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
    
  } catch (error) {
    console.error('❌ Error in message handler:', error)
  }
})

/**
 * 📢 MENTION HANDLER - Triggered when @bot is mentioned
 * NOTE: onMentioned removed in SDK v0.0.364 - use onMessage with isMentioned check instead
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
bot.onMessage(async (handler, event) => {
  const { message, userId, channelId, isMentioned } = event
  
  // 🚨 CRITICAL: Always skip bot's own messages
  if (userId === bot.botId) return

  try {
    const lowerMessage = message.toLowerCase()

    // ===== HANDLE BOT MENTIONS (SDK v0.0.364+) =====
    if (isMentioned) {
      if (lowerMessage.includes('help')) {
        await handler.sendMessage(channelId, `🤖 **Ultimate Towns Bot**

I'm ready for AI customization! Ask your AI assistant to add features.

Current features:
• Responds to GM with GM back
• This help command

*Use Cursor + Claude to add unlimited features!*`)
        return
      }
      
      await handler.sendMessage(channelId, `Hello! 👋 Mention me with "help" for info.`)
      return
    }

    // ===== BASIC GREETING RESPONSES =====
    if (lowerMessage.includes('gm') || lowerMessage.includes('good morning')) {
      await handler.sendMessage(channelId, `GM ${formatUser(userId)}! ☀️`)
    }
    
  } catch (error) {
    console.error('❌ Error in message handler:', error)
  }
})

// Welcome new users
bot.onChannelJoin(async (handler, { userId, channelId }) => {
  if (userId === bot.botId) return
  
  if (config.welcomeNewUsers) {
    await handler.sendMessage(channelId, `🎉 Welcome ${formatUser(userId)}! Say "GM" and I'll say it back! ☀️`)
  }
})

// ===== SERVER SETUP =====
const { jwtMiddleware, handler } = await bot.start()

const app = new Hono()

// Request logging middleware (helpful for debugging)
app.use('*', async (c, next) => {
  const start = Date.now()
  console.log(`📥 ${c.req.method} ${c.req.path}`)
  await next()
  const ms = Date.now() - start
  console.log(`✅ ${c.req.method} ${c.req.path} - ${ms}ms - ${c.res.status}`)
})

// Webhook endpoint for Towns Protocol
app.post('/webhook', jwtMiddleware, handler)

// Health check endpoint
app.get('/health', (c) => c.json({ 
  status: 'ok',
  bot: 'Ultimate Towns Bot',
  timestamp: Date.now(),
  botId: bot.botId
}))

// Root endpoint
app.get('/', (c) => c.json({ 
  bot: 'Ultimate Towns Bot',
  status: 'running',
  botId: bot.botId,
  endpoints: {
    webhook: '/webhook',
    health: '/health'
  }
}))

// Start server
const port = process.env.PORT || 5123
serve({
  fetch: app.fetch,
  port: Number(port)
})

console.log(`🚀 Ultimate Towns Bot running on port ${port}`)
console.log(`🤖 Bot ID: ${bot.botId}`)
console.log(`✨ Ready for AI-assisted customization with Cursor!`)
console.log(`\n🌐 Server URLs:`)

// Detect deployment environment
const isRender = process.env.RENDER === 'true' || process.env.RENDER_EXTERNAL_URL
if (isRender) {
  const renderUrl = process.env.RENDER_EXTERNAL_URL || 'your-render-url'
  console.log(`   🔗 Webhook: ${renderUrl}/webhook`)
  console.log(`   💊 Health:  ${renderUrl}/health`)
  console.log(`   📍 Deployed on Render.com`)
} else {
  console.log(`   🔗 Webhook: http://localhost:${port}/webhook`)
  console.log(`   💊 Health:  http://localhost:${port}/health`)
  console.log(`   📍 Running locally for testing`)
}

console.log(`\n💡 Configure webhook in Towns Developer Portal`)
console.log(`   https://app.alpha.towns.com/developer`)

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
