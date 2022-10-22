import * as React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
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
    <Layout title="Reminder Not">
      {user ? (
        <Box sx={{ py: 6, background: (theme) => theme.palette.grey[100] }}>
          <Container>
            <Grid container spacing={1}>
              {pageIds.map((pageId) => (
                <Grid item key={pageId} xs={12} sm={6}>
                  <NoteCard key={pageId} pageId={pageId} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      ) : (
        <Container maxWidth="xs" sx={{ py: 6 }}>
          <Logins />
        </Container>
      )}
    </Layout>
  )
}

export default Home
