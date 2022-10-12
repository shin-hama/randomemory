import type { NextApiRequest } from 'next'
import { Client } from '@notionhq/client'

import { verifyUserToken, getUserSecrets } from '../lib/firebase'

export const createClient = (token: string) => {
  return new Client({ auth: token })
}

export const createUserClient = async (req: NextApiRequest) => {
  const token = req.headers.authorization

  if (token) {
    const user = await verifyUserToken(token)
    const secrets = await getUserSecrets(user.uid)

    if (secrets) {
      return createClient(secrets.notion.access_token)
    }
  }

  return null
}
