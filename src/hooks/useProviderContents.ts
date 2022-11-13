import * as React from 'react'
import { FirestoreDataConverter } from 'firebase/firestore'

import { useUser } from '../contexts/UserAuthorizationProvider'
import { ProviderContent } from '../types/models'
import { useFirestore } from './firebase/useFirestore'

const UserContentConverter: FirestoreDataConverter<ProviderContent> = {
  toFirestore: (data) => {
    return { ...data }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    return {
      data: data.data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    }
  },
}

const PROVIDER_CONTENTS_PATH = (userId: string) => {
  return `content/v1/users/${userId}/providers`
}
export const useProviderContents = (provider: string) => {
  const db = useFirestore()
  const [user] = useUser()
  const [contents, setContents] = React.useState<ProviderContent | null>(null)

  const update = React.useCallback(
    async (data: Array<string>) => {
      if (user) {
        const newData = { data }
        if (contents) {
          await db.update<ProviderContent>(PROVIDER_CONTENTS_PATH(user.uid), provider, newData)
        } else {
          await db.set<ProviderContent>(PROVIDER_CONTENTS_PATH(user.uid), provider, newData)
        }
        setContents((prev) => ({
          data: newData.data,
          createdAt: prev?.createdAt || new Date(),
          updatedAt: new Date(),
        }))
      }
    },
    [contents, db, provider, user]
  )

  /**
   * ユーザーがログインしたら、DB から Contents List を取得する
   */
  React.useEffect(() => {
    if (user) {
      db.get(PROVIDER_CONTENTS_PATH(user.uid), provider, UserContentConverter)
        .then((result) => {
          setContents(result || null)
        })
        .catch((e) => {
          console.error(e)
          console.error('fail to fetch user contents')
          setContents(null)
        })
    } else {
      setContents(null)
    }
  }, [db, provider, user])

  return [contents, update] as const
}
