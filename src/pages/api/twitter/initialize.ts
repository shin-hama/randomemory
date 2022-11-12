import { ClientRequest } from 'http'
import type { NextApiRequest, NextApiResponse } from 'next'
import Client from 'twitter-api-sdk'

import { verifyUserToken } from '../lib/firebaseAuth'

const createUserClient = (req: NextApiRequest) => {
  const token = req.headers.authorization

  if (token) {
    return new Client(token)
  } else {
    return null
  }
}
export type InitNotionResponse =
  | {
      tweets: Array<string>
      success: true
    }
  | {
      success: false
    }
export default async function initialize(
  req: NextApiRequest,
  res: NextApiResponse<InitNotionResponse>
) {
  const client = createUserClient(req)

  if (client) {
    const result = await client.users.findMyUser()
    // const result = await client.tweets.usersIdTweets()
    res.status(200).json({ tweets: result, success: true })
  } else {
    res.status(400).json({ success: false })
  }
}
