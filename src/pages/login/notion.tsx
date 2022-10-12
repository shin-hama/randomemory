import * as React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { signInWithCustomToken } from 'firebase/auth'

import { useFetch } from '../../hooks/useFetch'
import { NotionLoginCallback } from '../api/login/notion'
import { auth } from '../../configs/firebase'
import { useFirestore } from '../../hooks/firebase/useFirestore'

const Callback: NextPage = () => {
  const router = useRouter()
  const { data, error } = useFetch<NotionLoginCallback>(`/api${router.asPath}`)

  const db = useFirestore()

  React.useEffect(() => {
    if (data && data.success) {
      console.log(data)
      signInWithCustomToken(auth, data.token)
        .then((user) => {
          console.log(user)
          db.set('users', user.user.uid, { notion: data.notion })
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
  }, [data, db, error, router])

  return <></>
}

export default Callback
