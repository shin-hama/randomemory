import * as React from 'react'
import Icon from '@mui/material/SvgIcon'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import NotionIcon from './icons/notion.svg'
import TwitterIcon from './icons/twitter.svg'
import { useLogin } from '../hooks/useLogin'
import { AsyncButton } from './AsyncButton'

type Provider = {
  name: string
  icon: React.ReactNode
}
const providers: Array<Provider> = [
  {
    name: 'Notion',
    icon: <NotionIcon />,
  },
  {
    name: 'Twitter',
    icon: <TwitterIcon />,
  },
]

const Logins = () => {
  const login = useLogin()

  return (
    <Stack alignItems="stretch" spacing={4}>
      <Typography variant="h5" textAlign="center">
        Sign up Your Account
      </Typography>
      {providers.map((provider) => (
        <AsyncButton key={provider.name} variant="outlined" onClick={login.notion}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Icon fontSize="medium">{provider.icon}</Icon>
            <Typography>Continue with {provider.name}</Typography>
          </Stack>
        </AsyncButton>
      ))}
    </Stack>
  )
}

export default Logins
