import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'

import { useUser } from '../contexts/UserAuthorizationProvider'
import { supportedProviders, useLogin } from '../hooks/useLogin'
import { useProfile } from '../hooks/useProfile'

const UserAvatar = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [user, auth] = useUser()
  const [profile] = useProfile()
  const login = useLogin()

  const router = useRouter()

  const handleOpen: React.MouseEventHandler<HTMLElement> = React.useCallback((e) => {
    setAnchorEl(e.currentTarget)
  }, [])

  const handleClose = React.useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleSignOut = React.useCallback(async () => {
    setAnchorEl(null)
    await auth.signOut()

    router.reload()
  }, [auth, router])

  return (
    <>
      {user ? (
        <Avatar onClick={handleOpen}>{user.displayName?.[0]}</Avatar>
      ) : (
        <Button variant="contained" onClick={login.notion}>
          Login
        </Button>
      )}
      <Menu open={anchorEl !== null} anchorEl={anchorEl} onClose={handleClose}>
        <ListItem divider>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar onClick={handleOpen}>{user?.displayName?.[0]}</Avatar>
            <Typography>{user?.displayName}</Typography>
          </Stack>
        </ListItem>
        {profile &&
          supportedProviders.map((provider, i) => (
            <ListItem key={provider} divider={i === supportedProviders.length - 1}>
              <Typography>
                {provider}: {profile[provider]?.name || 'Not linked'}
              </Typography>
            </ListItem>
          ))}
        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
      </Menu>
    </>
  )
}

export default UserAvatar
