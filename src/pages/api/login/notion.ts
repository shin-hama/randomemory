import type { NextApiRequest, NextApiResponse } from 'next'

const clientId = process.env.NOTION_CLIENT_ID
const clientSecret = process.env.NOTION_CLIENT_SECRET
const uri = 'https://api.notion.com/v1/oauth/token'

export default async function oauth(req: NextApiRequest, res: NextApiResponse) {
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
        const value = await result.json()
        console.log(value)
        res.status(200).json(value)
      })
      .catch((e) => {
        console.error(e)
        res?.status(400).json({ error: 'error' })
      })
  } else {
    res?.status(400).json({ error: 'code is not found' })
  }
}
