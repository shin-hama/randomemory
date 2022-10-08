import * as React from 'react'
import Typography from '@mui/material/Typography'
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
      <Typography variant="h1">Reminder Note</Typography>
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
