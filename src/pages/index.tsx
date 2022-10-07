import * as React from 'react'
import useSWR, { Fetcher } from 'swr'

import type { NextPage } from 'next'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import NoteCard from '../components/NoteCard'
import { Response } from './api/notion/pages'

const fetcher: Fetcher<Response, string> = (...args) => fetch(...args).then((res) => res.json())

const Home: NextPage = () => {
  const { data: databases } = useSWR<Response, undefined | null>('/api/notion/databases', fetcher)
  console.log(databases)
  const { data: page } = useSWR<Response, undefined | null>('/api/notion/pages', fetcher)
  console.log(page)

  return (
    <Container maxWidth="sm">
      <Typography variant="h1">Reminder Note</Typography>
      {page?.success && (
        <NoteCard
          body={page.body}
          createdAt={page.page.created_time}
          properties={page.properties}
        />
      )}
    </Container>
  )
}

export default Home
