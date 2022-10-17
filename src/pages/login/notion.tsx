import * as React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useFetch } from '../../hooks/useFetch'
import { NotionLoginCallback } from '../api/login/notion'
import { useFirestore } from '../../hooks/firebase/useFirestore'
import { useUser } from '../../contexts/UserAuthorizationProvider'

const Callback: NextPage = () => {
  const router = useRouter()
  const { data, error } = useFetch<NotionLoginCallback>(`/api${router.asPath}`)
  const db = useFirestore()

  const [, auth] = useUser()

  React.useEffect(() => {
    if (data && data.success) {
      auth
        .signInWithCustomToken(data.token)
        .then(async () => {
          await auth.updateProfile({ displayName: data.name })
          console.log('Success to login')
          router.push('/')
        })
        .catch((e) => {
          console.error(e)
        })
    } else if (data?.success === false) {
      console.error(data.error)
    } else if (error) {
      console.error(error)
    }
  }, [auth, data, db, error, router])

  return <></>
}

export default Callback
