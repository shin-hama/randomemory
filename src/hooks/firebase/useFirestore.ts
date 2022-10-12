import * as React from 'react'
import {
  doc,
  DocumentData,
  FirestoreDataConverter,
  getDoc,
  getFirestore,
  setDoc,
} from 'firebase/firestore'

interface Firestore {
  set: <T extends DocumentData>(path: string, id: string, data: T) => Promise<void>
  get: <T>(path: string, id: string, converter: FirestoreDataConverter<T>) => Promise<T | undefined>
}
export const useFirestore = () => {
  const firestore = React.useMemo<Firestore>(() => {
    const a: Firestore = {
      set: async <T extends DocumentData>(path: string, id: string, data: T) => {
        const ref = doc(getFirestore(), path, id)
        await setDoc(ref, data)
      },
      get: async <T>(path: string, id: string, converter: FirestoreDataConverter<T>) => {
        const ref = doc(getFirestore(), path, id).withConverter(converter)
        const snapshot = await getDoc(ref)

        return snapshot.data()
      },
    }

    return a
  }, [])

  return firestore
}
