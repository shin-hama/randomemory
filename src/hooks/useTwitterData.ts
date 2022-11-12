import * as React from 'react'
import { useUser } from '../contexts/UserAuthorizationProvider'

import { InitTwitterResponse } from '../pages/api/twitter/[uid]/initialize'
import { useFetch } from './useFetch'

export const useTwitterData = () => {
  const [user] = useUser()

  const twitterUid = React.useMemo(() => {
    return user?.providerData.find((info) => info.providerId === 'twitter.com')?.uid
  }, [user])

  const [tweets, setTweets] = React.useState<unknown>()
  const { data: twitterData, error: twitterError } = useFetch<InitTwitterResponse>(
    twitterUid ? `/api/twitter/${twitterUid}/initialize` : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  React.useEffect(() => {
    if (twitterData) {
      console.log(twitterData)
      setTweets(twitterData)
    }
  }, [twitterData])

  if (twitterError) {
    console.error(twitterError)
  }
  return tweets
}
