import type { NextApiRequest, NextApiResponse } from 'next'
import Client from 'twitter-api-sdk'
import { Content } from '../../../../types/models'

import { verifyUserToken } from '../../lib/firebaseAuth'

const twitter = new Client(process.env.TWITTER_BEARER_TOKEN || '')

export type GetTweetResponse =
  | (Content & {
      success: true
    })
  | {
      success: false
    }
export default async function initialize(
  req: NextApiRequest,
  res: NextApiResponse<GetTweetResponse>
) {
  const user = await verifyUserToken(req)

  const [uid] = [req.query.id].flat(1)
  if (twitter && user && uid) {
    const tweet = await getTweet(uid)
    if (tweet) {
      res.status(200).json({ ...tweet, success: true })
    } else {
      res.status(400).json({ success: false })
    }
  } else {
    res.status(400).json({ success: false })
  }
}

const buildTweetUrl = (uid: string, tweetId: string): string => {
  return `https://twitter.com/${uid}/status/${tweetId}`
}
const getTweet = async (tweetId: string): Promise<Content | null> => {
  const result = await twitter.tweets.findTweetById(tweetId, {
    'tweet.fields': ['created_at', 'public_metrics', 'text'],
    'user.fields': ['name'],
    expansions: ['author_id'],
  })

  if (result.data && result.includes?.users) {
    const userName = result.includes?.users[0].username
    return {
      body: result.data.text,
      properties: Object.entries(result.data.public_metrics || {}).map(
        ([key, value]) => `${key.replace('_count', '')}: ${value}`
      ),
      timestamp: result.data.created_at || '',
      url: buildTweetUrl(userName, tweetId),
    }
  } else if (result.errors) {
    return null
  }

  return null
}
