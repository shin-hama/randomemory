import * as React from 'react'
import { AuthProvider, TwitterAuthProvider } from 'firebase/auth'

import { NOTION_LOGIN_URL } from '../configs/notion'
import { useUser } from '../contexts/UserAuthorizationProvider'
import { LoginResponse } from '../pages/api/login'
import { useRouter } from 'next/router'

const fireAuthProviders = ['twitter'] as const
type FireAuthProviders = typeof fireAuthProviders[number]

export const supportedProviders = ['notion', ...fireAuthProviders] as const
export type SupportedProviders = typeof supportedProviders[number]

const twitter = new TwitterAuthProvider()
twitter.addScope('tweet.read')
twitter.addScope('users.read')

type Provider = {
  provider: AuthProvider
  redirectUrl: string
}
const providers: Record<FireAuthProviders, Provider> = {
  twitter: {
    provider: twitter,
    redirectUrl: '/login/twitter',
  },
}

interface UseLogin {
  notion: () => Promise<void>
  provider: (name: FireAuthProviders) => Promise<void>
}
export const useLogin = (): UseLogin => {
  const [user, auth] = useUser()
  const router = useRouter()

  const actions = React.useMemo<UseLogin>(() => {
    const a = {
      notion: async () => {
        const result = (await (await fetch('api/login')).json()) as LoginResponse

        if (result.customToken) {
          await auth.signInWithCustomToken(result.customToken, 'notion.so')
        } else {
          window.open(NOTION_LOGIN_URL, '_self')
        }
      },
      provider: async (name: FireAuthProviders) => {
        const provider = providers[name]
        if (user) {
          console.log('link exists user')
          const result = await router.push('/login/link')
          if (result) {
            await auth.linkWithOAuthProvider(user, provider.provider)
          } else {
            console.error(`Fail to login with ${name}}`)
          }
        } else {
          const result = await router.push(provider.redirectUrl)
          if (result) {
            await auth.signInWithRedirect(provider.provider)
          } else {
            console.error(`Fail to login with ${name}}`)
          }
        }
      },
    }

    return a
  }, [auth, router, user])

  return actions
}
