import { NextApiRequest, NextApiResponse } from 'next'
import nookies from 'nookies'
import { encrypt, decrypt } from './lib/encrypto'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('set cookies')
  const cookies = nookies.get({ req })
  const pw = encrypt(JSON.stringify({ token: 'password' }))
  // Set
  nookies.set({ res }, 'sample', pw, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  })
  const decoded = decrypt(cookies.sample)

  res.status(200).json(decoded)
}
