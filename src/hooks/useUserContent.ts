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

  const [userContents, setUserContents] = React.useState<UserContent | null>(null)

  const shouldInit = React.useMemo(() => {
    // UserContents 内に Notion 用データが存在しない
    const existsNotion = userContents !== null && userContents?.notion !== undefined

    // 最終更新日から1日以上経過している
    const now = new Date().getDate()
    const needUpdate = userContents?.updatedAt && now - userContents.updatedAt.getDate() !== 0

    return user && (existsNotion === false || needUpdate)
  }, [user, userContents])

  const { data, error } = useFetch<InitNotionResponse>(
    shouldInit ? '/api/notion/initialize' : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  React.useEffect(() => {
    if (data?.success && user) {
      console.log('Update user contents')
      const contents = { notion: data.pages }
      if (userContents) {
        db.update<UserContent>(USER_CONTENTS_PATH, user.uid, contents)
      } else {
        db.set<UserContent>(USER_CONTENTS_PATH, user.uid, contents)
      }
      setUserContents((prev) => ({
        notion: contents.notion,
        createdAt: prev?.createdAt || new Date(),
        updatedAt: new Date(),
      }))
    } else if (data?.success === false || error) {
      console.error('Fail to fetch user content')
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
