import useSWR, { SWRResponse } from 'swr'

export const useFetch = <T>(key: string | null): SWRResponse<T, Error> => {
  const result = useSWR(key, async (...args) => {
    const res = await fetch(...args)
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.')

      throw error
    }
    return res.json()
  })

  return result
}
