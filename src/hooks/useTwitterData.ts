import * as React from 'react'
import { useSWRConfig } from 'swr'
import { useUser } from '../contexts/UserAuthorizationProvider'

import { InitTwitterResponse } from '../pages/api/twitter/[uid]/initialize'
import { useFetch } from './useFetch'

export const useTwitterData = () => {
  const [user] = useUser()
  const { mutate } = useSWRConfig()

  const twitterUid = React.useMemo(() => {
    return user?.providerData.find((info) => info.providerId === 'twitter.com')?.uid
  }, [user])

  const [tweets, setTweets] = React.useState<Array<string>>()
  const { data: twitterData, error: twitterError } = useFetch<InitTwitterResponse>(
    twitterUid ? `/api/twitter/${twitterUid}/initialize` : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const fetchAllTweets = React.useCallback(async () => {
    mutate(twitterUid ? `/api/twitter/${twitterUid}/initialize` : null)
  }, [mutate, twitterUid])

  React.useEffect(() => {
    if (twitterData?.success) {
      console.log(twitterData)
      setTweets(twitterData.tweets)
    }
  }, [twitterData])

  if (twitterError) {
    console.error(twitterError)
  }
  return React.useMemo(() => [tweets, fetchAllTweets] as const, [tweets, fetchAllTweets])
}
