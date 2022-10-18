import type { NextApiRequest, NextApiResponse } from 'next'
import { createCustomToken } from '../lib/firebaseAuth'

import { getSecrets } from '../lib/secrets'
import { isValidAccessToken } from '../notion/types'

export type LoginResponse = {
  customToken: string | null
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<LoginResponse>) {
  const token = getSecrets(req, 'notion')

  if (isValidAccessToken(token)) {
    const customToken = await createCustomToken(token.bot_id)
    res.status(200).json({ customToken })
  } else {
    res.status(404).json({ customToken: null })
  }
}
