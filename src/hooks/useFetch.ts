import useSWR, { SWRResponse } from 'swr'

import { useUser } from '../contexts/UserAuthorizationProvider'

export const useFetch = <T>(key: string | null): SWRResponse<T, Error> => {
  const [user] = useUser()

  const result = useSWR(key, async (...args) => {
    if (!user) {
      throw new Error('User is not authorized')
    }

    const token = await user.getIdToken()

    const res = await fetch(...args, {
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
