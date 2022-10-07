import * as React from 'react'
import useSWR from 'swr'

import type { NextPage } from 'next'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import NoteCard from '../components/NoteCard'
import { getPageContents, Response } from './api/notion/notion'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const Home: NextPage<Response> = (props) => {
  const { data, error } = useSWR('/api/notion/databases', fetcher)
  console.log(data)

  return (
    <Container maxWidth="sm">
      <Typography variant="h1">Reminder Note</Typography>
      {props.success && (
        <NoteCard
          body={props.body}
          createdAt={props.page.created_time}
          properties={props.properties}
        />
      )}
    </Container>
  )
}

export default Home

export async function getServerSideProps() {
  const result = await getPageContents()
  if (result.success) {
    return { props: result }
  } else {
    return { props: null }
  }
}
