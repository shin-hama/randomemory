import type { NextPage } from 'next'
import NoteCard from '../components/NoteCard'
import { get } from './api/notion'

const Home: NextPage = (props) => {
  return (
    <>
      <NoteCard />
    </>
  )
}

export default Home

export async function getServerSideProps() {
  const test = await get()
  return { props: test }
}
