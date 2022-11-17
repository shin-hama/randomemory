import * as React from 'react'
import { FirestoreDataConverter } from 'firebase/firestore'
import { useFirestore } from './firebase/useFirestore'
import { SupportedProviders } from './useLogin'
import { useUser } from '../contexts/UserAuthorizationProvider'
import { ModelBase } from '../types/models'

type UserData = {
  name: string
}
type Profile = ModelBase & Record<SupportedProviders, UserData | null | undefined>
const ProfileConverter: FirestoreDataConverter<Profile> = {
  toFirestore: (data) => {
    return { ...data }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    return {
      notion: data.notion,
      twitter: data.twitter,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    }
  },
}

const USER_DATA_PATH = '/profile/v1/users'
export const useProfile = () => {
  const db = useFirestore()
  const [user] = useUser()
  const [profile, setProfile] = React.useState<Profile | null>(null)

  const setUserData = React.useCallback(
    (uid: string, provider: SupportedProviders, data: UserData) => {
      db.set(USER_DATA_PATH, uid, { [provider]: data })
    },
    [db]
  )

  const getUserData = React.useCallback(async () => {
    if (user) {
      return await db.get(USER_DATA_PATH, user.uid, ProfileConverter)
    }
  }, [db, user])

  React.useEffect(() => {
    getUserData().then((result) => {
      if (result) {
        setProfile(result)
      } else {
        setProfile(null)
      }
    })
  }, [getUserData])

  const actions = React.useMemo(() => {
    const a = {
      get: getUserData,
      set: setUserData,
    }

    return a
  }, [getUserData, setUserData])

  return [profile, actions] as const
}
