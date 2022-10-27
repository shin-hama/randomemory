import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import type { NextPage } from 'next'

import Layout from '../components/Layout'
import NoteCard from '../components/NoteCard'
import { useUserContents } from '../hooks/useUserContent'
import { useUser } from '../contexts/UserAuthorizationProvider'
import Logins from '../components/Logins'

const Home: NextPage = () => {
  const [pageIds, setPageIds] = React.useState<Array<string>>([])
  const [loadings, setLoadings] = React.useState<Array<string>>([])
  const loadingAny = React.useMemo(
    () => loadings.length > 0 && loadings.every((v) => v),
    [loadings]
  )
  const [userContents] = useUserContents()
  const [user] = useUser()

  const setRandomIds = React.useCallback(() => {
    if (userContents?.notion) {
      const cloned = [...userContents?.notion]

      setPageIds(
        [...Array(2)].map(() => cloned.splice(Math.floor(Math.random() * cloned.length), 1)[0])
      )
    }
  }, [userContents?.notion])

  const handleLoading = React.useCallback((id: string) => {
    setLoadings((prev) => [...new Set([...prev, id])])
  }, [])

  const handleLoaded = React.useCallback((id: string) => {
    setLoadings((prev) => {
      const i = prev.findIndex((e) => e === id)
      if (i !== -1) {
        prev.splice(i, 1)
      }

      return [...prev]
    })
  }, [])

  React.useEffect(() => {
    if (pageIds.length === 0) {
      setRandomIds()
    }
  }, [pageIds.length, setRandomIds])

  if (user === undefined) {
    // ログイン状態の検証中
    return <></>
  }

  return (
    <Layout title="RandoMemory">
      {user ? (
        <Box sx={{ py: 6, background: (theme) => theme.palette.grey[100] }}>
          <Container>
            <Stack spacing={2} alignItems="center">
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
              <Button variant="outlined" disabled={loadingAny} onClick={setRandomIds}>
                {loadingAny ? 'Loading' : 'Refresh'}
              </Button>
            </Stack>
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
