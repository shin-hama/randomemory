import * as React from 'react'

import { useTwitterData } from './useTwitterData'
import { useNotionData } from './useNotionData'
import { SupportedProviders } from './useLogin'

export type UserContent = Record<SupportedProviders, Array<string>>

export const useUserContents = () => {
  const [userContents, setUserContents] = React.useState<UserContent | null>(null)

  const [pages, fetchPages] = useNotionData()
  const [tweets, fetchTweets] = useTwitterData()

  /**
   * Init に成功したら DB を更新する
   */
  React.useEffect(() => {
    if (pages || tweets) {
      setUserContents({ notion: pages || [], twitter: tweets || [] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, tweets])

  const refetch = React.useCallback(() => {
    fetchPages()
    fetchTweets()
  }, [fetchTweets, fetchPages])

  return [userContents, refetch] as const
}
