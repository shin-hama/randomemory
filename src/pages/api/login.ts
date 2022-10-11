import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth, signInWithCustomToken } from 'firebase/auth'

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const auth = getAuth()

  const result = await signInWithCustomToken(auth, '')
  res?.status(200).json({ ...result })
}
