import useSWR, { SWRResponse } from 'swr'

import { useUser } from '../contexts/UserAuthorizationProvider'

type Fetcher = typeof fetch
export const useFetch = <T>(
  key: string | null,
  fetcher: Fetcher = fetch
): SWRResponse<T, Error> => {
  const [user] = useUser()

  const result = useSWR(key, async (...args) => {
    const token = (await user?.getIdToken()) || ''

    const res = await fetcher(...args, {
      headers: {
        authorization: token,
      },
    })
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.')

      throw error
    }
    return res.json()
  })

  return result
}
