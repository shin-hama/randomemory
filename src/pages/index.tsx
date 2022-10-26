import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
  const [loadings, setLoadings] = React.useState<Array<boolean>>([])
  const loadingAny = React.useMemo(() => loadings.every((v) => v), [loadings])
  const [userContents] = useUserContents()
  const [user] = useUser()

  const setRandomIds = React.useCallback(() => {
    if (pageIds.length === 0 && userContents?.notion) {
      const cloned = [...userContents?.notion]

      setPageIds(
        [...Array(2)].map(() => cloned.splice(Math.floor(Math.random() * cloned.length), 1)[0])
      )
    }
  }, [pageIds.length, userContents?.notion])

  const handleLoading = React.useCallback(() => {
    setLoadings((prev) => {
      prev.push(true)
      return prev
    })
  }, [])

  const handleLoaded = React.useCallback(() => {
    setLoadings((prev) => {
      prev.pop()
      return prev
    })
  }, [])

  React.useEffect(setRandomIds, [setRandomIds])

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
                  <NoteCard
                    key={pageId}
                    pageId={pageId}
                    onLoading={handleLoading}
                    onLoaded={handleLoaded}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
          <Button variant="outlined" disabled={loadingAny} onClick={setRandomIds}>
            {loadingAny ? 'Loading' : 'Refresh'}
          </Button>
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
