import * as React from 'react'
import Icon from '@mui/material/SvgIcon'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import NotionIcon from './icons/notion.svg'
import { useLogin } from '../hooks/useLogin'
import { AsyncButton } from './AsyncButton'

const Logins = () => {
  const login = useLogin()

  return (
    <Stack alignItems="stretch" spacing={4}>
      <button onClick={() => login.provider('twitter')}>twitter</button>
      <Typography variant="h5" textAlign="center">
        Sign up Your Account
      </Typography>
      <AsyncButton variant="outlined" onClick={login.notion}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Icon fontSize="large">
            <NotionIcon />
          </Icon>
          <Typography>Continue with Notion</Typography>
        </Stack>
      </AsyncButton>
    </Stack>
  )
}

export default Logins
