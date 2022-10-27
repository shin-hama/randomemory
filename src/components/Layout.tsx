import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useUser } from '../contexts/UserAuthorizationProvider'
import { useLogin } from '../hooks/useLogin'
import { useRouter } from 'next/router'
import Head, { HeadProps } from './Head'

type Props = HeadProps & {
  children?: React.ReactNode
}
const Layout: React.FC<Props> = ({ children, ...heads }) => {
  const [user, auth] = useUser()
  const login = useLogin()

  const router = useRouter()

  const handleSignOut = React.useCallback(async () => {
    await auth.signOut()

    router.reload()
  }, [auth, router])

  return (
    <>
      <Head {...heads} />
      <AppBar color="inherit">
        <Toolbar>
          <Typography variant="h4">RandoMemory</Typography>
          <div style={{ flexGrow: 1 }} />
          {user ? (
            <>
              <Typography>User: {user.displayName}</Typography>
              <Button onClick={handleSignOut}>logout</Button>
            </>
          ) : (
            <Button variant="contained" onClick={login.notion}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
      {children}
      <footer>
        <Box pt={8}>
          <Stack alignItems="center">
            <Typography variant="subtitle1" color="GrayText">
              © {new Date().getFullYear()} Coppla. All rights reserved.
            </Typography>
          </Stack>
        </Box>
      </footer>
    </>
  )
}

export default Layout
