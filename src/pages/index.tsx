import * as React from 'react'
import type { NextPage } from 'next'

import Layout from '../components/Layout'
import NoteCard from '../components/NoteCard'
import { useFetch } from '../hooks/useFetch'
import { useUserDB } from '../hooks/useUserDB'

const Home: NextPage = () => {
  const [pageId, setPageId] = React.useState<string>('')

  const { getContents } = useUserDB()

  React.useEffect(() => {
    if (!pageId) {
      getContents()
        .then((result) => {
          if (result?.notion) {
            const id = result.notion[Math.floor(Math.random() * result.notion.length)]
            setPageId(id)
          }
        })
        .catch((e) => {
          console.error(e)
        })
    }
  }, [getContents, pageId])

  const { data: hello } = useFetch('api/hello?pages=a,v,b,s')
  console.log(hello)

  return (
    <Layout>
      <NoteCard pageId={pageId} />
    </Layout>
  )
}

export default Home
