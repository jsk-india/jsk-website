import configPromise from '@payload-config'
import { getPayload as getPayloadInstance } from 'payload'

/**
 * Cached Payload client — use in Server Components and API routes.
 * Wraps the singleton pattern so we don't connect multiple times.
 */
export async function getPayload() {
  return getPayloadInstance({ config: configPromise })
}
