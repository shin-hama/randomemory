import { FirestoreDataConverter } from 'firebase/firestore'
import * as React from 'react'
import { useUser } from '../contexts/UserAuthorizationProvider'
import { InitNotionResponse } from '../pages/api/notion/initialize'
import { UserContent } from '../types/models'
import { useFirestore } from './firebase/useFirestore'
import { useFetch } from './useFetch'

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

const USER_CONTENTS_PATH = 'content/v1/users'

export const useUserContents = () => {
  const db = useFirestore()
  const [user] = useUser()

  const [userContents, setUserContents] = React.useState<UserContent | null>()

  const shouldInit = React.useMemo(() => {
    const existsNotion = userContents !== null && userContents?.notion !== undefined

    const now = new Date().getDate()
    const needUpdate = userContents?.updatedAt && now - userContents.updatedAt.getDate() !== 0

    return existsNotion === false || needUpdate
  }, [userContents])

  const { data, error } = useFetch<InitNotionResponse>(shouldInit ? '/api/notion/initialize' : null)

  React.useEffect(() => {
    if (data?.success && user) {
      console.log('Update user contents')
      if (userContents) {
        db.update<UserContent>(USER_CONTENTS_PATH, user.uid, { notion: data.pages })
      } else {
        db.set<UserContent>(USER_CONTENTS_PATH, user.uid, { notion: data.pages })
      }
    } else if (!data?.success || error) {
      console.error(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  React.useEffect(() => {
    if (user) {
      console.log('fetch user content')
      db.get(USER_CONTENTS_PATH, user.uid, UserContentConverter)
        .then((result) => {
          setUserContents(result || null)
        })
        .catch((e) => {
          console.error(e)
          console.error('fail to fetch user contents')
          setUserContents(null)
        })
    } else {
      setUserContents(null)
    }
  }, [db, user])

  return userContents
}
