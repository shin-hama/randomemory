import * as React from 'react'

import ContentCard from './ContentCard'
import { useFetch } from '../hooks/useFetch'
import { useUserContents } from '../hooks/useUserContent'
import { GetTweetResponse } from '../pages/api/twitter/tweets/[id]'

type Props = {
  tweetId?: string
  onLoading?: (id: string) => void
  onLoaded?: (id: string) => void
}
const TweetCard: React.FC<Props> = ({ tweetId, onLoading, onLoaded }) => {
  const { data, error, isValidating } = useFetch<GetTweetResponse>(
    tweetId ? `api/twitter/tweets/${tweetId}` : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  )

  React.useEffect(() => {
    if (!tweetId) {
      return
    }

    if (isValidating) {
      onLoading?.(tweetId)
    } else {
      onLoaded?.(tweetId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidating])

  const [, refetch] = useUserContents()

  React.useEffect(() => {
    if (data?.success === false) {
      refetch()
    }
  }, [data?.success, refetch])

  return (
    <ContentCard
      content={data?.success ? data : undefined}
      provider="Twitter"
      error={error?.message}
    />
  )
}

export default TweetCard
