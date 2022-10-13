import * as React from 'react'
import {
  doc,
  DocumentData,
  FirestoreDataConverter,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

interface Firestore {
  set: <T extends DocumentData>(path: string, id: string, data: T) => Promise<void>
  get: <T>(path: string, id: string, converter: FirestoreDataConverter<T>) => Promise<T | undefined>
  update: <T extends DocumentData>(path: string, id: string, data: T) => Promise<void>
}
export const useFirestore = () => {
  const firestore = React.useMemo<Firestore>(() => {
    const a: Firestore = {
      set: async <T extends DocumentData>(path: string, id: string, data: T) => {
        const ref = doc(getFirestore(), path, id)
        await setDoc(ref, {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp,
        })
      },
      get: async <T>(path: string, id: string, converter: FirestoreDataConverter<T>) => {
        const ref = doc(getFirestore(), path, id).withConverter(converter)
        const snapshot = await getDoc(ref)

        return snapshot.data()
      },
      update: async <T extends DocumentData>(path: string, id: string, data: Partial<T>) => {
        const ref = doc(getFirestore(), path, id)
        await updateDoc(ref, {
          ...data,
          updatedAt: serverTimestamp(),
        })
      },
    }

    return a
  }, [])

  return firestore
}
