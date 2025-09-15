# Towns Protocol SDK - Complete Developer Knowledge Base

## Document Purpose

This comprehensive knowledge base contains everything needed to build sophisticated Towns Protocol bots. It serves as the ultimate reference for AI agents and developers to understand the complete SDK ecosystem, capabilities, and implementation patterns.

**Target Audience**: AI agents, developers, and teams building Towns Protocol applications
**Scope**: Complete SDK coverage with practical examples and implementation guides
**Version**: Towns Protocol SDK v0.0.321+ and Bot SDK v0.0.323+

---

## SDK Ecosystem Overview

### Core Packages and Dependencies

#### Primary SDK Packages
```json
{
  "@towns-protocol/sdk": "^0.0.321",           // Core SDK with client and stream management
  "@towns-protocol/bot": "^0.0.323",           // High-level bot framework
  "@towns-protocol/proto": "latest",           // Protocol buffer definitions
  "@towns-protocol/encryption": "latest",      // End-to-end encryption
  "@towns-protocol/web3": "latest",            // Web3 integration and contracts
  "@towns-protocol/rpc-connector": "latest",   // RPC communication layer
  "@towns-protocol/sdk-crypto": "latest"       // Cryptographic utilities
}
```

#### Supporting Dependencies
```json
{
  "@connectrpc/connect-node": "^2.0.0",        // RPC connectivity
  "@hono/node-server": "^1.14.0",             // HTTP server (recommended)
  "hono": "^4.7.11",                          // Web framework
  "viem": "latest",                           // Ethereum interaction
  "ethers": "latest"                          // Alternative Ethereum library
}
```

### Package Relationships and Architecture

#### SDK Layer Structure
```
Application Layer    │ Your Bot Code
                    │
Bot SDK Layer       │ @towns-protocol/bot (High-level abstractions)
                    │ ├─ Event handlers (onMessage, onReaction, etc.)
                    │ ├─ Authentication (JWT middleware)
                    │ └─ Message operations (send, delete, edit)
                    │
Core SDK Layer      │ @towns-protocol/sdk (Core functionality)
                    │ ├─ ClientV2 (Main client interface)
                    │ ├─ Stream management (channels, DMs, GDMs)
                    │ ├─ State management (members, metadata)
                    │ └─ Event processing (timeline, reactions)
                    │
Protocol Layer      │ @towns-protocol/proto (Protocol definitions)
                    │ ├─ Message types and structures
                    │ ├─ Event payloads and schemas
                    │ └─ Protocol buffer definitions
                    │
Infrastructure      │ @towns-protocol/encryption + web3 + rpc-connector
                    │ ├─ End-to-end encryption
                    │ ├─ Web3 contract interactions
                    │ └─ RPC communication
```

---

## Complete Installation and Setup Guide

### Prerequisites

#### Required Tools
```bash
# Bun (Recommended Runtime - Optimal Performance)
curl -fsSL https://bun.sh/install | bash

# Alternative: Node.js 18+ (Now Fully Supported)
# npm install issues have been fixed
# Download from https://nodejs.org/

# Git for version control
# Platform-specific installation required
```

#### Verify Installation
```bash
# Check Bun version
bun --version  # Should be 1.2.20+

# Check Node.js (if using as alternative)
node --version  # Should be 18.0.0+
npm --version   # Should be 8.0.0+
```

### Project Initialization

#### Method 1: Official Towns Bot CLI (Recommended)
```bash
# Initialize new bot project (Official Towns CLI)
npx towns-bot init my-bot-name

# Navigate to project
cd my-bot-name

# Install dependencies (multiple options now supported)
bun install    # Preferred for performance
# OR
npm install    # Now fully supported (issues fixed)
# OR
yarn install   # Also supported
```

#### Method 2: Manual Setup
```bash
# Create project directory
mkdir my-towns-bot
cd my-towns-bot

# Initialize package.json
bun init
# or: npm init -y

# Install core dependencies
bun add @towns-protocol/bot @towns-protocol/sdk
bun add @hono/node-server hono
bun add --dev typescript @types/node esbuild

# Alternative with npm
# npm install @towns-protocol/bot @towns-protocol/sdk
# npm install @hono/node-server hono
# npm install --save-dev typescript @types/node esbuild
```

### Project Structure Setup

#### Essential Files
```
my-towns-bot/
├── src/
│   └── index.ts          # Main bot code
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── esbuild.config.mjs    # Build configuration
├── .env                  # Environment variables (DO NOT COMMIT)
├── .gitignore           # Git ignore file
└── README.md            # Project documentation
```

#### package.json Configuration (Bun Runtime)
```json
{
  "name": "my-towns-bot",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "build": "tsc --noEmit && node ./esbuild.config.mjs",
    "start": "bun run dist/index.mjs",
    "render:build": "bun install && bun run build"
  },
  "dependencies": {
    "@towns-protocol/bot": "^0.0.323",
    "@towns-protocol/sdk": "^0.0.321",
    "@hono/node-server": "^1.14.0",
    "hono": "^4.7.11"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "@types/node": "^20.0.0",
    "esbuild": "^0.19.0",
    "typescript": "^5.0.0"
  }
}
```

#### Alternative package.json (Node.js/npm Runtime)
```json
{
  "name": "my-towns-bot",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc --noEmit && node ./esbuild.config.mjs",
    "start": "node dist/index.mjs",
    "render:build": "npm install && npm run build"
  },
  "dependencies": {
    "@towns-protocol/bot": "^0.0.323",
    "@towns-protocol/sdk": "^0.0.321",
    "@hono/node-server": "^1.14.0",
    "hono": "^4.7.11",
    "better-sqlite3": "^9.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/better-sqlite3": "^7.6.0",
    "esbuild": "^0.19.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  }
}
```

#### tsconfig.json Configuration
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "lib": ["esnext"],
    "types": ["bun-types", "@types/node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### esbuild.config.mjs Configuration
```javascript
import { build } from 'esbuild'

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.mjs',
  platform: 'node',
  target: 'node18',
  format: 'esm',
  packages: 'external',
  sourcemap: true,
  minify: false
})

console.log('✅ Build completed')
```

#### .env Configuration
```bash
# Bot Credentials (from Towns Developer Portal)
APP_PRIVATE_DATA_BASE64="your_private_key_base64"
JWT_SECRET="your_jwt_secret"

# Optional Configuration
PORT=5123
NODE_TLS_REJECT_UNAUTHORIZED=0

# Database Configuration (if using)
DATABASE_PATH="./bot-database.db"

# External API Keys (if needed)
OPENAI_API_KEY="your_openai_key"
```

#### .gitignore Configuration
```gitignore
# Dependencies
node_modules/
.bun/

# Build outputs
dist/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.production

# Database files
*.db
*.sqlite

# Logs
logs/
*.log

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db
```

### Basic Bot Implementation

#### Minimal Bot Setup (src/index.ts)
```typescript
import { makeTownsBot } from '@towns-protocol/bot'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

// Create bot instance
const bot = await makeTownsBot(
  process.env.APP_PRIVATE_DATA_BASE64!,
  process.env.JWT_SECRET!
)

// Basic message handler
bot.onMessage(async (handler, { message, userId, channelId }) => {
  // Skip bot's own messages
  if (userId === bot.botId) return
  
  console.log(`Message from ${userId}: ${message}`)
})

// Basic mention handler
bot.onMentioned(async (handler, { message, channelId }) => {
  await handler.sendMessage(channelId, "Hello! I'm your new Towns bot!")
})

// Start bot server
const { jwtMiddleware, handler } = await bot.start()

const app = new Hono()
app.post('/webhook', jwtMiddleware, handler)

// Health check endpoint
app.get('/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }))

// Start server
const port = process.env.PORT || 5123
serve({
  fetch: app.fetch,
  port: Number(port)
})

console.log(`🤖 Bot running on port ${port}`)
console.log(`🔗 Webhook URL: http://localhost:${port}/webhook`)
```

### Development Workflow

#### Local Development
```bash
# Start development server with auto-reload
bun run dev

# Build for production
bun run build

# Start production build
bun run start

# Test webhook endpoint
curl -X POST http://localhost:5123/health
```

#### Testing and Debugging
```bash
# Check logs in real-time
tail -f logs/bot.log

# Test environment variables
bun run -e 'console.log(process.env.APP_PRIVATE_DATA_BASE64?.slice(0, 20))'

# Validate build output
ls -la dist/
file dist/index.mjs
```

---

## Official Bot Creation Process

### Step 1: Create Bot in Towns Developer Portal
1. Navigate to `https://app.alpha.towns.com/developer`
2. Create new bot - this creates app registry & on-chain contracts
3. Save `APP_PRIVATE_KEY` & `JWT_SECRET` securely

### Step 2: Initialize Bot Project
```bash
# Official Towns bot CLI (recommended)
npx towns-bot init <name-of-the-bot>
cd <name-of-the-bot>

# Install dependencies (all work now)
bun install    # Preferred for performance
# OR
npm install    # Now supported (issues fixed)
# OR  
yarn install   # Also supported
```

### Step 3: Development Setup
- Create git repository and push changes
- Configure environment variables in `.env`
- Test locally with `bun run dev` or `npm run dev`

### Step 4: Deployment (Render.com)
1. Go to [render.com](https://render.com/)
2. Create New → Web Service
3. Import project from Git Repo
4. Set build command: `npm install && npm run build`
5. Copy paste `.env` variables
6. Deploy!

### Step 5: Configure Webhook in Towns
1. Copy deployed bot URL
2. Add `/webhook` endpoint: `https://your-bot.onrender.com/webhook`
3. Configure forwarding settings (default: mentions & replies only)
4. Install bot to your space

---

## Bot Creation and Authentication

### Developer Portal Setup

#### Step 1: Bot Registration
1. Navigate to `https://app.alpha.towns.com/developer`
2. Click "Create New Bot"
3. Configure bot details:
   - **Name**: Your bot's display name
   - **Description**: Bot functionality description
   - **Permissions**: Select required capabilities

#### Step 2: Permission Configuration
```typescript
// Available bot permissions (enable as needed):
enum BotPermissions {
  Read = "Read",                    // Access to messages and events
  Write = "Write",                  // Send messages and reactions
  Invite = "Invite",               // Invite users to spaces
  JoinSpace = "JoinSpace",         // Auto-join capabilities
  Redact = "Redact",               // Delete messages (adminRemoveEvent)
  ModifyBanning = "ModifyBanning", // Ban/unban users
  PinMessage = "PinMessage",       // Pin/unpin messages
  AddRemoveChannels = "AddRemoveChannels", // Channel management
  ModifySpaceSettings = "ModifySpaceSettings", // Space configuration
  React = "React"                  // React to messages
}
```

#### Step 3: Credentials Management
```typescript
// Secure credential storage
const botCredentials = {
  APP_PRIVATE_DATA_BASE64: "base64_encoded_private_key", // From developer portal
  JWT_SECRET: "jwt_secret_string"                       // From developer portal
}

// Environment variable setup
process.env.APP_PRIVATE_DATA_BASE64 = botCredentials.APP_PRIVATE_DATA_BASE64
process.env.JWT_SECRET = botCredentials.JWT_SECRET
```

---

## Complete SDK Function Catalog

### Bot SDK (@towns-protocol/bot) Functions

#### Core Bot Creation
```typescript
import { makeTownsBot } from '@towns-protocol/bot'

// Create bot instance
const bot = await makeTownsBot(
  process.env.APP_PRIVATE_DATA_BASE64!,
  process.env.JWT_SECRET!,
  {
    baseRpcUrl?: string,                    // Custom RPC endpoint
    // Additional ClientV2 options available
  }
)
```

#### Complete Event Handler Functions Reference

##### Message Events
```typescript
// Primary message handler - ALL messages trigger this
bot.onMessage(async (handler, event) => {
  // event: BasePayload & {
  //   message: string,     // Decrypted message content
  //   isDm: boolean,       // true if direct message
  //   isGdm: boolean      // true if group direct message
  // }
  // handler: BotActions with all available operations
  
  // Skip bot's own messages
  if (event.userId === bot.botId) return
  
  // Detect message type
  if (event.isDm) {
    // Handle direct message
  } else if (event.isGdm) {
    // Handle group direct message
  } else {
    // Handle public channel message
  }
})

// Bot mention handler - when @bot is mentioned
bot.onMentioned(async (handler, event) => {
  // event: BasePayload & {
  //   message: string     // Full message content with bot mention
  // }
  
  // Parse commands from mentions
  const command = event.message.replace(/@\w+/g, '').trim()
  
  if (command.includes('help')) {
    await handler.sendMessage(event.channelId, "Here's how I can help...")
  }
})

// Reply handler - when someone replies to bot's message
bot.onReply(async (handler, event) => {
  // event: BasePayload & {
  //   message: string     // Reply message content
  // }
  
  // Handle replies to bot messages
  await handler.sendMessage(event.channelId, "Thanks for your reply!")
})
```

##### Thread Events
```typescript
// Thread message handler
bot.onThreadMessage(async (handler, event) => {
  // event: BasePayload & {
  //   threadId: string,   // Thread identifier
  //   message: string     // Message content in thread
  // }
  
  // Handle thread conversations
  console.log(`Thread ${event.threadId}: ${event.message}`)
})

// Thread mention handler
bot.onMentionedInThread(async (handler, event) => {
  // event: BasePayload & {
  //   threadId: string,   // Thread identifier  
  //   message: string     // Message content with bot mention
  // }
  
  // Respond in thread
  await handler.sendMessage(event.channelId, "Thread response", {
    threadId: event.threadId
  })
})
```

##### User Lifecycle Events
```typescript
// Channel join handler - user joins channel/space
bot.onChannelJoin(async (handler, event) => {
  // event: BasePayload (userId, channelId, spaceId, eventId)
  
  // Welcome new users (only in default channel for space joins)
  if (isDefaultChannelId(event.channelId)) {
    await handler.sendMessage(event.channelId, 
      `🎉 Welcome to the community, <@${event.userId}>!`
    )
  }
})

// Channel leave handler - user leaves channel/space  
bot.onChannelLeave(async (handler, event) => {
  // event: BasePayload (userId, channelId, spaceId, eventId)
  
  // Log departures or cleanup user data
  console.log(`User ${event.userId} left ${event.channelId}`)
})
```

##### Interaction Events
```typescript
// Reaction handler - user reacts to message
bot.onReaction(async (handler, event) => {
  // event: BasePayload & {
  //   reaction: string,    // Emoji reaction (e.g., "👍", "white_check_mark")
  //   messageId: string,   // EventId of message being reacted to
  //   userId: string       // User who added reaction (redundant with BasePayload)
  // }
  
  // Handle verification reactions
  if (event.reaction === 'white_check_mark') {
    // Process user verification
    await verifyUser(event.userId, event.spaceId)
  }
})

// Tip handler - user tips bot (TODO: Implementation pending)
bot.onTip(async (handler, event) => {
  // event: BasePayload & {
  //   amount: bigint,      // Tip amount in wei
  //   currency: `0x${string}` // Token contract address
  // }
  
  // Handle tips (not yet implemented in SDK)
  console.log(`Received ${event.amount} of ${event.currency}`)
})
```

##### Content Modification Events
```typescript
// Message edit handler
bot.onMessageEdit(async (handler, event) => {
  // event: BasePayload & {
  //   refEventId: string,  // EventId of original message
  //   message: string      // New message content
  // }
  
  // Re-check edited messages for violations
  const violation = checkContent(event.message)
  if (violation) {
    await handler.adminRemoveEvent(event.channelId, event.eventId)
  }
})

// Message deletion handler (when message is redacted)
bot.onRedaction(async (handler, event) => {
  // event: BasePayload & {
  //   refEventId: string   // EventId of deleted message
  // }
  
  // Log message deletions
  console.log(`Message ${event.refEventId} was deleted`)
})

// Event revoke handler (when moderator revokes event)
bot.onEventRevoke(async (handler, event) => {
  // event: BasePayload & {
  //   refEventId: string   // EventId of revoked event
  // }
  
  // Handle moderator actions
  console.log(`Event ${event.refEventId} was revoked`)
})
```

##### Advanced Event Processing
```typescript
// Raw stream event handler - access to all protocol events
bot.onStreamEvent(async (handler, event) => {
  // event: BasePayload & {
  //   event: ParsedEvent   // Raw protocol event with full data
  // }
  
  // Access to complete event structure
  const rawEvent = event.event
  console.log('Raw event type:', rawEvent.content?.kind)
  
  // Process events not covered by other handlers
  if (rawEvent.content?.kind === 'SpecialEventType') {
    // Handle special event types
  }
})
```

#### Complete Message Operation Functions

##### Core Message Functions
```typescript
// Send Messages to Channels
await handler.sendMessage(streamId, message, options?)
// Parameters:
// - streamId: channelId for public channels, userId for DMs
// - message: string content (supports markdown formatting)
// - options: MessageOpts {
//     threadId?: string,                              // Reply in thread
//     replyId?: string,                               // Reply to specific message
//     mentions?: ChannelMessage_Post_Mention[],       // User mentions
//     attachments?: ChannelMessage_Post_Attachment[]  // File attachments
//   }
// Returns: { eventId: string, prevMiniblockHash: Uint8Array }

// Examples:
await handler.sendMessage(channelId, "Hello everyone!")
await handler.sendMessage(channelId, "Thread reply", { threadId: "thread_id" })
await handler.sendMessage(channelId, "Reply to message", { replyId: "message_id" })
await handler.sendMessage(channelId, "Hello <@userId>!", {
  mentions: [{ userId: "0x...", displayName: "User" }]
})

// Send Direct Messages
await handler.sendDm(userId, message, options?)
// Parameters:
// - userId: target user's wallet address (0x...)
// - message: string content
// - options: same as sendMessage options
// Returns: { eventId: string, prevMiniblockHash: Uint8Array }

// Examples:
await handler.sendDm("0x123...", "Private message")
await handler.sendDm("0x123...", "DM with mention <@0x456...>", {
  mentions: [{ userId: "0x456..." }]
})
```

##### Message Modification Functions
```typescript
// Edit Messages (bot's own messages only)
await handler.editMessage(streamId, messageId, newMessage)
// Parameters:
// - streamId: channelId or userId where message was sent
// - messageId: eventId of message to edit
// - newMessage: new content string
// Returns: { eventId: string, prevMiniblockHash: Uint8Array }

// Example:
const { eventId } = await handler.sendMessage(channelId, "Original message")
await handler.editMessage(channelId, eventId, "Edited message")
```

##### Message Deletion Functions
```typescript
// Delete Bot's Own Messages
await handler.removeEvent(streamId, messageId)
// Parameters:
// - streamId: channelId or userId where message was sent
// - messageId: eventId of message to delete
// Returns: { eventId: string, prevMiniblockHash: Uint8Array }

// Delete Other Users' Messages (Admin Function)
await handler.adminRemoveEvent(streamId, messageId)
// Parameters:
// - streamId: channelId where message was sent
// - messageId: eventId of message to delete
// Requires: Bot must have "Redact" permission
// Returns: { eventId: string, prevMiniblockHash: Uint8Array }

// Usage Pattern from our moderation bot:
if (violation.action === 'delete') {
  await handler.adminRemoveEvent(event.channelId, event.eventId)
  await handler.sendMessage(event.channelId, `🚫 ${violation.userMessage}`)
}
```

##### Reaction Functions
```typescript
// Send Reactions
await handler.sendReaction(streamId, messageId, reaction)
// Parameters:
// - streamId: channelId or userId where target message is
// - messageId: eventId of message to react to
// - reaction: emoji string
// Returns: { eventId: string, prevMiniblockHash: Uint8Array }

// Common Reactions:
await handler.sendReaction(channelId, messageId, "👍")           // Thumbs up
await handler.sendReaction(channelId, messageId, "❤️")           // Heart
await handler.sendReaction(channelId, messageId, "white_check_mark") // ✅
await handler.sendReaction(channelId, messageId, "warning")      // ⚠️
await handler.sendReaction(channelId, messageId, "x")            // ❌
```

##### Bot Identity Management Functions
```typescript
// Set Bot Username (per channel/space)
await handler.setUsername(streamId, username)
// Parameters:
// - streamId: channelId or spaceId where to set username
// - username: desired username string
// Returns: { eventId: string, prevMiniblockHash: Uint8Array }

// Set Bot Display Name (per channel/space)  
await handler.setDisplayName(streamId, displayName)
// Parameters:
// - streamId: channelId or spaceId where to set display name
// - displayName: desired display name (can include emojis)
// Returns: { eventId: string, prevMiniblockHash: Uint8Array }

// Set Bot Profile Image
await handler.setUserProfileImage(chunkedMediaInfo)
// Parameters:
// - chunkedMediaInfo: ChunkedMedia object with image data
// Returns: { eventId: string, prevMiniblockHash: Uint8Array }

// Example Identity Setup:
await handler.setUsername(spaceId, "ModeratorBot")
await handler.setDisplayName(spaceId, "🛡️ Community Moderator")
```

##### Advanced Message Functions
```typescript
// Get User Data (deprecated but functional)
await handler.getUserData(streamId, userId)
// Parameters:
// - streamId: channelId or spaceId for context
// - userId: target user's wallet address
// Returns: UserData | null with structure:
// {
//   userId: string,
//   username: string | null,
//   displayName: string | null,
//   ensAddress?: string,
//   bio: string | null,
//   nft?: { tokenId, contractAddress, chainId },
//   profilePictureUrl: string
// }

// Web3 Contract Functions (available in handler)
await handler.writeContract(writeContractParams)
await handler.readContract(readContractParams)
// Full viem contract interaction capabilities
```

##### Message Formatting and Mentions
```typescript
// Mention Users in Messages
const mentionUser = (userId: string) => `<@${userId}>`

// Format message with clickable mentions (from our bot experience)
const formatUserDisplay = (userId: string) => `<@${userId}>`

// Message with multiple mentions:
await handler.sendMessage(channelId, 
  `Hello ${mentionUser(userId1)} and ${mentionUser(userId2)}!`,
  {
    mentions: [
      { userId: userId1, displayName: "User One" },
      { userId: userId2, displayName: "User Two" }
    ]
  }
)

// Markdown Support in Messages:
await handler.sendMessage(channelId, `
**Bold text**
*Italic text*
\`Code text\`
[Link text](https://example.com)
`)
```

---

## Complete Event System Reference

### Event Payload Structures

#### BasePayload (Common to all events)
```typescript
interface BasePayload {
  userId: string      // Wallet address of user who triggered event
  spaceId: string     // Towns space identifier  
  channelId: string   // Channel identifier
  eventId: string     // Unique event identifier
}
```

#### Message Events
```typescript
// onMessage Event
interface MessageEvent extends BasePayload {
  message: string     // Decrypted message content
  isDm: boolean      // true if direct message
  isGdm: boolean     // true if group direct message
}

// onMentioned Event  
interface MentionEvent extends BasePayload {
  message: string     // Full message content with bot mention
}

// onThreadMessage Event
interface ThreadMessageEvent extends BasePayload {
  threadId: string    // Thread identifier
  message: string     // Message content
}
```

#### Reaction Events
```typescript
// onReaction Event
interface ReactionEvent {
  reaction: string    // Emoji reaction (e.g., "👍", "white_check_mark")
  messageId: string   // EventId of message being reacted to
  userId: string      // User who added reaction
  channelId: string   // Channel where reaction occurred
  spaceId: string     // Space identifier
}
```

#### User Events
```typescript
// onChannelJoin Event
interface ChannelJoinEvent extends BasePayload {
  // User joined a channel (could be space entry or channel switch)
}

// onChannelLeave Event  
interface ChannelLeaveEvent extends BasePayload {
  // User left a channel
}
```

---

## Advanced SDK Capabilities

### Core SDK Architecture Overview

#### Dual Architecture
- **Base Chain**: Ethereum L2 (Base) for smart contracts, memberships, entitlements
- **River Chain**: Custom L2 for real-time messaging and state synchronization
- **Diamond Pattern**: Modular smart contract architecture for spaces

#### Core Components
```typescript
// Main SDK exports
import {
  Client,              // Legacy client implementation  
  ClientV2,            // New simplified client
  SyncAgent,           // Main synchronization engine
  createTownsClient,   // Client factory function
  makeRiverConfig,     // Configuration builder
  SpaceDapp,           // Smart contract interactions
  RiverRegistry        // Node discovery
} from '@towns-protocol/sdk'
```

### SyncAgent - The Core Engine

#### SyncAgent Overview
```typescript
// SyncAgent is the main synchronization engine for standalone applications
const syncAgent = new SyncAgent({
  context: signerContext,
  riverConfig: config,
  retryParams: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffFactor: 2
  },
  highPriorityStreamIds: ['space1', 'channel1'], // Priority streams
  disablePersistenceStore: false, // Enable local persistence
  onTokenExpired: () => {
    console.log('Authentication token expired')
  }
})

await syncAgent.start()
```

#### SyncAgent Core Observables
```typescript
// Core observables - reactive data streams
syncAgent.observables = {
  riverAuthStatus: Observable<AuthStatus>,      // Connection status
  riverConnection: PersistedObservable<RiverConnectionModel>,
  riverChain: PersistedObservable<RiverChainModel>,
  spaces: PersistedObservable<SpacesModel>,     // User's spaces
  user: PersistedObservable<UserModel>,         // User data
  userMemberships: PersistedObservable<UserMembershipsModel>,
  userInbox: PersistedObservable<UserInboxModel>,
  userMetadata: PersistedObservable<UserMetadataModel>,
  userSettings: PersistedObservable<UserSettingsModel>,
  gdms: PersistedObservable<GdmsModel>,         // Group DMs
  dms: PersistedObservable<DmsModel>            // Direct messages
}

// Main components
syncAgent.spaces    // Space management
syncAgent.dms       // Direct messages
syncAgent.gdms      // Group direct messages
syncAgent.user      // User data and settings
```

### Core SDK (@towns-protocol/sdk) Integration

#### ClientV2 Access
```typescript
import { ClientV2, CreateTownsClientParams } from '@towns-protocol/sdk'

// Access underlying client for advanced operations
const client = bot.client as ClientV2

// Stream management
const stream = client.stream(streamId)
const view = stream.view

// Member access
const members = view.members
const memberData = view.memberMetadata
```

#### Standalone Client Creation
```typescript
import { createTownsClient, makeRiverConfig } from '@towns-protocol/sdk'

// Method 1: Using private key
const client = await createTownsClient({
  privateKey: '0x...', // Your private key
  env: 'gamma', // or 'local', 'alpha', 'delta', 'omega'
  encryptionDevice: {
    deviceId: 'my-device-id',
    // optional encryption settings
  },
  hashValidation: true,
  signatureValidation: true
})

// Method 2: Using mnemonic
const client = await createTownsClient({
  mnemonic: 'your twelve word mnemonic phrase here...',
  env: 'gamma'
})

// Method 3: Using bearer token
const client = await createTownsClient({
  bearerToken: 'your-jwt-token',
  env: 'gamma'
})
```

---

## CRITICAL UNDERSTANDING: SPACES vs CHANNELS

### ⚠️ MOST IMPORTANT DISTINCTION
**This is the most common source of errors when using the Towns Protocol SDK:**

```typescript
// ❌ WRONG - You CANNOT send messages to a Space directly
space.sendMessage('Hello') // This doesn't exist!
space.getChannel(spaceId)  // This will throw "channelId is not a channel stream id"

// ✅ CORRECT - Messages go to Channels within Spaces
const channel = space.getChannel(channelId)
channel.sendMessage('Hello') // This works!

// Or get the default channel
const defaultChannel = space.getDefaultChannel()
defaultChannel.sendMessage('Hello') // This works!
```

### Architecture Hierarchy
```
Space (Container)
├── Channel #1 (general) ← Messages go here
├── Channel #2 (announcements) ← Messages go here  
├── Channel #3 (random) ← Messages go here
└── Members, Roles, Settings
```

### Key Rules:
1. **Spaces** = Discord servers (containers for channels)
2. **Channels** = Discord channels (where messages actually go)
3. **Every space automatically creates a "general" channel**
4. **You always message channels, never spaces directly**
5. **Space creation returns `{ spaceId, defaultChannelId }`** - save both!

---

## Complete Space Management

### Creating Spaces with Full Parameters
```typescript
// Using SyncAgent (Standalone)
const { spaceId, defaultChannelId } = await syncAgent.spaces.createSpace(
  {
    spaceName: 'My Community',
    channelName: 'general', // Default channel name
    uri: 'https://myspace.com',
    shortDescription: 'A great community',
    longDescription: 'A longer description of the community',
    membership: {
      settings: {
        pricingModule: '0x...', // Pricing contract address
        duration: 2592000, // 30 days in seconds
        currency: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' // USDC on Base
      },
      requirements: {
        everyone: false, // Not open to everyone
        users: [], // Specific allowed users
        payments: [{
          amount: '10000000000000000000', // 10 tokens (18 decimals)
          currency: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
        }]
      }
    }
  },
  signer // ethers.Signer instance
)

// ✅ CRITICAL: Space creation returns BOTH spaceId AND defaultChannelId
console.log('Space created:', spaceId)
console.log('Default channel created:', defaultChannelId)

// ✅ IMPORTANT: Save both IDs - you need channelId for messaging
setCurrentSpaceId(spaceId)
setCurrentChannelId(defaultChannelId) // Messages go to channels, not spaces!
```

### Space Data Access and Channel Discovery
```typescript
// Get space instance
const space = syncAgent.spaces.getSpace(spaceId)

// Subscribe to space data changes
space.subscribe((spaceData) => {
  console.log('Space metadata:', spaceData.metadata)
  console.log('Channel IDs:', spaceData.channelIds) // ✅ Array of channel IDs in this space
  console.log('Initialized:', spaceData.initialized)
  
  // ✅ IMPORTANT: Get the default channel for messaging
  if (spaceData.channelIds.length > 0) {
    const defaultChannelId = spaceData.channelIds[0] // Usually the default "general" channel
    const defaultChannel = space.getDefaultChannel() // Or use this method
    console.log('Default channel for messaging:', defaultChannelId)
  }
})

// ✅ CRITICAL: To send messages, you need a channelId, not spaceId
const defaultChannelId = spaceData?.channelIds?.[0] // Get first channel (usually "general")
```

### Creating Channels in Spaces
```typescript
// Create additional channels in space
const space = syncAgent.spaces.getSpace(spaceId)
const { channelId } = await space.createChannel(
  'announcements',    // Channel name
  'Important updates', // Channel description
  signer
)

console.log('New channel created:', channelId)
```

#### Stream State Management
```typescript
// Channel stream operations
import { 
  isChannelStreamId,
  isDMChannelStreamId, 
  isGDMChannelStreamId,
  isDefaultChannelId
} from '@towns-protocol/sdk'

// Stream type detection
if (isChannelStreamId(streamId)) {
  // Public channel operations
} else if (isDMChannelStreamId(streamId)) {
  // Direct message operations  
} else if (isGDMChannelStreamId(streamId)) {
  // Group direct message operations
}
```

#### Member Management
```typescript
import { MembershipOp } from '@towns-protocol/proto'

// Member operations (when available through client extension)
const membershipOp = MembershipOp.SO_JOIN     // User joined
const membershipOp = MembershipOp.SO_OWNER    // Space owner
const membershipOp = MembershipOp.SO_MODERATOR // Space moderator

// Access member list (advanced pattern)
const extendedClient = {
  getSpaceMembers: async (spaceId: string) => {
    const stream = client.stream(spaceId)
    return stream.view.members.getAllMembers()
  },
  
  isUserAdmin: async (spaceId: string, userId: string) => {
    const stream = client.stream(spaceId)
    const member = stream.view.members.getMember(userId)
    return member?.role === 'OWNER' || member?.role === 'MODERATOR'
  }
}
```

---

## Message Types and Structures

### Message Content Types
```typescript
import { 
  ChannelMessage_Post_Attachment,
  ChannelMessage_Post_Mention,
  ChunkedMedia 
} from '@towns-protocol/proto'

// Text Messages
interface TextMessage {
  content: string
  mentions?: ChannelMessage_Post_Mention[]
}

// Messages with Attachments
interface AttachmentMessage {
  content: string
  attachments: ChannelMessage_Post_Attachment[]
}

// Mentions Structure
interface MentionStructure {
  userId: string      // User being mentioned
  displayName?: string // Display name if available
}
```

### Media and Attachment Handling
```typescript
// Chunked Media for large files
interface ChunkedMediaInfo {
  mimeType: string
  chunks: Uint8Array[]
  totalSize: number
}

// Attachment Types
enum AttachmentType {
  IMAGE = "image",
  VIDEO = "video", 
  DOCUMENT = "document",
  AUDIO = "audio"
}
```

---

## DM and Communication Patterns

### Direct Message Operations

#### Sending DMs
```typescript
// Basic DM
await handler.sendDm(userId, "Hello! This is a direct message.")

// DM with mentions
await handler.sendDm(userId, "Hello <@otherUserId>!", {
  mentions: [{ userId: "otherUserId" }]
})

// DM with thread support
await handler.sendDm(userId, "Reply in thread", {
  threadId: "existing_thread_id"
})

// DM with reply
await handler.sendDm(userId, "Replying to your message", {
  replyId: "message_event_id"
})
```

#### DM Event Handling Patterns
```typescript
// Detect DM vs Channel messages
bot.onMessage(async (handler, { message, channelId, userId, isDm, isGdm }) => {
  if (isDm) {
    // Handle direct message
    console.log(`DM from ${userId}: ${message}`)
    await handler.sendDm(userId, "Thanks for your DM!")
  } else if (isGdm) {
    // Handle group direct message
    console.log(`GDM from ${userId}: ${message}`)
  } else {
    // Handle public channel message
    console.log(`Channel message from ${userId}: ${message}`)
  }
})
```

### Group Direct Messages (GDM)

#### GDM Detection and Handling
```typescript
import { isGDMChannelStreamId } from '@towns-protocol/sdk'

// GDM-specific operations
if (isGDMChannelStreamId(channelId)) {
  // Group DM operations
  await handler.sendMessage(channelId, "Group message response")
  
  // GDMs support all standard message operations:
  // - Threading
  // - Reactions  
  // - Mentions
  // - Attachments (when supported)
}
```

---

## Direct Messages & Group DMs (Core SDK)

### 🔒 DM Architecture Overview

Direct Messages in Towns Protocol are **separate streams** from space channels:
- **DMs** = Private 1-on-1 conversations 
- **GDMs** = Private group conversations (multiple users)
- **End-to-end encrypted** by default
- **Independent** of spaces - users can DM without being in same space
- **Persistent** - messages survive even if users leave spaces

### Direct Messages - Standalone Implementation

#### Creating and Managing DMs
```typescript
import { SyncAgent, userIdFromAddress, makeDMStreamId } from '@towns-protocol/sdk'

class DMManager {
  constructor(private syncAgent: SyncAgent) {}

  async createDMWithUser(otherUserAddress: string): Promise<string> {
    try {
      const otherUserId = userIdFromAddress(otherUserAddress)
      
      // Check if DM already exists
      const existingDM = this.findExistingDM(otherUserId)
      if (existingDM) {
        console.log('DM already exists:', existingDM.data.id)
        return existingDM.data.id
      }

      // Create new DM
      const dmStreamId = await this.syncAgent.dms.createDM(
        [otherUserId],
        `DM with ${otherUserAddress.slice(0, 8)}...`
      )
      
      console.log('Created new DM:', dmStreamId)
      return dmStreamId
      
    } catch (error) {
      console.error('Failed to create DM:', error)
      throw error
    }
  }

  private findExistingDM(userId: string): Dm | null {
    try {
      const dm = this.syncAgent.dms.getDmWithUserId(userId)
      return dm.data.id ? dm : null
    } catch {
      return null
    }
  }
}
```

#### DM Messaging System
```typescript
class DMMessaging {
  constructor(private syncAgent: SyncAgent) {}

  async sendDMMessage(
    recipientUserId: string, 
    message: string,
    options?: {
      replyId?: string
      attachments?: any[]
      mentions?: any[]
    }
  ): Promise<{ eventId: string }> {
    try {
      // Get or create DM
      const dm = this.syncAgent.dms.getDmWithUserId(recipientUserId)
      
      // Send message
      const result = await dm.sendMessage(message, {
        replyId: options?.replyId,
        attachments: options?.attachments || [],
        mentions: options?.mentions || []
      })
      
      console.log('DM sent:', result.eventId)
      return result
      
    } catch (error) {
      console.error('Failed to send DM:', error)
      throw error
    }
  }

  async editDMMessage(
    recipientUserId: string,
    eventId: string,
    newMessage: string
  ): Promise<void> {
    const dm = this.syncAgent.dms.getDmWithUserId(recipientUserId)
    await dm.editMessage(eventId, newMessage)
  }

  async reactToDMMessage(
    recipientUserId: string,
    eventId: string,
    emoji: string
  ): Promise<void> {
    const dm = this.syncAgent.dms.getDmWithUserId(recipientUserId)
    await dm.sendReaction(eventId, emoji)
  }
}
```

#### DM Timeline Management
```typescript
class DMTimeline {
  private dmSubscriptions = new Map<string, () => void>()

  constructor(private syncAgent: SyncAgent) {}

  subscribeToUserDM(userId: string, onMessage: (event: any) => void): () => void {
    const dm = this.syncAgent.dms.getDmWithUserId(userId)
    
    const unsubscribe = dm.timeline.events.subscribe((events) => {
      events.forEach(event => {
        if (event.content?.kind === 'ChannelMessage') {
          onMessage({
            eventId: event.hashStr,
            message: event.content.content.body,
            senderId: event.creatorUserId,
            timestamp: event.event.createdAtEpochMs,
            isOwn: event.creatorUserId === this.syncAgent.userId,
            dmStreamId: dm.data.id
          })
        }
      })
    })

    this.dmSubscriptions.set(userId, unsubscribe)
    return unsubscribe
  }

  async loadDMHistory(userId: string, limit: number = 50): Promise<any[]> {
    const dm = this.syncAgent.dms.getDmWithUserId(userId)
    
    // Load more messages if needed
    await dm.timeline.loadMore?.(limit)
    
    return dm.timeline.events.value
      .filter(e => e.content?.kind === 'ChannelMessage')
      .slice(-limit)
      .map(event => ({
        eventId: event.hashStr,
        message: event.content.content.body,
        senderId: event.creatorUserId,
        timestamp: event.event.createdAtEpochMs,
        isOwn: event.creatorUserId === this.syncAgent.userId
      }))
  }

  cleanup() {
    this.dmSubscriptions.forEach(unsubscribe => unsubscribe())
    this.dmSubscriptions.clear()
  }
}
```

### Group Direct Messages (GDMs)

#### GDM Creation & Management
```typescript
class GDMManager {
  constructor(private syncAgent: SyncAgent) {}

  async createGroupDM(
    userIds: string[], 
    groupName?: string
  ): Promise<string> {
    try {
      const gdmStreamId = await this.syncAgent.gdms.createGDM(
        userIds,
        groupName || `Group Chat (${userIds.length + 1} members)`
      )
      
      console.log('Created GDM:', gdmStreamId)
      return gdmStreamId
      
    } catch (error) {
      console.error('Failed to create GDM:', error)
      throw error
    }
  }

  getAllUserGDMs(): string[] {
    return this.syncAgent.gdms.data.streamIds
  }
}
```

### DM vs Channel Key Differences

```typescript
// ✅ DMs - No space required
const dm = syncAgent.dms.getDmWithUserId(otherUserId)
await dm.sendMessage('Private message')

// ✅ Channels - Require space membership
const space = syncAgent.spaces.getSpace(spaceId)
const channel = space.getChannel(channelId)
await channel.sendMessage('Public message')

// ✅ DM Stream IDs - Different format
const dmStreamId = makeDMStreamId(userId1, userId2) // dm_...
const channelStreamId = makeChannelStreamId(spaceAddress) // channel_...
```

---

## Observable Patterns & React Integration

### Reactive Data Patterns
```typescript
// All SDK data is reactive via observables
import { Observable } from '@towns-protocol/sdk'

// Subscribe to changes
const unsubscribe = observable.subscribe(
  (data) => {
    console.log('Data updated:', data)
  },
  {
    fireImediately: true, // Get current value immediately
    onError: (error) => console.error(error)
  }
)

// Cleanup
unsubscribe()
```

### Combining Observables
```typescript
import { combine } from '@towns-protocol/sdk'

// Combine multiple data sources
const combined = combine(
  [space.observable, channel.observable],
  ([spaceData, channelData]) => ({
    spaceName: spaceData.metadata?.name,
    channelName: channelData.metadata?.name,
    isReady: spaceData.initialized && channelData.isJoined
  })
)

combined.subscribe((result) => {
  console.log('Combined data:', result)
})
```

---

## Entitlements System (Access Control)

### Understanding Entitlements
Entitlements control access to spaces and channels based on:
- Token ownership (ERC-20, ERC-721, ERC-1155)
- User whitelists
- Payment requirements
- Custom rule contracts

### Entitlement Types
```typescript
// User Entitlement - Direct user access
interface UserEntitlement {
  type: 'user'
  users: string[]  // Array of allowed user addresses
}

// Rule Entitlement - Token/contract-based access
interface RuleEntitlement {
  type: 'rule'
  contractAddress: string
  tokenId?: string
  minBalance?: string
  chainId: number
}

// Payment Entitlement - Subscription-based
interface PaymentEntitlement {
  type: 'payment'
  amount: string
  currency: string
  duration: number
}
```

### Checking Entitlements
```typescript
// Check if user can access space
const canJoinSpace = await syncAgent.spaces.spaceDapp.isEntitledToSpace(
  spaceId,
  userAddress,
  'JoinSpace' // Permission type
)

// Check channel access
const canReadChannel = await syncAgent.spaces.spaceDapp.isEntitledToChannel(
  spaceId,
  channelId,
  userAddress,
  'Read'
)

// Available permissions
const permissions = [
  'JoinSpace',
  'Read',
  'Write', 
  'Invite',
  'BanMember',
  'Redact'
]
```

### Cross-Chain Entitlements
```typescript
// Entitlements can reference assets on different chains
const crossChainRule = {
  contractAddress: '0x...', // Contract on Ethereum mainnet
  chainId: 1,                // Ethereum mainnet
  minBalance: '1000000000000000000' // 1 token
}

// The system automatically validates across supported chains
```

---

## Performance and Optimization

### High Priority Streams
```typescript
// Prioritize important streams for faster sync
const syncAgent = new SyncAgent({
  // ... other config
  highPriorityStreamIds: [
    'important-space-id',
    'urgent-channel-id'
  ]
})
```

### Persistence Control
```typescript
// Disable persistence for testing/temporary use
const syncAgent = new SyncAgent({
  // ... other config
  disablePersistenceStore: true
})
```

### Debug Configuration
```typescript
// Enable debugging in browser console
localStorage.debug = 'csb:*'

// Or in Node.js
process.env.DEBUG = 'csb:*'

// Specific components
localStorage.debug = 'csb:syncAgent:*,csb:space:*'

// Switch to JSON transport for readable network traffic
localStorage.RIVER_DEBUG_TRANSPORT = 'true'
```

---

## Advanced Bot Patterns and Templates

### Template 1: Basic Bot (Universal)
```typescript
import { makeTownsBot } from '@towns-protocol/bot'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

// Database import (choose based on runtime)
// For Bun:
import { Database } from 'bun:sqlite'
// For Node.js:
// import Database from 'better-sqlite3'

const bot = await makeTownsBot(
  process.env.APP_PRIVATE_DATA_BASE64!,
  process.env.JWT_SECRET!
)

// Basic message handler
bot.onMessage(async (handler, { message, userId, channelId, spaceId }) => {
  // Skip bot's own messages
  if (userId === bot.botId) return
  
  // Your bot logic here
  console.log(`Message from ${userId}: ${message}`)
})

// Basic mention handler
bot.onMentioned(async (handler, { message, channelId }) => {
  await handler.sendMessage(channelId, "Hello! I'm your Towns bot!")
})

// Start bot server
const { jwtMiddleware, handler } = await bot.start()

const app = new Hono()
app.post('/webhook', jwtMiddleware, handler)
app.get('/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }))

const port = process.env.PORT || 5123
serve({ fetch: app.fetch, port: Number(port) })
console.log(`🤖 Bot running on port ${port}`)
```

### Template 2: Stats and Analytics Bot
```typescript
// Stats tracking pattern
const statsDB = new Database('bot-stats.db')

bot.onMessage(async (handler, event) => {
  // Track message statistics
  trackUserActivity(event.userId, event.spaceId, 'message')
})

bot.onReaction(async (handler, event) => {
  // Track reaction statistics  
  trackUserActivity(event.userId, event.spaceId, 'reaction')
})

bot.onMentioned(async (handler, { message, channelId, spaceId }) => {
  if (message.includes('stats')) {
    const stats = generateCommunityStats(spaceId)
    await handler.sendMessage(channelId, formatStatsMessage(stats))
  }
})
```

### Template 3: Interactive Command Bot
```typescript
// Command processing pattern
const commands = new Map()

commands.set('help', async (handler, event) => {
  await handler.sendMessage(event.channelId, getHelpMessage())
})

commands.set('info', async (handler, event) => {
  const userInfo = await getUserInfo(event.userId)
  await handler.sendMessage(event.channelId, formatUserInfo(userInfo))
})

bot.onMentioned(async (handler, event) => {
  const command = parseCommand(event.message)
  const commandHandler = commands.get(command.name)
  
  if (commandHandler) {
    await commandHandler(handler, event)
  } else {
    await handler.sendMessage(event.channelId, "Unknown command. Type @bot help for available commands.")
  }
})
```

---

## COMPLETE MASTER CHECKLIST FOR AI AGENTS

### 📋 MANDATORY REQUIREMENTS CHECKLIST

#### ✅ Environment Setup Requirements
- [ ] **Bun Runtime 1.2.20+** (Preferred) OR **Node.js 18+** (npm issues fixed)
- [ ] **TypeScript 5.0+** with proper configuration
- [ ] **esbuild bundler** configured for ESM output
- [ ] **Environment variables** properly secured (.env file)
- [ ] **Git repository** initialized with proper .gitignore
- [ ] **Database setup** (bun:sqlite for Bun, better-sqlite3 for Node.js)

#### ✅ SDK Dependencies Requirements
```typescript
// EXACT versions that work (tested in production)
"@towns-protocol/bot": "^0.0.323"     // MINIMUM for adminRemoveEvent
"@towns-protocol/sdk": "^0.0.321"     // Core SDK functionality
"@towns-protocol/proto": "latest"     // Protocol definitions
"@hono/node-server": "^1.14.0"        // HTTP server
"hono": "^4.7.11"                     // Web framework
"@types/bun": "latest"                // Bun type definitions
```

#### ✅ Bot Permissions Requirements
- [ ] **Read** - Access messages and events (MANDATORY)
- [ ] **Write** - Send messages and reactions (MANDATORY)
- [ ] **Redact** - Delete other users' messages (for moderation)
- [ ] **React** - Add reactions to messages
- [ ] **JoinSpace** - Auto-join capabilities
- [ ] **ModifyBanning** - Ban/unban users (admin bots)
- [ ] **PinMessage** - Pin/unpin messages
- [ ] **AddRemoveChannels** - Channel management
- [ ] **ModifySpaceSettings** - Space configuration

#### ✅ Authentication Requirements
- [ ] **APP_PRIVATE_DATA_BASE64** from Towns Developer Portal
- [ ] **JWT_SECRET** from Towns Developer Portal
- [ ] **Webhook URL** configured with `/webhook` endpoint
- [ ] **Bot permissions** properly configured in space

### 📚 COMPLETE SDK CAPABILITIES INVENTORY

#### 🤖 Bot SDK (@towns-protocol/bot) Functions
```typescript
// Event Handlers (ALL available)
bot.onMessage()           // Primary message handler
bot.onMentioned()         // Bot mention handler  
bot.onReply()             // Reply to bot handler
bot.onThreadMessage()     // Thread message handler
bot.onMentionedInThread() // Thread mention handler
bot.onReaction()          // Reaction handler
bot.onTip()               // Tip handler (TODO: not implemented)
bot.onChannelJoin()       // User join handler
bot.onChannelLeave()      // User leave handler
bot.onMessageEdit()       // Message edit handler
bot.onRedaction()         // Message deletion handler
bot.onEventRevoke()       // Event revoke handler
bot.onStreamEvent()       // Raw protocol event handler

// Message Operations (ALL available)
handler.sendMessage()     // Send channel/DM messages
handler.sendDm()          // Send direct messages
handler.editMessage()     // Edit bot's messages
handler.removeEvent()     // Delete bot's messages
handler.adminRemoveEvent() // Delete other users' messages
handler.sendReaction()    // Add reactions

// Identity Operations (ALL available)
handler.setUsername()     // Set bot username
handler.setDisplayName()  // Set bot display name
handler.setUserProfileImage() // Set bot profile image
handler.getUserData()     // Get user data (deprecated)

// Web3 Operations (ALL available)
handler.writeContract()   // Write blockchain contracts
handler.readContract()    // Read blockchain contracts
```

#### 🔧 Core SDK (@towns-protocol/sdk) Capabilities
```typescript
// Client Access
bot.client                // Access to ClientV2 instance
bot.botId                 // Bot's user ID
bot.viemClient            // Web3 client instance

// Stream Management
client.stream(streamId)   // Get stream instance
stream.view               // Stream state view
stream.view.members       // Member management
stream.view.memberMetadata // Member metadata

// Utility Functions
isChannelStreamId()       // Detect channel streams
isDMChannelStreamId()     // Detect DM streams
isGDMChannelStreamId()    // Detect group DM streams
isDefaultChannelId()      // Detect default channel
```

#### 📝 Message Types and Structures
```typescript
// Event Payload Structure (EXACT)
interface BasePayload {
  userId: string      // User wallet address
  spaceId: string     // Space identifier
  channelId: string   // Channel identifier  
  eventId: string     // Event identifier
}

// Message Event (EXACT)
interface MessageEvent extends BasePayload {
  message: string     // Decrypted content
  isDm: boolean       // Direct message flag
  isGdm: boolean      // Group DM flag
}

// Reaction Event (EXACT)
interface ReactionEvent {
  reaction: string    // Emoji string
  messageId: string   // Target message ID
  userId: string      // Reactor user ID
  channelId: string   // Channel ID
  spaceId: string     // Space ID
}

// Message Options (EXACT)
interface MessageOpts {
  threadId?: string                              // Thread ID
  replyId?: string                               // Reply message ID
  mentions?: ChannelMessage_Post_Mention[]       // User mentions
  attachments?: ChannelMessage_Post_Attachment[] // File attachments
}
```

### 🤖 AI AGENT RULES AND INSTRUCTIONS

#### 🚨 CRITICAL RULES (NEVER VIOLATE)

##### Rule 1: Runtime Requirements
```typescript
// ✅ ALWAYS use Bun for Towns Protocol bots
"scripts": {
  "start": "bun run dist/index.mjs"  // CORRECT
}

// ❌ NEVER use Node.js start command
"scripts": {
  "start": "node dist/index.mjs"     // BREAKS - ABI issues
}
```

##### Rule 2: Package Versions
```typescript
// ✅ ALWAYS use these EXACT minimum versions
"@towns-protocol/bot": "^0.0.323"   // adminRemoveEvent available
"@towns-protocol/sdk": "^0.0.321"   // Core functionality

// ❌ NEVER use older versions
"@towns-protocol/bot": "^0.0.320"   // Missing adminRemoveEvent
```

##### Rule 3: Database Choice
```typescript
// ✅ ALWAYS use bun:sqlite
import { Database } from 'bun:sqlite'

// ❌ NEVER use better-sqlite3 with Bun
import Database from 'better-sqlite3'  // ABI version mismatch
```

##### Rule 4: Message Deletion
```typescript
// ✅ CORRECT: Use adminRemoveEvent for other users
await handler.adminRemoveEvent(channelId, messageId)

// ❌ INCORRECT: removeEvent only works for bot's messages
await handler.removeEvent(channelId, messageId)  // Won't delete user messages
```

##### Rule 5: Bot Message Filtering
```typescript
// ✅ ALWAYS filter bot's own messages
bot.onMessage(async (handler, { userId }) => {
  if (userId === bot.botId) return  // MANDATORY
  // ... handle user messages
})

// ❌ NEVER process bot's own messages
// Creates infinite loops and spam
```

#### 📐 IMPLEMENTATION PATTERNS (PROVEN)

##### Pattern 1: Event Handler Structure
```typescript
// ✅ CORRECT: Complete error handling
bot.onMessage(async (handler, event) => {
  try {
    const { message, userId, channelId, spaceId, eventId, isDm, isGdm } = event
    
    // Skip bot messages
    if (userId === bot.botId) return
    
    // Handle different message types
    if (isDm) {
      // DM logic
    } else if (isGdm) {
      // Group DM logic
    } else {
      // Channel logic
    }
    
  } catch (error) {
    console.error('Message handler error:', error)
    // Never let handler crash
  }
})
```

##### Pattern 2: Database Integration
```typescript
// ✅ CORRECT: Bun SQLite with proper initialization
import { Database } from 'bun:sqlite'

const db = new Database('bot.db')

// Initialize tables
db.run(`CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  verified INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
)`)

// ❌ NEVER use db.exec (deprecated)
db.exec('CREATE TABLE...') // Throws deprecation warning
```

##### Pattern 3: Verification System
```typescript
// ✅ CORRECT: Reaction-based verification
bot.onReaction(async (handler, { reaction, messageId, userId }) => {
  if (reaction === 'white_check_mark') {
    // Update user verification status
    db.run('UPDATE users SET verified = 1 WHERE id = ?', [userId])
  }
})
```

##### Pattern 4: Moderation Patterns
```typescript
// ✅ CORRECT: Tiered response system
const violation = checkContent(message)
if (violation) {
  switch (violation.action) {
    case 'delete':
      await handler.adminRemoveEvent(channelId, eventId)
      await handler.sendMessage(channelId, violation.userMessage)
      break
    case 'warn':
      await handler.sendMessage(channelId, violation.userMessage)
      break
    case 'educate':
      await handler.sendMessage(channelId, violation.userMessage)
      break
  }
}
```

#### 🎯 AI AGENT DEVELOPMENT WORKFLOW

##### Step 1: Project Setup Validation
```typescript
// AI MUST verify these exist:
✅ package.json with correct dependencies
✅ tsconfig.json with bun-types
✅ esbuild.config.mjs with ESM output
✅ .env with bot credentials
✅ src/index.ts with basic bot structure
```

##### Step 2: Core Functionality Implementation
```typescript
// AI MUST implement in this order:
1. Bot instance creation with makeTownsBot()
2. Basic event handlers (onMessage, onMentioned)
3. Server setup with Hono and webhook endpoint
4. Health check endpoint for monitoring
5. Error handling and logging
```

##### Step 3: Advanced Features (Optional)
```typescript
// AI CAN add these if requested:
✅ Database integration (bun:sqlite or better-sqlite3)
✅ User verification system
✅ Moderation capabilities
✅ Stats tracking
✅ Command processing
✅ DM handling
✅ Thread support
```

#### 🚫 NEVER DO THESE (CRITICAL FAILURES)

##### Never Use These Packages
```typescript
❌ "better-sqlite3"           // ABI mismatch with Bun
❌ "sqlite3"                  // Use bun:sqlite instead
❌ "node-sqlite3"             // Use bun:sqlite instead
❌ "@towns-protocol/bot": "^0.0.320" // Missing adminRemoveEvent
```

##### Never Use These Patterns
```typescript
❌ db.exec()                  // Deprecated in bun:sqlite
❌ handler.removeEvent() for user messages // Only works for bot messages
❌ process.exit() in handlers // Crashes the bot
❌ Synchronous database operations in handlers // Blocks event loop
```

##### Never Ignore These Requirements
```typescript
❌ Skip bot message filtering  // Creates infinite loops
❌ Missing error handling      // Crashes on errors
❌ No health check endpoint    // Can't monitor bot status
❌ Hardcoded credentials       // Security vulnerability
```

### 🎯 AI SUCCESS VALIDATION CHECKLIST

#### ✅ Code Quality Validation
- [ ] All event handlers have try/catch blocks
- [ ] Bot filters its own messages with `userId === bot.botId`
- [ ] Database operations use appropriate syntax (bun:sqlite or better-sqlite3)
- [ ] Message deletion uses correct function (adminRemoveEvent vs removeEvent)
- [ ] Environment variables are properly typed and validated

#### ✅ Functionality Validation  
- [ ] Bot responds to mentions appropriately
- [ ] Message moderation works without false positives
- [ ] User verification system functions correctly
- [ ] Database persistence works across restarts
- [ ] Health check endpoint returns valid JSON

#### ✅ Production Readiness
- [ ] All dependencies use exact working versions
- [ ] Build process generates correct ESM output
- [ ] Environment variables are documented
- [ ] Error logging provides actionable information
- [ ] Bot handles network failures gracefully

**This knowledge.** 🚀
