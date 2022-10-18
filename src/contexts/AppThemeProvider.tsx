import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles'
import * as React from 'react'

const theme = responsiveFontSizes(
  createTheme({
    palette: {},
    typography: {
      button: {
        textTransform: 'none',
      },
      h1: {
        fontSize: '3.5rem',
      },
      h2: {
        fontSize: '2.75rem',
      },
      h3: {
        fontSize: '2rem',
      },
      h4: {
        fontSize: '1.75rem',
      },
      h5: {
        fontSize: '1.5rem',
      },
      h6: {
        fontSize: '1.25rem',
      },
      fontFamily: ['"Roboto"', '"Noto Sans JP"', 'sans-serif'].join(','),
    },
  })
)

type Props = {
  children: React.ReactNode
}
export const AppThemeProvider: React.FC<Props> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
