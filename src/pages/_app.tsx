import type { AppProps } from 'next/app'
import { AppThemeProvider } from '../contexts/AppThemeProvider'
import { UserAuthorizationMiddlewareProvider } from '../contexts/UserAuthorizationMiddlewareProvider'
import { UserAuthorizationProvider } from '../contexts/UserAuthorizationProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppThemeProvider>
      <UserAuthorizationProvider>
        <UserAuthorizationMiddlewareProvider>
          <Component {...pageProps} />
        </UserAuthorizationMiddlewareProvider>
      </UserAuthorizationProvider>
    </AppThemeProvider>
  )
}

export default MyApp
