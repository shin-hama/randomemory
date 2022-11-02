// Import the functions you need from the SDKs you need
import { getAnalytics, initializeAnalytics } from 'firebase/analytics'
import { FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, initializeAuth } from 'firebase/auth'
import { getFirestore, initializeFirestore } from 'firebase/firestore'

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  throw new Error('Firebase API Key is not defined on environment')
}
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
if (typeof window !== 'undefined' && getApps().length === 0) {
  console.log('init firebase')
  const app = initializeApp(firebaseConfig)

  initializeAnalytics(app)
  initializeAuth(app)
  initializeFirestore(app, { ignoreUndefinedProperties: true })
}

const getFirebase = () => {
  try {
    return getApp()
  } catch {
    return initializeApp(firebaseConfig)
  }
}

export const analytics = typeof window !== 'undefined' && getAnalytics(getFirebase())
export const auth = getAuth(getFirebase())
export const db = getFirestore(getFirebase())
