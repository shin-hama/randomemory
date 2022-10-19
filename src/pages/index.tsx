import * as React from 'react'
import type { NextPage } from 'next'

import Layout from '../components/Layout'
import NoteCard from '../components/NoteCard'
import { useUserContents } from '../hooks/useUserContent'
import { useUser } from '../contexts/UserAuthorizationProvider'
import Logins from '../components/Logins'

const Home: NextPage = () => {
  const [pageIds, setPageIds] = React.useState<Array<string>>()
  const userContents = useUserContents()

  const [user] = useUser()

  React.useEffect(() => {
    if (!pageIds && userContents?.notion) {
      const cloned = [...userContents?.notion]

      setPageIds(
        [...Array(2)].map(() => cloned.splice(Math.floor(Math.random() * cloned.length), 1)[0])
      )
    }
  }, [userContents, pageIds])

  if (user === undefined) {
    return <></>
  }

  return (
    <Layout>
      {user ? pageIds?.map((pageId) => <NoteCard key={pageId} pageId={pageId} />) : <Logins />}
    </Layout>
  )
}

export default Home
