import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import SvgIcon from '@mui/material/SvgIcon'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

type Props = {
  children?: React.ReactNode
}
const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h4">Reminder Note</Typography>
          <div style={{ flexGrow: 1 }} />
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
