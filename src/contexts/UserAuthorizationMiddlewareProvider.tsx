import * as React from 'react'
import { BareFetcher, Middleware, SWRConfig, SWRResponse } from 'swr'
import { useUser } from './UserAuthorizationProvider'

type Props = {
  children: React.ReactNode
}

const useAuthorization: Middleware = (useSWRNext) => {
  const [user] = useUser()

  /**
   * Request Headers に firebase auth の token を付与する
   * ログインしていなければ、token なしで request
   */
  return (key, fetcher, config): SWRResponse => {
    const wrappedFetcher: BareFetcher<any> = (...args) => {
      if (user) {
        user
          .getIdToken()
          .then((token) => {
            // headers に firebase auth の token を付与する
            return fetcher?.(...args, {
              headers: {
                authorization: token,
              },
            })
          })
          .catch((e) => {
            console.error(e)
            return fetcher?.(...args)
          })
      } else {
        return fetcher?.(...args)
      }
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSWRNext(key, wrappedFetcher, config)
  }
}

export const UserAuthorizationMiddlewareProvider: React.FC<Props> = ({ children }) => {
  return <SWRConfig value={{ use: [useAuthorization] }}>{children}</SWRConfig>
}
