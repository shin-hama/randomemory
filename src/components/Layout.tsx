import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import Head, { HeadProps } from './Head'
import UserAvatar from './UserAvatar'
import Link from './Link'

type Props = HeadProps & {
  children?: React.ReactNode
}
const Layout: React.FC<Props> = ({ children, ...heads }) => {
  return (
    <>
      <Head {...heads} />
      <AppBar color="inherit">
        <Toolbar>
          <Typography variant="h4" fontWeight="bold">
            RandoMemory
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <UserAvatar />
        </Toolbar>
      </AppBar>
      <Toolbar />
      {children}
      <footer>
        <Box pt={8}>
          <Stack alignItems="center" spacing={1}>
            <Stack direction="row" spacing={2}>
              <Link href="privacy-policy" sx={{ textDecoration: 'none' }}>
                Privacy Policy
              </Link>
              <Link href="terms" sx={{ textDecoration: 'none' }}>
                Terms of Use
              </Link>
            </Stack>
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
