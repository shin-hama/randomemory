import * as React from 'react'

import { NOTION_LOGIN_URL } from '../configs/notion'
import { useUser } from '../contexts/UserAuthorizationProvider'
import { LoginResponse } from '../pages/api/login'

interface UseLogin {
  notion: () => Promise<void>
}
export const useLogin = (): UseLogin => {
  const [, auth] = useUser()

  const actions = React.useMemo<UseLogin>(() => {
    const a = {
      notion: async () => {
        const result = (await (await fetch('api/login')).json()) as LoginResponse

        if (result.customToken) {
          auth.signInWithCustomToken(result.customToken)
        } else {
          window.open(NOTION_LOGIN_URL, '_self')
        }
      },
    }

    return a
  }, [auth])

  return actions
}
