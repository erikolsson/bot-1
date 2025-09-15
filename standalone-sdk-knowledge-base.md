# Towns Protocol Standalone SDK Knowledge Base

## CLAUDE AI RULES AND FORMATTING
- This document is specifically formatted for Claude AI code assistance
- Use exact function signatures and TypeScript types
- Provide complete code examples with imports
- Reference specific file paths when relevant
- Maintain hierarchical structure for easy navigation

---

## TABLE OF CONTENTS
1. [Architecture Overview](#architecture-overview)
2. [Standalone Client Integration](#standalone-client-integration)
3. [React SDK Integration](#react-sdk-integration)
4. [Core SDK Functions](#core-sdk-functions)
5. [Space Management](#space-management)
6. [Channel Operations](#channel-operations)
7. [Messaging System](#messaging-system)
8. [Direct Messages & Group DMs](#direct-messages--group-dms)
9. [User Management](#user-management)
10. [Entitlements System](#entitlements-system)
11. [Workers and Space Creation](#workers-and-space-creation)
12. [Authentication & Security](#authentication--security)
13. [Observable Patterns](#observable-patterns)
14. [Error Handling](#error-handling)
15. [Testing Patterns](#testing-patterns)

---

## ARCHITECTURE OVERVIEW

### Core Components
```typescript
// Main SDK exports from packages/sdk/src/index.ts
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

### Dual Architecture
- **Base Chain**: Ethereum L2 (Base) for smart contracts, memberships, entitlements
- **River Chain**: Custom L2 for real-time messaging and state synchronization
- **Diamond Pattern**: Modular smart contract architecture for spaces

---

## STANDALONE CLIENT INTEGRATION

### Basic Client Setup
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

### Advanced SyncAgent Setup
```typescript
import { 
  SyncAgent, 
  makeRiverConfig, 
  makeSignerContext,
  RiverDbManager 
} from '@towns-protocol/sdk'
import { ethers } from 'ethers'

const config = makeRiverConfig('gamma')
const wallet = new ethers.Wallet('0x...')
const delegateWallet = ethers.Wallet.createRandom()
const signerContext = await makeSignerContext(wallet, delegateWallet)

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

---

## REACT SDK INTEGRATION

### Provider Setup
```typescript
// App.tsx
import React from 'react'
import { 
  TownsSyncProvider, 
  useAgentConnection 
} from '@towns-protocol/react-sdk'
import { makeRiverConfig } from '@towns-protocol/sdk'
import { WagmiProvider } from 'wagmi'

const riverConfig = makeRiverConfig("gamma")

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <TownsSyncProvider>
        <MyComponent />
      </TownsSyncProvider>
    </WagmiProvider>
  )
}

function MyComponent() {
  const { connect, isConnecting, isConnected } = useAgentConnection()
  const signer = useEthersSigner() // From wagmi integration
  
  const handleConnect = async () => {
    if (signer) {
      await connect(signer, { riverConfig })
    }
  }
  
  return (
    <button onClick={handleConnect} disabled={isConnecting}>
      {isConnected ? 'Connected' : 'Connect to Towns'}
    </button>
  )
}
```

### Complete React Hook Reference
```typescript
// SPACE HOOKS
import { 
  useSpace,           // Get space data
  useCreateSpace,     // Create new space
  useJoinSpace,       // Join existing space
  useUserSpaces       // Get user's spaces
} from '@towns-protocol/react-sdk'

// CHANNEL HOOKS  
import {
  useChannel,         // Get channel data
  useCreateChannel,   // Create new channel
  useTimeline,        // Get message timeline
  useScrollback       // Load message history
} from '@towns-protocol/react-sdk'

// MESSAGING HOOKS - ⚠️ REQUIRE CHANNEL IDs, NOT SPACE IDs
import {
  useSendMessage,     // Send messages (needs channelId!)
  useSendReaction,    // Send reactions (needs channelId!)
  useRedact,          // Redact own messages (needs channelId!)
  useAdminRedact,     // Admin message deletion (needs channelId!)
  useReactions,       // Get message reactions (needs channelId!)
  useThreads          // Manage message threads (needs channelId!)
} from '@towns-protocol/react-sdk'

// USER & MEMBER HOOKS
import {
  useMember,          // Get member info
  useMemberList,      // Get channel members
  useMyMember         // Get current user info
} from '@towns-protocol/react-sdk'

// DIRECT MESSAGE HOOKS
import {
  useDm,              // Get DM channel
  useGdm,             // Get group DM
  useCreateDm,        // Create DM
  useCreateGdm,       // Create group DM
  useUserDms,         // Get user's DMs
  useUserGdms         // Get user's GDMs
} from '@towns-protocol/react-sdk'

// CORE HOOKS
import {
  useSyncAgent,       // Direct agent access
  useAgentConnection, // Connection management
  useTowns,           // Global state access
  useObservable       // Observable integration
} from '@towns-protocol/react-sdk'
```

---

## CORE SDK FUNCTIONS

### SyncAgent Core Methods
```typescript
// Access through syncAgent instance
const syncAgent = new SyncAgent(config)

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

// Lifecycle
await syncAgent.start()  // Initialize and connect
await syncAgent.stop()   // Cleanup and disconnect
```

---

## CRITICAL UNDERSTANDING: SPACES vs CHANNELS

### ⚠️ IMPORTANT DISTINCTION
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

## SPACE MANAGEMENT

### Creating Spaces
```typescript
// Using SyncAgent
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

// Using React Hook
const { createSpace, isLoading, error } = useCreateSpace()

const handleCreateSpace = async () => {
  try {
    const result = await createSpace(
      'My Space',
      signer,
      {
        shortDescription: 'Community description',
        membership: defaultMembershipInfo
      }
    )
    // ✅ CRITICAL: Space creation returns BOTH spaceId AND defaultChannelId
    console.log('Space created:', result.spaceId)
    console.log('Default channel created:', result.defaultChannelId)
    
    // ✅ IMPORTANT: Save both IDs - you need channelId for messaging
    setCurrentSpaceId(result.spaceId)
    setCurrentChannelId(result.defaultChannelId) // Messages go to channels, not spaces!
    
  } catch (err) {
    console.error('Failed to create space:', err)
  }
}
```

### Joining Spaces
```typescript
// Get space instance
const space = syncAgent.spaces.getSpace(spaceId)

// Join space (mints membership NFT)
await space.join(signer, {
  skipMintMembership: false // Set true to skip NFT minting
})

// Using React Hook
const { joinSpace, isLoading } = useJoinSpace()
await joinSpace(spaceId, signer)
```

### Space Data Access
```typescript
// Standalone
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

// React Hook
const { data: space, isLoading } = useSpace(spaceId)
console.log('Space name:', space?.metadata?.name)
console.log('Channels in space:', space?.channelIds) // ✅ List of channels

// ✅ CRITICAL: To send messages, you need a channelId, not spaceId
const defaultChannelId = space?.channelIds?.[0] // Get first channel (usually "general")
```

### Creating Channels in Spaces
```typescript
// Standalone
const space = syncAgent.spaces.getSpace(spaceId)
const { channelId } = await space.createChannel(
  'announcements',    // Channel name
  'Important updates', // Channel description
  signer
)

// React Hook
const { createChannel, isLoading } = useCreateChannel(spaceId)
const result = await createChannel('general', signer)
```

---

## CHANNEL OPERATIONS

### Channel Management
```typescript
// Get channel instance
const space = syncAgent.spaces.getSpace(spaceId)
const channel = space.getChannel(channelId)

// Channel data access
channel.subscribe((channelData) => {
  console.log('Channel metadata:', channelData.metadata)
  console.log('Is joined:', channelData.isJoined)
  console.log('Space ID:', channelData.spaceId)
})

// Join channel
await channel.join()

// React Hook
const { data: channel } = useChannel(spaceId, channelId)
```

### Channel Timeline
```typescript
// Standalone - Message timeline
const timeline = channel.timeline

// Subscribe to new messages
timeline.events.subscribe((events) => {
  events.forEach(event => {
    if (event.content?.kind === 'ChannelMessage') {
      console.log('New message:', event.content.content.body)
    }
  })
})

// React Hook
const { data: events } = useTimeline(channelId)
const messages = events?.filter(e => e.content?.kind === 'ChannelMessage')
```

### Scrollback (Message History)
```typescript
// React Hook for loading message history
const { loadMore, hasMore, isLoading } = useScrollback(channelId)

const loadOlderMessages = async () => {
  if (hasMore && !isLoading) {
    await loadMore()
  }
}
```

---

## MESSAGING SYSTEM

### ⚠️ PREREQUISITE: Understanding Channel vs Space IDs

**Before sending messages, ensure you have a `channelId`, not a `spaceId`:**

```typescript
// ✅ CORRECT FLOW: Space creation → Get channel → Send message
const { spaceId, defaultChannelId } = await syncAgent.spaces.createSpace({...})

// Method 1: Use the returned defaultChannelId
const channel = space.getChannel(defaultChannelId)
await channel.sendMessage('Hello!')

// Method 2: Get default channel
const defaultChannel = space.getDefaultChannel()
await defaultChannel.sendMessage('Hello!')

// Method 3: Wait for space to load and get first channel
space.subscribe((spaceData) => {
  if (spaceData.channelIds.length > 0) {
    const firstChannelId = spaceData.channelIds[0]
    const channel = space.getChannel(firstChannelId)
    channel.sendMessage('Hello!')
  }
})
```

### Sending Messages
```typescript
// Standalone
const { eventId } = await channel.sendMessage(
  'Hello everyone!',
  {
    threadId: 'thread-event-id',     // Optional: reply in thread
    replyId: 'message-event-id',     // Optional: reply to message
    mentions: [{                     // Optional: mention users
      userId: 'user-id',
      displayName: 'User Name'
    }],
    attachments: [{                  // Optional: attach files/media
      type: 'image',
      url: 'https://example.com/image.jpg',
      title: 'Image title'
    }]
  }
)

// React Hook
const { sendMessage, isLoading, error } = useSendMessage(channelId)

const handleSend = async () => {
  try {
    const result = await sendMessage('Hello!', {
      mentions: [{ userId: 'user123', displayName: 'John' }]
    })
    console.log('Message sent:', result.eventId)
  } catch (err) {
    console.error('Send failed:', err)
  }
}
```

### Message Editing
```typescript
// Edit existing message
await channel.editMessage(
  eventId,           // Original message event ID
  'Updated message', // New content
  {
    mentions: [],    // Updated mentions
    attachments: []  // Updated attachments
  }
)
```

### Reactions
```typescript
// Standalone - Add reaction
await channel.sendReaction(messageEventId, '👍')

// React Hook
const { sendReaction } = useSendReaction(channelId)
await sendReaction(messageEventId, '🚀')

// Get reactions for message
const { data: reactions } = useReactions(channelId, messageEventId)
```

### Message Redaction
```typescript
// Redact own message
const { redact } = useRedact(channelId)
await redact({ eventId: messageEventId })

// Admin redaction (requires permissions)
const { adminRedact } = useAdminRedact(channelId)
await adminRedact({ eventId: messageEventId })
```

---

## DIRECT MESSAGES & GROUP DMS

### 🔒 DM Architecture Overview

Direct Messages in Towns Protocol are **separate streams** from space channels:
- **DMs** = Private 1-on-1 conversations 
- **GDMs** = Private group conversations (multiple users)
- **End-to-end encrypted** by default
- **Independent** of spaces - users can DM without being in same space
- **Persistent** - messages survive even if users leave spaces

### Direct Messages - Standalone Implementation

#### 1. **DM Initialization & Discovery**
```typescript
import { SyncAgent, userIdFromAddress, makeDMStreamId } from '@towns-protocol/sdk'

class DMManager {
  constructor(private syncAgent: SyncAgent) {}

  async initializeDMs() {
    // Wait for user memberships to load
    await new Promise(resolve => {
      this.syncAgent.user.memberships.subscribe((memberships) => {
        if (memberships.status === 'loaded') {
          resolve(void 0)
        }
      })
    })

    // Get all existing DM streams
    const dmStreams = this.syncAgent.dms.data.streamIds
    console.log('Existing DMs:', dmStreams)

    // Subscribe to new DMs
    this.syncAgent.dms.subscribe((dmsData) => {
      console.log('DMs updated:', dmsData.streamIds)
      this.onDMsChanged(dmsData.streamIds)
    })
  }

  private onDMsChanged(streamIds: string[]) {
    streamIds.forEach(streamId => {
      const dm = this.syncAgent.dms.getDm(streamId)
      this.setupDMSubscription(dm)
    })
  }

  private setupDMSubscription(dm: Dm) {
    // Subscribe to DM messages
    dm.timeline.events.subscribe((events) => {
      events.forEach(event => {
        if (event.content?.kind === 'ChannelMessage') {
          this.handleDMMessage(event, dm.data.id)
        }
      })
    })
  }
}
```

#### 2. **Creating DMs**
```typescript
class DMManager {
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

  // Alternative: Create DM by deterministic ID
  async getOrCreateDMWithUser(otherUserId: string): Promise<Dm> {
    const dmStreamId = makeDMStreamId(this.syncAgent.userId, otherUserId)
    
    try {
      // Try to get existing DM
      return this.syncAgent.dms.getDm(dmStreamId)
    } catch {
      // Create if doesn't exist
      await this.syncAgent.dms.createDM([otherUserId], 'Direct Message')
      return this.syncAgent.dms.getDm(dmStreamId)
    }
  }
}
```

#### 3. **DM Messaging System**
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

#### 4. **DM Timeline Management**
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

### Group Direct Messages - Standalone Implementation

#### 1. **GDM Creation & Management**
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

  async addUserToGDM(gdmStreamId: string, userId: string): Promise<void> {
    const gdm = this.syncAgent.gdms.getGdm(gdmStreamId)
    // Note: Adding users to existing GDM may require creating new GDM
    // This depends on the protocol's GDM implementation
    console.warn('Adding users to existing GDM may require protocol update')
  }

  getAllUserGDMs(): string[] {
    return this.syncAgent.gdms.data.streamIds
  }
}
```

#### 2. **GDM Messaging**
```typescript
class GDMMessaging {
  constructor(private syncAgent: SyncAgent) {}

  async sendGDMMessage(
    gdmStreamId: string,
    message: string,
    options?: {
      replyId?: string
      mentions?: any[]
      attachments?: any[]
    }
  ): Promise<{ eventId: string }> {
    const gdm = this.syncAgent.gdms.getGdm(gdmStreamId)
    
    return await gdm.sendMessage(message, {
      replyId: options?.replyId,
      mentions: options?.mentions || [],
      attachments: options?.attachments || []
    })
  }

  subscribeToGDM(gdmStreamId: string, onMessage: (event: any) => void): () => void {
    const gdm = this.syncAgent.gdms.getGdm(gdmStreamId)
    
    return gdm.timeline.events.subscribe((events) => {
      events.forEach(event => {
        if (event.content?.kind === 'ChannelMessage') {
          onMessage({
            eventId: event.hashStr,
            message: event.content.content.body,
            senderId: event.creatorUserId,
            timestamp: event.event.createdAtEpochMs,
            isOwn: event.creatorUserId === this.syncAgent.userId,
            gdmStreamId
          })
        }
      })
    })
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

### DM Encryption Specifics

```typescript
class DMEncryption {
  constructor(private syncAgent: SyncAgent) {}

  async initializeDMEncryption(otherUserId: string): Promise<void> {
    // DMs are automatically end-to-end encrypted
    // The SDK handles key exchange transparently
    
    const dm = this.syncAgent.dms.getDmWithUserId(otherUserId)
    
    // Wait for encryption setup
    await new Promise(resolve => {
      dm.subscribe((dmData) => {
        if (dmData.isJoined && dmData.initialized) {
          resolve(void 0)
        }
      })
    })
    
    console.log('DM encryption ready')
  }

  // Encryption is handled automatically by the SDK
  // No manual key management required
}
```

### Complete DM App Example

```typescript
class StandaloneDMApp {
  private dmManager: DMManager
  private messaging: DMMessaging
  private timeline: DMTimeline
  private gdmManager: GDMManager

  constructor(private syncAgent: SyncAgent) {
    this.dmManager = new DMManager(syncAgent)
    this.messaging = new DMMessaging(syncAgent)
    this.timeline = new DMTimeline(syncAgent)
    this.gdmManager = new GDMManager(syncAgent)
  }

  async initialize(): Promise<void> {
    await this.syncAgent.start()
    await this.dmManager.initializeDMs()
    console.log('DM App initialized')
  }

  async startChatWithUser(userAddress: string): Promise<void> {
    const userId = userIdFromAddress(userAddress)
    
    // Create or get existing DM
    const dmStreamId = await this.dmManager.createDMWithUser(userAddress)
    
    // Subscribe to messages
    this.timeline.subscribeToUserDM(userId, (message) => {
      console.log('New DM:', message)
      this.displayMessage(message)
    })
    
    // Load message history
    const history = await this.timeline.loadDMHistory(userId, 50)
    history.forEach(message => this.displayMessage(message))
  }

  async sendMessage(recipientAddress: string, message: string): Promise<void> {
    const userId = userIdFromAddress(recipientAddress)
    await this.messaging.sendDMMessage(userId, message)
  }

  private displayMessage(message: any): void {
    // Your UI logic here
    console.log(`[${message.timestamp}] ${message.senderId}: ${message.message}`)
  }

  async cleanup(): Promise<void> {
    this.timeline.cleanup()
    await this.syncAgent.stop()
  }
}

// Usage
const app = new StandaloneDMApp(syncAgent)
await app.initialize()
await app.startChatWithUser('0x1234...') // Start DM with user
await app.sendMessage('0x1234...', 'Hello!') // Send message
```

### Error Handling for DMs

```typescript
class DMErrorHandler {
  static async handleDMOperation<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T | null> {
    try {
      return await operation()
    } catch (error) {
      console.error(`DM ${context} failed:`, error)
      
      if (error.message.includes('not found')) {
        console.log('DM stream not found, creating new one...')
        // Handle DM creation
      } else if (error.message.includes('permission')) {
        console.log('No permission to access DM')
        // Handle permission errors
      } else if (error.message.includes('encryption')) {
        console.log('Encryption setup required')
        // Handle encryption errors
      }
      
      return null
    }
  }
}

// Usage
const result = await DMErrorHandler.handleDMOperation(
  () => dm.sendMessage('Hello'),
  'send message'
)
```

---

## USER MANAGEMENT

### Member Information
```typescript
// Get member info for specific stream
const member = channel.members.getMember(userId)

member.subscribe((memberData) => {
  console.log('Display name:', memberData.displayName)
  console.log('Username:', memberData.username)
  console.log('Is member:', memberData.isMember)
  console.log('NFTs:', memberData.nfts)
})

// React Hooks
const { data: member } = useMember(streamId, userId)
const { data: memberList } = useMemberList(streamId)
const { data: myMember } = useMyMember(streamId)
```

### User Settings & Metadata
```typescript
// Access user data
const user = syncAgent.user

// User memberships
user.memberships.subscribe((memberships) => {
  Object.values(memberships.memberships).forEach(membership => {
    console.log('Stream:', membership.streamId)
    console.log('Operation:', membership.op) // JOIN/LEAVE
  })
})

// User inbox
user.inbox.subscribe((inbox) => {
  console.log('Unread count:', inbox.notifications?.length)
})

// User settings
user.settings.subscribe((settings) => {
  console.log('Blocked users:', settings.blockedUserIds)
  console.log('Read markers:', settings.fullyReadMarkers)
})
```

---

## ENTITLEMENTS SYSTEM

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

## WORKERS AND SPACE CREATION

### Factory Contract Integration
The SpaceFactory contract deploys new spaces using the Diamond Pattern:

```typescript
// Factory contract functions
interface SpaceFactory {
  // Main creation function
  createSpace(action: Action, data: bytes): Promise<address>
  
  // Specific creation methods
  createSpace(spaceInfo: SpaceInfo): Promise<address>
  createSpaceWithPrepay(spaceInfo: CreateSpace): Promise<address>
  createSpaceV2(spaceInfo: CreateSpace, options: SpaceOptions): Promise<address>
}

// Creation process
const spaceFactory = new SpaceDapp(chainConfig, provider)
const transaction = await spaceFactory.createSpace(spaceParams, signer)
const receipt = await transaction.wait()
const spaceAddress = spaceFactory.getSpaceAddress(receipt, signerAddress)
```

### Worker Integration Pattern
```typescript
// Background worker for space management
class SpaceWorker {
  constructor(private syncAgent: SyncAgent) {}
  
  async processSpaceCreation(params: CreateSpaceParams) {
    try {
      // 1. Deploy smart contract
      const { spaceId, defaultChannelId } = await this.syncAgent.spaces.createSpace(
        params,
        this.signer
      )
      
      // 2. Initialize messaging layer
      await this.syncAgent.riverConnection.login({ spaceId })
      
      // 3. Setup default permissions
      await this.setupDefaultRoles(spaceId)
      
      // 4. Create initial channels
      await this.createDefaultChannels(spaceId)
      
      return { spaceId, defaultChannelId }
    } catch (error) {
      console.error('Space creation failed:', error)
      throw error
    }
  }
  
  private async setupDefaultRoles(spaceId: string) {
    // Configure default entitlements
    // Set up admin, moderator, member roles
  }
  
  private async createDefaultChannels(spaceId: string) {
    // Create #general, #announcements, etc.
  }
}
```

---

## AUTHENTICATION & SECURITY

### Signer Context
```typescript
// Create signer context with delegate wallet
const mainWallet = new ethers.Wallet(privateKey)
const delegateWallet = ethers.Wallet.createRandom()

const signerContext = await makeSignerContext(mainWallet, delegateWallet)

// Or from bearer token
const signerContext = await makeSignerContextFromBearerToken(jwtToken)
```

### Encryption
```typescript
// End-to-end encryption is automatic
// Configure encryption device
const encryptionDevice = {
  deviceId: 'unique-device-id',
  // Additional encryption settings
}

const client = await createTownsClient({
  privateKey: '0x...',
  env: 'gamma',
  encryptionDevice
})
```

### Permission System
```typescript
// Check permissions before actions
const hasPermission = await channel.members.hasPermission(
  userId,
  'Write' // Permission type
)

if (hasPermission) {
  await channel.sendMessage('Hello!')
}
```

---

## OBSERVABLE PATTERNS

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

### React Observable Integration
```typescript
// useObservable hook for React integration
import { useObservable } from '@towns-protocol/react-sdk'

function MyComponent({ spaceId }: { spaceId: string }) {
  const sync = useSyncAgent()
  const space = useMemo(() => sync.spaces.getSpace(spaceId), [sync, spaceId])
  
  const { data, isLoading, error } = useObservable(space, {
    suspense: false,
    onError: (err) => console.error('Space error:', err)
  })
  
  if (isLoading) return <div>Loading space...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{data.metadata?.name || 'Unnamed Space'}</div>
}
```

---

## ERROR HANDLING

### Common Error Patterns
```typescript
// SDK errors extend base Error class
import { TownsError } from '@towns-protocol/sdk'

try {
  await channel.sendMessage('Hello')
} catch (error) {
  if (error instanceof TownsError) {
    switch (error.code) {
      case 'PERMISSION_DENIED':
        console.log('No permission to send message')
        break
      case 'NETWORK_ERROR':
        console.log('Network connection failed')
        break
      case 'INVALID_STREAM':
        console.log('Stream not found or invalid')
        break
      default:
        console.log('Unknown error:', error.message)
    }
  }
}
```

### React Error Boundaries
```typescript
// Handle errors in React components
function MessageSender({ channelId }: { channelId: string }) {
  const { sendMessage, isLoading, error } = useSendMessage(channelId, {
    onError: (err) => {
      console.error('Failed to send message:', err)
      // Handle error (show toast, retry, etc.)
    },
    onSuccess: (result) => {
      console.log('Message sent successfully:', result.eventId)
    }
  })
  
  return (
    <div>
      {error && <div className="error">Error: {error.message}</div>}
      <button 
        onClick={() => sendMessage('Hello')}
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Message'}
      </button>
    </div>
  )
}
```

### Retry Logic
```typescript
// Configure retry parameters
const syncAgent = new SyncAgent({
  // ... other config
  retryParams: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffFactor: 2
  }
})
```

---

## TESTING PATTERNS

### Test Environment Setup
```typescript
// Use test utilities for SDK testing
import { 
  TestDriver,
  createTestSyncAgent,
  makeTestRiverConfig 
} from '@towns-protocol/sdk'

describe('Space Management', () => {
  let syncAgent: SyncAgent
  
  beforeEach(async () => {
    const config = makeTestRiverConfig()
    syncAgent = await createTestSyncAgent(config)
    await syncAgent.start()
  })
  
  afterEach(async () => {
    await syncAgent.stop()
  })
  
  test('creates space successfully', async () => {
    const { spaceId } = await syncAgent.spaces.createSpace(
      { spaceName: 'Test Space' },
      testSigner
    )
    
    expect(spaceId).toBeDefined()
    
    const space = syncAgent.spaces.getSpace(spaceId)
    await expect(space.data.initialized).resolves.toBe(true)
  })
})
```

### Test Categories
- **Unit Tests**: `/src/tests/unit/` - Fast, isolated component tests
- **Integration (With Entitlements)**: `/src/tests/multi/` - Full functionality with blockchain
- **Integration (No Entitlements)**: `/src/tests/multi_ne/` - Core functionality only
- **V2 Features**: `/src/tests/multi_v2/` - New feature testing

### Bot Development Testing
```typescript
// Bot testing example
import { makeTownsBot } from '@towns-protocol/bot'

const bot = await makeTownsBot(
  process.env.APP_PRIVATE_DATA_BASE64!,
  process.env.JWT_SECRET!,
  'local' // Test environment
)

bot.onMessage(async (handler, { message, channelId }) => {
  if (message === 'test') {
    await handler.sendMessage(channelId, 'Test response')
  }
})

// Test the bot functionality
```

---

## PERFORMANCE OPTIMIZATION

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

### Batch Operations
```typescript
// Use transactions for multiple operations
syncAgent.store.newTransactionGroup('bulk-operations')

try {
  await Promise.all([
    space1.join(signer),
    space2.join(signer),
    space3.join(signer)
  ])
} finally {
  await syncAgent.store.commitTransactionGroup()
}
```

---

## DEBUGGING AND LOGGING

### Debug Configuration
```typescript
// Enable debugging in browser console
localStorage.debug = 'csb:*'

// Or in Node.js
process.env.DEBUG = 'csb:*'

// Specific components
localStorage.debug = 'csb:syncAgent:*,csb:space:*'
```

### Network Debugging
```typescript
// Switch to JSON transport for readable network traffic
localStorage.RIVER_DEBUG_TRANSPORT = 'true'
```

### Logging Levels
- `csb:syncAgent` - SyncAgent operations
- `csb:space` - Space management
- `csb:channel` - Channel operations  
- `csb:rpc` - Network requests
- `csb:client` - Client events

---

## MIGRATION AND VERSIONING

### Version Compatibility
```typescript
// Current SDK version from package.json
const SDK_VERSION = "0.0.282"

// Check compatibility
import { isCompatibleVersion } from '@towns-protocol/sdk'
const compatible = isCompatibleVersion(serverVersion, SDK_VERSION)
```

### Data Migration
```typescript
// Automatic data migrations are handled by the SDK
// Migration functions in packages/sdk/src/migrations/
import { 
  migrateSnapshot,
  snapshotMigration0001,
  snapshotMigration0002
} from '@towns-protocol/sdk'
```

---

## QUICK REFERENCE

### Essential Imports
```typescript
// Core SDK
import { 
  createTownsClient, 
  SyncAgent, 
  makeRiverConfig 
} from '@towns-protocol/sdk'

// React SDK
import { 
  TownsSyncProvider,
  useSyncAgent,
  useSpace,
  useChannel,
  useSendMessage,
  useTimeline
} from '@towns-protocol/react-sdk'

// Web3 Integration
import { SpaceDapp, RiverRegistry } from '@towns-protocol/web3'
```

### Common Patterns
```typescript
// 1. Initialize client
const client = await createTownsClient({ privateKey: '0x...', env: 'gamma' })

// 2. Create space
const { spaceId } = await client.spaces.createSpace({ spaceName: 'My Space' }, signer)

// 3. Join space
await client.spaces.getSpace(spaceId).join(signer)

// 4. Send message
const channel = client.spaces.getSpace(spaceId).getChannel(channelId)
await channel.sendMessage('Hello!')

// 5. Subscribe to updates
channel.timeline.events.subscribe(events => {
  console.log('New events:', events)
})
```

---

## CLAUDE AI SPECIFIC NOTES

When providing code assistance for Towns Protocol SDK:

1. **Always import from correct packages**: `@towns-protocol/sdk` vs `@towns-protocol/react-sdk`
2. **Use TypeScript**: All examples should be properly typed
3. **Async/await**: Most SDK operations are asynchronous
4. **Observable patterns**: Data is reactive, use subscriptions
5. **Error handling**: Wrap SDK calls in try/catch blocks
6. **Signer requirements**: Many operations need ethers.Signer
7. **Environment config**: Use appropriate environment ('gamma', 'alpha', etc.)
8. **Hook dependencies**: React hooks need proper dependency arrays
9. **Cleanup**: Unsubscribe from observables, stop SyncAgent
10. **Testing**: Reference appropriate test patterns for user scenarios

This knowledge base covers the complete Towns Protocol SDK functionality for standalone integrations and React applications. 