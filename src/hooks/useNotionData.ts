import * as React from 'react'
import { useSWRConfig } from 'swr'
import { useUser } from '../contexts/UserAuthorizationProvider'
import { InitNotionResponse } from '../pages/api/notion/initialize'

import { useFetch } from './useFetch'
import { useProviderContents } from './useProviderContents'

const INIT_NOTION_PATH = '/api/notion/initialize'

export const useNotionData = () => {
  const [user] = useUser()
  const { mutate } = useSWRConfig()
  const [contents, update] = useProviderContents('notion')

  const endpoint = React.useMemo<string | null>(() => {
    const now = new Date().getDate()
    const needUpdate =
      contents === null || (contents?.updatedAt && now - contents.updatedAt.getDate() !== 0)

    console.log(user && needUpdate)
    if (user && needUpdate) {
      return INIT_NOTION_PATH
    } else {
      return null
    }
  }, [contents, user])

  const { data, error } = useFetch<InitNotionResponse>(endpoint, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const fetchAll = React.useCallback(async () => {
    mutate(endpoint)
  }, [mutate, endpoint])

  React.useEffect(() => {
    if (data?.success) {
      update(data.pages)
    }
  }, [data, update])

  if (error) {
    console.error(error)
  }

  return React.useMemo(() => [contents?.data, fetchAll] as const, [contents?.data, fetchAll])
}
