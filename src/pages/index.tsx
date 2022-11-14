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
import TweetCard from '../components/TweetCard'
import { SupportedProviders, supportedProviders } from '../hooks/useLogin'

type PageInfo = { provider: SupportedProviders; id: string }

const Home: NextPage = () => {
  const [pages, setPages] = React.useState<Array<PageInfo>>([])
  const [loadings, setLoadings] = React.useState<Array<string>>([])
  const loadingAny = React.useMemo(
    () => loadings.length > 0 && loadings.every((v) => v),
    [loadings]
  )
  const [userContents] = useUserContents()
  const [user] = useUser()

  const setRandomIds = React.useCallback(() => {
    if (userContents) {
      const providers = supportedProviders.filter((key) => userContents[key].length > 0)

      const cloned = Object.fromEntries(
        supportedProviders.map((key): [SupportedProviders, Array<string>] => [
          key,
          [...userContents[key]],
        ])
      )
      setPages(
        [...Array(2)]
          .map((): PageInfo => {
            const provider = providers[Math.floor(Math.random() * providers.length)]
            const ids = cloned[provider]
            return {
              provider,
              id: ids.splice(Math.floor(Math.random() * ids.length), 1)[0],
            }
          })
          .filter((item) => item.id)
      )
    }
  }, [userContents])

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
    if (pages.length === 0) {
      setRandomIds()
    }
  }, [pages.length, setRandomIds])

  const renderCard = React.useCallback(
    (provider: SupportedProviders, id: string) => {
      switch (provider) {
        case 'notion':
          return <NoteCard pageId={id} onLoading={handleLoading} onLoaded={handleLoaded} />
        case 'twitter':
          return <TweetCard tweetId={id} onLoading={handleLoading} onLoaded={handleLoaded} />
        default:
          throw new Error(`${provider} is not supported`)
      }
    },
    [handleLoaded, handleLoading]
  )

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
                {pages.map((page) => (
                  <Grid item key={page.id} xs={12} sm={6}>
                    {renderCard(page.provider, page.id)}
                  </Grid>
                ))}
              </Grid>
              <Button variant="outlined" disabled={loadingAny} onClick={setRandomIds}>
                {loadingAny ? 'Loading' : 'Refresh'}
              </Button>
              <Logins />
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
