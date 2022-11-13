import type { NextApiRequest, NextApiResponse } from 'next'
import Client from 'twitter-api-sdk'

import { verifyUserToken } from '../../lib/firebaseAuth'

const twitter = new Client(process.env.TWITTER_BEARER_TOKEN || '')

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
  const user = await verifyUserToken(req)

  const [uid] = [req.query.uid].flat(1)
  if (twitter && user && uid) {
    const tweets = await fetchTweets(uid)
    res.status(200).json({ tweets, success: true })
  } else {
    res.status(400).json({ success: false })
  }
}

const fetchTweets = async (uid: string, nextToken?: string): Promise<Array<string>> => {
  const tweets: Array<string> = []
  const result = await twitter.tweets.usersIdTweets(uid, {
    max_results: 100,
    pagination_token: nextToken,
  })
  if (result.data) {
    tweets.push(...result.data.map((tweet) => tweet.id))
    if (result.meta?.next_token) {
      tweets.push(...(await fetchTweets(uid, result.meta.next_token)))
    }
  } else if (result.errors) {
    return []
  }

  return tweets
}
