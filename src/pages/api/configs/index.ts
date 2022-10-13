if (!process.env.ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY is not defined')
}
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
