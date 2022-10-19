import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useUser } from '../contexts/UserAuthorizationProvider'
import { useLogin } from '../hooks/useLogin'
import { useRouter } from 'next/router'

type Props = {
  children?: React.ReactNode
}
const Layout: React.FC<Props> = ({ children }) => {
  const [user, auth] = useUser()
  const login = useLogin()

  const router = useRouter()

  const handleSignOut = React.useCallback(async () => {
    await auth.signOut()

    router.reload()
  }, [auth, router])

  return (
    <>
      <AppBar color="inherit">
        <Toolbar>
          <Typography variant="h4">Reminder Note</Typography>
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
    </>
  )
}

export default Layout
