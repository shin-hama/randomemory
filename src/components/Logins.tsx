import * as React from 'react'
import Icon from '@mui/material/SvgIcon'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import TwitterIcon from './icons/twitter.svg'
import { FireAuthProviders, useLogin } from '../hooks/useLogin'
import { AsyncButton } from './AsyncButton'

type Provider = {
  name: FireAuthProviders
  icon: React.ReactNode
}
const providers: Array<Provider> = [
  {
    name: 'twitter',
    icon: <TwitterIcon />,
  },
]

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const Logins = () => {
  const login = useLogin()

  return (
    <Stack alignItems="stretch" spacing={4}>
      <Typography variant="h5" textAlign="center">
        Sign up Your Account
      </Typography>
      {providers.map((provider) => (
        <AsyncButton
          key={provider.name}
          variant="outlined"
          onClick={() => login.provider(provider.name)}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Icon fontSize="medium">{provider.icon}</Icon>
            <Typography>Continue with {capitalizeFirstLetter(provider.name)}</Typography>
          </Stack>
        </AsyncButton>
      ))}
    </Stack>
  )
}

export default Logins
