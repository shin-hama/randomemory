import * as React from 'react'
import { AuthProvider, TwitterAuthProvider } from 'firebase/auth'

import { NOTION_LOGIN_URL } from '../configs/notion'
import { useUser } from '../contexts/UserAuthorizationProvider'
import { LoginResponse } from '../pages/api/login'
import { useRouter } from 'next/router'

type SUPPORTED_PROVIDER = 'twitter'

type Provider = {
  provider: AuthProvider
  redirectUrl: string
}
const providers: Record<SUPPORTED_PROVIDER, Provider> = {
  twitter: {
    provider: new TwitterAuthProvider(),
    redirectUrl: '/login/twitter',
  },
}

interface UseLogin {
  notion: () => Promise<void>
  provider: (name: SUPPORTED_PROVIDER) => Promise<void>
}
export const useLogin = (): UseLogin => {
  const [, auth] = useUser()
  const router = useRouter()

  const actions = React.useMemo<UseLogin>(() => {
    const a = {
      notion: async () => {
        const result = (await (await fetch('api/login')).json()) as LoginResponse

        if (result.customToken) {
          await auth.signInWithCustomToken(result.customToken)
        } else {
          window.open(NOTION_LOGIN_URL, '_self')
        }
      },
      provider: async (name: SUPPORTED_PROVIDER) => {
        const provider = providers[name]
        const result = await router.push(provider.redirectUrl)
        if (result) {
          await auth.signInWithRedirect(provider.provider)
        } else {
          console.error(`Fail to login with ${name}}`)
        }
      },
    }

    return a
  }, [auth, router])

  return actions
}
