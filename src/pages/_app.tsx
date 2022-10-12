import type { AppProps } from 'next/app'
import { UserAuthorizationProvider } from '../contexts/UserAuthorizationProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserAuthorizationProvider>
      <Component {...pageProps} />
    </UserAuthorizationProvider>
  )
}

export default MyApp
