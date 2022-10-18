import * as React from 'react'
import type { NextPage } from 'next'

import Layout from '../components/Layout'
import NoteCard from '../components/NoteCard'
import { useUserContents } from '../hooks/useUserContent'
import { useUser } from '../contexts/UserAuthorizationProvider'
import Logins from '../components/Logins'

const Home: NextPage = () => {
  const [pageId, setPageId] = React.useState<string>()
  const userContents = useUserContents()

  const [user] = useUser()

  React.useEffect(() => {
    if (!pageId && userContents?.notion) {
      const id = userContents.notion[Math.floor(Math.random() * userContents.notion.length)]
      setPageId(id)
    }
  }, [userContents, pageId])

  if (user === undefined) {
    return <></>
  }

  return <Layout>{user ? <NoteCard pageId={pageId} /> : <Logins />}</Layout>
}

export default Home
