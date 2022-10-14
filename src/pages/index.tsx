import * as React from 'react'
import type { NextPage } from 'next'

import Layout from '../components/Layout'
import NoteCard from '../components/NoteCard'
import { useUserContents } from '../hooks/useUserContent'

const Home: NextPage = () => {
  const [pageId, setPageId] = React.useState<string>()
  const userContents = useUserContents()

  React.useEffect(() => {
    if (!pageId && userContents?.notion) {
      const id = userContents.notion[Math.floor(Math.random() * userContents.notion.length)]
      setPageId(id)
    }
  }, [userContents, pageId])

  return (
    <Layout>
      <NoteCard pageId={pageId} />
    </Layout>
  )
}

export default Home
