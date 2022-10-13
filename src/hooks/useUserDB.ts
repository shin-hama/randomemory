import { FirestoreDataConverter } from 'firebase/firestore'
import * as React from 'react'
import { useUser } from '../contexts/UserAuthorizationProvider'
import { UserContent } from '../types/User'
import { useFirestore } from './firebase/useFirestore'

const UserContentConverter: FirestoreDataConverter<UserContent> = {
  toFirestore: (data) => {
    return { ...data }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    return {
      notion: data.notion,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    }
  },
}

export const useUserDB = () => {
  const db = useFirestore()
  const [user] = useUser()

  const actions = React.useMemo(() => {
    return {
      getContents: async () => {
        if (user) {
          const result = await db.get('content/v1/users', user?.uid, UserContentConverter)
          return result
        }
      },
    }
  }, [db, user])

  return actions
}
