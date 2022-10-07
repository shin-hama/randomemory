import type { NextPage } from 'next'
import Typography from '@mui/material/Typography'

import NoteCard from '../components/NoteCard'
import { getPageContents, Response } from './api/notion'

const Home: NextPage<Response> = (props) => {
  return (
    <>
      <Typography variant="h1">Reminder Note</Typography>
      {props.success && (
        <NoteCard
          body={props.body}
          createdAt={props.page.created_time}
          properties={props.properties}
        />
      )}
    </>
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
