import useSWR, { SWRConfiguration, SWRResponse } from 'swr'

export const useFetch = <T>(
  key: string | null,
  options: SWRConfiguration<T> = {}
): SWRResponse<T, Error> => {
  const result = useSWR(
    key,
    async (...args) => {
      try {
        const res = await fetch(...args)

        if (!res.ok) {
          const msg = await res.text()
          const error = new Error(`An error occurred while fetching the data: ${msg}`)

          throw error
        }
        return await res.json()
      } catch (e) {
        console.error(e)
        console.error(key)

        throw e
      }
    },
    options
  )

  return result
}
