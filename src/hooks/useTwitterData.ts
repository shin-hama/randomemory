import * as React from 'react'
import { useSWRConfig } from 'swr'
import { useUser } from '../contexts/UserAuthorizationProvider'

import { InitTwitterResponse } from '../pages/api/twitter/[uid]/initialize'
import { useFetch } from './useFetch'
import { useProviderContents } from './useProviderContents'

export const useTwitterData = () => {
  const [user] = useUser()
  const { mutate } = useSWRConfig()
  const [contents, update] = useProviderContents('twitter')

  const endpoint = React.useMemo<string | null>(() => {
    const twitterUid = user?.providerData.find((info) => info.providerId === 'twitter.com')?.uid

    const now = new Date().getDate()
    const needUpdate =
      contents === null || (contents?.updatedAt && now - contents.updatedAt.getDate() !== 0)

    if (twitterUid && needUpdate) {
      return `/api/twitter/${twitterUid}/initialize`
    } else {
      return null
    }
  }, [contents, user?.providerData])

  const { data, error } = useFetch<InitTwitterResponse>(endpoint, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const fetchAll = React.useCallback(async () => {
    mutate(endpoint)
  }, [mutate, endpoint])

  React.useEffect(() => {
    if (data?.success) {
      update(data.tweets)
    }
  }, [data, update])

  if (error) {
    console.error(error)
  }

  return React.useMemo(() => [contents?.data, fetchAll] as const, [contents?.data, fetchAll])
}
