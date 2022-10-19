import * as React from 'react'
import Grid from '@mui/material/Grid'
import type { NextPage } from 'next'

import Layout from '../components/Layout'
import NoteCard from '../components/NoteCard'
import { useUserContents } from '../hooks/useUserContent'
import { useUser } from '../contexts/UserAuthorizationProvider'
import Logins from '../components/Logins'

const Home: NextPage = () => {
  const [pageIds, setPageIds] = React.useState<Array<string>>([])
  const userContents = useUserContents()

  const [user] = useUser()

  React.useEffect(() => {
    if (pageIds.length === 0 && userContents?.notion) {
      const cloned = [...userContents?.notion]

      setPageIds(
        [...Array(2)].map(() => cloned.splice(Math.floor(Math.random() * cloned.length), 1)[0])
      )
    }
  }, [userContents, pageIds])

  if (user === undefined) {
    // ログイン状態の検証中
    return <></>
  }

  return (
    <Layout>
      <Grid container xs={12} sm={6}>
        {user ? (
          pageIds.map((pageId) => (
            <Grid item key={pageId}>
              <NoteCard key={pageId} pageId={pageId} />
            </Grid>
          ))
        ) : (
          <Logins />
        )}
      </Grid>
    </Layout>
  )
}

export default Home
