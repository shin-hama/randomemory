import * as React from 'react'
import Container from '@mui/material/Container'

type Props = {
  children?: React.ReactNode
}
const Layout: React.FC<Props> = ({ children }) => {
  return <Container maxWidth="sm">{children}</Container>
}

export default Layout
