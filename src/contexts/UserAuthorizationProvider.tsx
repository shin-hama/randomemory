import * as React from 'react'
import { onAuthStateChanged, signInWithCustomToken, updateProfile, User } from 'firebase/auth'

import { auth } from '../configs/firebase'

const UserAuthorizationContext = React.createContext<User | null | undefined>(undefined)

type Props = {
  children: React.ReactNode
}
export const UserAuthorizationProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>()

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userInfo) => {
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
      signInWithCustomToken: async (token: string) => {
        return await signInWithCustomToken(auth, token)
      },
      signOut: async () => {
        await auth.signOut()
      },
      updateProfile: async (updateUser: Partial<Pick<User, 'displayName' | 'photoURL'>>) => {
        const user = auth.currentUser
        if (user) {
          await updateProfile(user, updateUser)
        }
      },
    }
  }, [])

  return [user, actions] as const
}
