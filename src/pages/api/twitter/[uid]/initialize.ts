import type { NextApiRequest, NextApiResponse } from 'next'
import Client from 'twitter-api-sdk'

import { verifyUserToken } from '../../lib/firebaseAuth'

const createUserClient = (req: NextApiRequest) => {
  return new Client(process.env.TWITTER_BEARER_TOKEN || '')
}

export type InitTwitterResponse =
  | {
      tweets: Array<string>
      success: true
    }
  | {
      success: false
    }
export default async function initialize(
  req: NextApiRequest,
  res: NextApiResponse<InitTwitterResponse>
) {
  const client = createUserClient(req)
  const user = await verifyUserToken(req)

  const [uid] = [req.query.uid].flat(1)
  console.log(uid)
  if (client && user && uid) {
    const result = await client.tweets.usersIdTweets(uid)
    // const result = await client.tweets.usersIdTweets()
    res.status(200).json({ tweets: result, success: true })
  } else {
    res.status(400).json({ success: false })
  }
}
