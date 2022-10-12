import * as React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { signInWithCustomToken } from 'firebase/auth'

import { useFetch } from '../../hooks/useFetch'
import { NotionLoginCallback } from '../api/login/notion'
import { auth } from '../../configs/firebase'

const Callback: NextPage = () => {
  const router = useRouter()
  const { data, error } = useFetch<NotionLoginCallback>(`/api${router.asPath}`)

  React.useEffect(() => {
    if (data && data.success) {
      console.log(data)
      signInWithCustomToken(auth, data.token)
        .then((user) => {
          console.log(user)
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
  }, [data, error, router])

  return <></>
}

export default Callback
