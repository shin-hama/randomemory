import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'

import { useUser } from '../contexts/UserAuthorizationProvider'
import { useLogin } from '../hooks/useLogin'

const UserAvatar = () => {
  const [user, auth] = useUser()
  const login = useLogin()

  const router = useRouter()

  const handleSignOut = React.useCallback(async () => {
    await auth.signOut()

    router.reload()
  }, [auth, router])

  return user ? (
    <Avatar>{user.displayName?.[0]}</Avatar>
  ) : (
    <Button variant="contained" onClick={login.notion}>
      Login
    </Button>
  )
}

export default UserAvatar
