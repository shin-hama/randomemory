import { Client } from '@notionhq/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyUserToken } from '../lib/firebaseAuth'
import { createUserClient } from './util'

export default async function initialize(req: NextApiRequest, res: NextApiResponse) {
  const client = await createUserClient(req)

  const user = await verifyUserToken(req)
  if (client && user) {
    const result = await fetchPages(client)
    res.status(200).json({ result })
  } else {
    res.status(400).json({ success: false })
  }
}

const fetchPages = async (client: Client): Promise<Array<string>> => {
  const pages = await client.search({
    filter: { property: 'object', value: 'page' },
    page_size: 100,
  })

  const pageIds: Array<string> = []
  pageIds.concat(pages.results.map((page) => page.id))

  if (pages.has_more) {
    pageIds.concat(await fetchPages(client))
  }

  return pageIds
}
