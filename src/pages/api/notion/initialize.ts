import { Client } from '@notionhq/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyUserToken } from '../lib/firebaseAuth'
import { createUserClient } from './util'

export type InitNotionResponse =
  | {
      pages: Array<string>
      success: true
    }
  | {
      success: false
    }
export default async function initialize(
  req: NextApiRequest,
  res: NextApiResponse<InitNotionResponse>
) {
  const client = await createUserClient(req)

  const user = await verifyUserToken(req)
  if (client && user) {
    const result = await fetchPages(client)
    res.status(200).json({ pages: result, success: true })
  } else {
    res.status(400).json({ success: false })
  }
}

const fetchPages = async (client: Client, cursor?: string): Promise<Array<string>> => {
  const pages = await client.search({
    filter: { property: 'object', value: 'page' },
    start_cursor: cursor,
    page_size: 100,
  })

  const pageIds: Array<string> = pages.results.map((page) => page.id)

  if (pages.has_more) {
    return pageIds.concat(await fetchPages(client, pages.next_cursor || undefined))
  }

  return pageIds
}
