import { getAuth } from 'firebase-admin/auth'
import { NextApiRequest } from 'next'

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

/**
 * Verify user authorized by firebase auth.
 * Return null if invalid authorization token is requested
 */
export const verifyUserToken = async (req: NextApiRequest) => {
  try {
    const token = req.headers.authorization || ''
    if (token) {
      return await getAuth(admin).verifyIdToken(token)
    } else {
      // Request is not authorized
      return null
    }
  } catch (e) {
    console.error(e)
    return null
  }
}
