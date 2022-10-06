import type { NextPage } from 'next'
import NoteCard from '../components/NoteCard'
import { getPageContents } from './api/notion'

const Home: NextPage = (props) => {
  return (
    <>
      <NoteCard />
    </>
  )
}

export default Home

export async function getServerSideProps() {
  const result = await getPageContents()
  if (result.success) {
    return { props: result.page }
  } else {
    return { props: null }
  }
}
