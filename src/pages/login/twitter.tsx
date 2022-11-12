import * as React from 'react'

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
        if (result) {
          // This is the signed-in user
          const user = result.user
          console.log(user)
          const token = await user.getIdToken()

          if (token) {
            const test = await fetch('/api/twitter/initialize', {
              headers: {
                authorization: token,
              },
            })
            console.log(await test.json())
          }
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
