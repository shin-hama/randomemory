if (!process.env.ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY is not defined')
}
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

if (!process.env.TWITTER_CLIENT_ID) {
  throw new Error('TWITTER_CLIENT_ID is not defined')
}
if (!process.env.TWITTER_CLIENT_SECRET) {
  throw new Error('TWITTER_CLIENT_SECRET is not defined')
}

export const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID
export const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET
