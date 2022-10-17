import * as React from 'react'
import {
  getAuth,
  onAuthStateChanged,
  signInWithCustomToken,
  updateProfile,
  User,
} from 'firebase/auth'
import { app } from '../configs/firebase'

const UserAuthorizationContext = React.createContext<User | null | undefined>(undefined)

type Props = {
  children: React.ReactNode
}
export const UserAuthorizationProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (userInfo) => {
      setUser(userInfo)
    })

    return () => {
      unsubscribe()
    }
  }, [setUser])

  return (
    <UserAuthorizationContext.Provider value={user}>{children}</UserAuthorizationContext.Provider>
  )
}

export const useUser = () => {
  // null なら未ログイン、 undefined ならログイン処理中
  const user = React.useContext(UserAuthorizationContext)
  if (user === undefined) {
    throw new Error('UserAuthorizationProvider is not wrapped')
  }

  const actions = React.useMemo(() => {
    return {
      signInWithCustomToken: async (token: string) => {
        return await signInWithCustomToken(getAuth(app), token)
      },
      signOut: () => {
        getAuth(app).signOut()
      },
      updateProfile: async (updateUser: Partial<Pick<User, 'displayName' | 'photoURL'>>) => {
        const user = getAuth(app).currentUser
        if (user) {
          await updateProfile(user, updateUser)
        }
      },
    }
  }, [])

  return [user, actions] as const
}
