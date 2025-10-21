import { create, toBinary, fromBinary } from '@bufbuild/protobuf'
import {
  BotMessage,
  BotMessageSchema,
  ActionRequest,
  ActionRequestSchema,
  SignatureRequest,
  SignatureRequestSchema,
  SignatureType,
  UserResponse,
  UserResponseSchema,
} from './generated/bot-protocol_pb.js'

/**
 * Protocol Type URLs - Used to identify different message types in raw GM
 */
export const PROTOCOL_TYPE_URLS = {
  SIGNATURE_REQUEST: 'bot.protocol.SignatureRequest',
  SIGNATURE_RESPONSE: 'bot.protocol.SignatureResponse',
  INTERACTIVE_MESSAGE: 'bot.protocol.InteractiveMessage',
  USER_RESPONSE: 'bot.protocol.UserResponse',
  // Generic type for any bot protocol message
  BOT_MESSAGE: 'bot.protocol.BotMessage',
} as const

/**
 * Generate a unique ID for tracking messages/components
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Create a signature request
 * This is the primary interactive element for blockchain interactions
 */
export function createSignatureRequest(
  data: string,
  chainId: string,
  options?: {
    title?: string
    subtitle?: string
    message?: string
    type?: SignatureType
    ephemeral?: boolean
  }
): BotMessage {
  const messageId = generateId()

  return create(BotMessageSchema, {
    id: messageId,
    content: {
      case: 'actionRequest',
      value: create(ActionRequestSchema, {
        id: messageId,
        text: options?.message || 'Please sign this message',
        action: {
          case: 'signatureRequest',
          value: create(SignatureRequestSchema, {
            data,
            chainId,
            message: options?.message,
            type: options?.type || SignatureType.PERSONAL_SIGN,
            title: options?.title,
            subtitle: options?.subtitle,
          }),
        },
        ephemeral: options?.ephemeral,
      }),
    },
  })
}


/**
 * Parse a user response from protobuf
 */
export function parseUserResponse(data: Uint8Array): UserResponse | null {
  try {
    return fromBinary(UserResponseSchema, data)
  } catch (error) {
    console.error('Failed to parse user response:', error)
    return null
  }
}


/**
 * Serialize a BotMessage to base64 for sending
 */
export function serializeMessage(message: BotMessage): string {
  const bytes = toBinary(BotMessageSchema, message)
  return Buffer.from(bytes).toString('base64')
}

/**
 * Serialize a BotMessage to Uint8Array for sending via raw GM message
 */
export function serializeMessageToBytes(message: BotMessage): Uint8Array {
  return toBinary(BotMessageSchema, message)
}

/**
 * Deserialize a base64 message
 */
export function deserializeMessage(base64: string): BotMessage | null {
  try {
    const bytes = Buffer.from(base64, 'base64')
    return fromBinary(BotMessageSchema, new Uint8Array(bytes))
  } catch (error) {
    console.error('Failed to deserialize message:', error)
    return null
  }
}

/**
 * Create a UserResponse for testing
 * In production, this would be created by the client
 */
export function createSignatureResponse(
  messageId: string,
  signature: string,
  signer: string,
  chainId: string
): UserResponse {
  return create(UserResponseSchema, {
    messageId,
    componentId: 'signature-component',
    userId: signer,
    data: {
      case: 'signature',
      value: {
        signature,
        signer,
        chainId
      }
    }
  })
}

/**
 * Helper to send a protocol message via raw GM
 * Returns the eventId of the sent message
 */
export async function sendProtocolMessage(
  handler: any,
  channelId: string,
  message: BotMessage,
  typeUrl?: string
): Promise<string> {
  const bytes = serializeMessageToBytes(message)
  const url = typeUrl || PROTOCOL_TYPE_URLS.BOT_MESSAGE

  const result = await handler.sendRawGM(
    channelId,
    url,
    bytes
  )

  return result.eventId
}