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
import { ModelBase } from '../../types/models'

interface Firestore {
  set: <T extends ModelBase>(
    path: string,
    id: string,
    data: Omit<T, keyof ModelBase>
  ) => Promise<void>
  get: <T>(path: string, id: string, converter: FirestoreDataConverter<T>) => Promise<T | undefined>
  update: <T extends DocumentData>(path: string, id: string, data: Partial<T>) => Promise<void>
}
export const useFirestore = () => {
  const firestore = React.useMemo<Firestore>(() => {
    const a: Firestore = {
      set: async <T extends ModelBase>(
        path: string,
        id: string,
        data: Omit<T, keyof ModelBase>
      ) => {
        const ref = doc(getFirestore(), path, id)
        await setDoc(ref, {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
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
