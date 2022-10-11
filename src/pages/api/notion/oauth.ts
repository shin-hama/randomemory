import type { NextApiRequest, NextApiResponse } from 'next'

const clientId = process.env.NOTION_CLIENT_ID
const clientSecret = process.env.NOTION_CLIENT_SECRET
const uri = 'https://api.notion.com/v1/oauth/token'

export default function oauth(req: NextApiRequest, res: NextApiResponse) {
  const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const code = req.query.code

  if (code && typeof code === 'string') {
    fetch(uri, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
      }),
    })
      .then((result) => {
        console.log(result.json())
      })
      .catch((e) => console.error(e))
  }
  res?.status(200).json('')
}
