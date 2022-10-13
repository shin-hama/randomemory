import * as crypto from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'
import nookies from 'nookies'

import { ENCRYPTION_KEY } from '../configs'

const IV_LENGTH = 16 // For AES, this is always 16

const encrypt = (text: string) => {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text)

  encrypted = Buffer.concat([encrypted, cipher.final()])

  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

const decrypt = (text: string) => {
  const textParts = text.split(':')
  const iv = Buffer.from(textParts.shift() || '', 'hex')
  const encryptedText = Buffer.from(textParts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let decrypted = decipher.update(encryptedText)

  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

export const saveSecrets = (res: NextApiResponse, name: string, token: object) => {
  const text = encrypt(JSON.stringify(token))

  nookies.set({ res }, name, text, {
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  })
}

export const getSecrets = (req: NextApiRequest, name: string): object | null => {
  const cookies = nookies.get({ req })
  const value = cookies[name]

  if (value) {
    const token = decrypt(cookies[name])
    return JSON.parse(token)
  } else {
    return null
  }
}
