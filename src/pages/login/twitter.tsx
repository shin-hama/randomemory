import * as React from 'react'
import { TwitterAuthProvider } from 'firebase/auth'

import { useUser } from '../../contexts/UserAuthorizationProvider'
import { useRouter } from 'next/router'

const TwitterCallback = () => {
  const [, auth] = useUser()
  const router = useRouter()

  React.useEffect(() => {
    // After returning from the redirect when your app initializes you can obtain the result
    auth
      .getRedirectResult()
      .then(async (result) => {
        console.log(result)
        if (result) {
          // This is the signed-in user
          const user = result.user
          // This gives you a Facebook Access Token.
          const credential = TwitterAuthProvider.credentialFromResult(result)
          const token = credential?.accessToken

          router.replace('/')
        } else {
          console.log('Fail to get result')
        }
      })
      .catch((error) => {
        console.log(error)
        router.replace('/')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <></>
}

export default TwitterCallback
