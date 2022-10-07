import type { NextPage } from 'next'
import ReactMarkdown from 'react-markdown'

import NoteCard from '../components/NoteCard'
import { getPageContents, Response } from './api/notion'

const Home: NextPage<Response> = (props) => {
  console.log(props)
  return (
    <>
      <NoteCard />
      {props.success && <ReactMarkdown>{props.body}</ReactMarkdown>}
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
