import type { AppProps } from 'next/app'
import { AppThemeProvider } from '../contexts/AppThemeProvider'
import { UserAuthorizationProvider } from '../contexts/UserAuthorizationProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppThemeProvider>
      <UserAuthorizationProvider>
        <Component {...pageProps} />
      </UserAuthorizationProvider>
    </AppThemeProvider>
  )
}

export default MyApp
