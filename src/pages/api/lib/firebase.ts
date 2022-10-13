import { getAuth } from 'firebase-admin/auth'
import { admin } from '../configs/firebase_admin'

export const createCustomToken = async (uid: string): Promise<string> => {
  try {
    const token = await getAuth(admin).createCustomToken(uid)
    return token
  } catch (e) {
    console.error(`Failed to create custom token: ${e}`)
    throw e
  }
}

export const verifyUserToken = async (token: string) => {
  try {
    return await getAuth(admin).verifyIdToken(token)
  } catch (e) {
    console.error(e)
    throw e
  }
}
