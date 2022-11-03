import type { NextApiRequest } from 'next'
import { Client } from '@notionhq/client'

import { getSecrets } from '../lib/secrets'
import { isValidAccessToken } from './types'

const createClient = (token: string) => {
  return new Client({ auth: token })
}

export const createUserClient = async (req: NextApiRequest) => {
  const token = getSecrets(req, 'notion')
  console.log(token)
  if (isValidAccessToken(token)) {
    try {
      const client = createClient(token.access_token)
      await client.users.me({})
      return client
    } catch {
      // throw exception when access token is invalid
      return null
    }
  }

  return null
}
