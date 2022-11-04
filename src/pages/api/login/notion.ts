import type { NextApiRequest, NextApiResponse } from 'next'

import { createCustomToken } from '../lib/firebaseAuth'
import { saveSecrets } from '../lib/secrets'
import { AccessTokenResponse, isErrorResponse } from '../notion/types'

const clientId = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID
const clientSecret = process.env.NOTION_CLIENT_SECRET
const uri = 'https://api.notion.com/v1/oauth/token'

export type NotionLoginCallback =
  | {
      token: string
      name: string | null
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
      redirect_uri: req.query.redirect_uri,
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
          saveSecrets(res, 'notion', value)

          const user = value.owner.user
          const altName =
            user.type === 'person'
              ? user.person.email?.split('@')[0] || null
              : user.bot.workspace_name

          res.status(200).json({
            success: true,
            token,
            name: user.name || altName,
          })
        }
      })
      .catch((e) => {
        console.error(e)
        res?.status(400).json({ success: false, error: e })
      })
  } else if (req.query.error) {
    res?.status(400).json({ success: false, error: req.query.error.toString() })
  } else {
    res?.status(400).json({ success: false, error: 'code is not found' })
  }
}
