import * as React from 'react'
import { useFetch } from '../hooks/useFetch'
import { PageContentResponse } from '../pages/api/notion/pages/[id]'
import { useUserContents } from '../hooks/useUserContent'
import ContentCard from './ContentCard'

type Props = {
  pageId?: string
  onLoading?: (id: string) => void
  onLoaded?: (id: string) => void
}
const NoteCard: React.FC<Props> = ({ pageId, onLoading, onLoaded }) => {
  const {
    data: page,
    error,
    isValidating,
  } = useFetch<PageContentResponse>(pageId ? `api/notion/pages/${pageId}` : null, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })

  React.useEffect(() => {
    if (!pageId) {
      return
    }

    if (isValidating) {
      onLoading?.(pageId)
    } else {
      onLoaded?.(pageId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidating])

  const [, refetch] = useUserContents()

  React.useEffect(() => {
    if (page?.success === false) {
      refetch()
    }
  }, [page?.success, refetch])

  return (
    <ContentCard
      content={
        page?.success
          ? {
              body: page.body,
              properties: page.properties,
              timestamp: page.page.created_time,
              url: page.page.url,
            }
          : undefined
      }
      provider="Notion"
      error={error?.message}
    />
  )
}

export default NoteCard
