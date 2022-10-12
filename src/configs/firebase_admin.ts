import { cert, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('Firebase Private Key is not defined on environment')
}
const sa = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
}

const app = initializeApp({
  credential: cert(sa),
  databaseURL: 'https://reminder-note-b6707.firebaseio.com',
})
export const auth = getAuth(app)
