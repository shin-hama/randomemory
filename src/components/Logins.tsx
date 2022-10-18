import * as React from 'react'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Icon from '@mui/material/SvgIcon'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import NotionIcon from './icons/notion.svg'
import { useLogin } from '../hooks/useLogin'

const Logins = () => {
  const login = useLogin()

  return (
    <Container maxWidth="xs">
      <Stack alignItems="stretch" spacing={4}>
        <Typography variant="h5" textAlign="center">
          Sign up Your Account
        </Typography>
        <Button variant="outlined" onClick={login.notion}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Icon fontSize="large">
              <NotionIcon />
            </Icon>
            <Typography>Continue with Notion</Typography>
          </Stack>
        </Button>
      </Stack>
    </Container>
  )
}

export default Logins
