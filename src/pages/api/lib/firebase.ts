import { auth } from '../../../configs/firebase_admin'

export async function createCustomToken(uid: string): Promise<string> {
  try {
    const token = await auth.createCustomToken(uid)
    return token
  } catch (e) {
    console.error(`Failed to create custom token: ${e}`)
    throw e
  }
}
