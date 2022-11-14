import * as React from 'react'
import {
  AuthProvider,
  getAuth,
  getRedirectResult,
  linkWithRedirect,
  onAuthStateChanged,
  signInWithCustomToken,
  signInWithRedirect,
  updateProfile,
  User,
} from 'firebase/auth'
import { app } from '../configs/firebase'

const UserAuthorizationContext = React.createContext<User | null | undefined>(undefined)

type Props = {
  children: React.ReactNode
}
export const UserAuthorizationProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>()

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

  const actions = React.useMemo(() => {
    return {
      linkWithOAuthProvider: async (currentUser: User, provider: AuthProvider) => {
        await linkWithRedirect(currentUser, provider)
      },
      signInWithCustomToken: async (token: string, provider: string) => {
        const result = await signInWithCustomToken(getAuth(app), token)
        return result
      },
      signInWithRedirect: async (provider: AuthProvider) => {
        await signInWithRedirect(getAuth(app), provider)
      },
      getRedirectResult: async () => {
        return await getRedirectResult(getAuth(app))
      },
      signOut: async () => {
        await getAuth(app).signOut()
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
