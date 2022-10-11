import * as React from 'react'
import type { NextPage } from 'next'

import { Response } from './api/notion/pages'
import Layout from '../components/Layout'
import NoteCard from '../components/NoteCard'
import { useFetch } from '../hooks/useFetch'

const Home: NextPage = () => {
  const { data: page } = useFetch<Response>('/api/notion/pages')
  console.log(page)

  return (
    <Layout>
      {page?.success && (
        <NoteCard
          body={page.body}
          createdAt={page.page.created_time}
          properties={page.properties}
        />
      )}
    </Layout>
  )
}

export default Home
