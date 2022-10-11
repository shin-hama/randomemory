import * as React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useFetch } from '../../hooks/useFetch'

const Callback: NextPage = () => {
  const router = useRouter()
  const { data, error } = useFetch(`/api${router.asPath}`)

  React.useEffect(() => {
    if (data) {
      console.log(data)
      router.push('/')
    } else if (error) {
      console.log('')
    }
  }, [data, error, router])

  return <></>
}

export default Callback
