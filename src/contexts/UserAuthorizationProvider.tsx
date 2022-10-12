import * as React from 'react'
import { getAuth, onAuthStateChanged, signInWithCustomToken, User } from 'firebase/auth'
import { app } from '../configs/firebase'

const UserAuthorizationContext = React.createContext<User | null | undefined>(undefined)

type Props = {
  children: React.ReactNode
}
export const UserAuthorizationProvider: React.FC<Props> = ({ children }) => {
  // アクセス直後は Undefined だが、Firebase への接続が完了した段階で、User か null がセットされる
  const [user, setUser] = React.useState<User | null>()

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (userInfo) => {
      setUser(userInfo)
    })

    return () => {
      unsubscribe()
    }
  }, [setUser])

  if (user === undefined) {
    return <></>
  }

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
        return await signInWithCustomToken(getAuth(app), token)
      },
      signOut: () => {
        getAuth(app).signOut()
      },
    }
  }, [])

  return [user, actions] as const
}
