import * as React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useFetch } from '../../hooks/useFetch'
import { NotionLoginCallback } from '../api/login/notion'
import { useFirestore } from '../../hooks/firebase/useFirestore'
import { useUser } from '../../contexts/UserAuthorizationProvider'
import { REDIRECT_URI } from '../../configs/notion'

const Callback: NextPage = () => {
  const router = useRouter()
  const { data, error } = useFetch<NotionLoginCallback>(
    `/api${router.asPath}&redirect_uri=${REDIRECT_URI}`
  )
  const db = useFirestore()

  const [, auth] = useUser()

  React.useEffect(() => {
    if (data && data.success) {
      auth
        .signInWithCustomToken(data.token)
        .then(async () => {
          await auth.updateProfile({ displayName: data.name })
          console.log('Success to login')
        })
        .catch((e) => {
          console.error(e)
        })
        .finally(() => router.push('/'))
    } else if (data?.success === false || error) {
      console.error('error')
      console.error(data?.error || error?.message)
      router.push('/')
    }
  }, [auth, data, db, error, router])

  return <></>
}

export default Callback
