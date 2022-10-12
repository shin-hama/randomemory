import type { NextApiRequest, NextApiResponse } from 'next'
import { createCustomToken, setUserSecrets } from '../lib/firebase'
import { AccessTokenResponse, isErrorResponse } from '../notion/types'

const clientId = process.env.NOTION_CLIENT_ID
const clientSecret = process.env.NOTION_CLIENT_SECRET
const uri = 'https://api.notion.com/v1/oauth/token'

export type NotionLoginCallback =
  | {
      token: string
      success: true
    }
  | {
      success: false
      error: string
    }

export default async function oauth(
  req: NextApiRequest,
  res: NextApiResponse<NotionLoginCallback>
) {
  const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const code = req.query.code

  if (code && typeof code === 'string') {
    const body = {
      grant_type: 'authorization_code',
      code,
    }

    await fetch(uri, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(async (result) => {
        const value = (await result.json()) as AccessTokenResponse
        console.log(value)

        if (isErrorResponse(value)) {
          res?.status(400).json({ success: false, error: value.error })
        } else {
          const token = await createCustomToken(value.bot_id)
          res.status(200).json({
            success: true,
            token,
          })

          setUserSecrets(value.bot_id, { notion: value })
        }
      })
      .catch((e) => {
        console.error(e)
        res?.status(400).json({ success: false, error: e })
      })
  } else {
    res?.status(400).json({ success: false, error: 'code is not found' })
  }
}
