import useSWR, { SWRResponse } from 'swr'

export const useFetch = <T>(key: string | null): SWRResponse<T, Error> => {
  const result = useSWR(key, (...args) => fetch(...args).then((res) => res.json()))

  return result
}
