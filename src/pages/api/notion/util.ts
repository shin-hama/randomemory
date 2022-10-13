import type { NextApiRequest } from 'next'
import { Client } from '@notionhq/client'

import { getSecrets } from '../lib/secrets'
import { isValidAccessToken } from './types'

export const createClient = (token: string) => {
  return new Client({ auth: token })
}

export const createUserClient = async (req: NextApiRequest) => {
  const token = getSecrets(req, 'notion')

  if (isValidAccessToken(token)) {
    return createClient(token.access_token)
  }

  return null
}
