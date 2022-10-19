import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import SvgIcon from '@mui/material/SvgIcon'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
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
      <AppBar>
        <Toolbar>
          <Typography variant="h4">Reminder Note</Typography>
          <div style={{ flexGrow: 1 }} />
          {user ? (
            <>
              <p>User: {user.displayName}</p>
              <button onClick={handleSignOut}>logout</button>
            </>
          ) : (
            <Button variant="contained" onClick={login.notion}>
              login
            </Button>
          )}
          <IconButton component="a" href="/settings">
            <SvgIcon>
              <FontAwesomeIcon icon={faGear} />
            </SvgIcon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container maxWidth="sm">{children}</Container>
    </>
  )
}

export default Layout
