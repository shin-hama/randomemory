import { Client } from '@notionhq/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import type { DatabaseObject, PartialDatabaseObject, SearchObjet } from './types'
import { createUserClient } from './util'

export type GetDatabasesResponse = Omit<SearchObjet, 'results'> & {
  results: Array<DatabaseObject | PartialDatabaseObject>
}

export default async function databases(req: NextApiRequest, res: NextApiResponse) {
  const client = await createUserClient(req)

  if (client) {
    const result = await GetDatabases(client)

    res?.status(200).json({ ...result })
  } else {
    res.status(400).json({ success: false })
  }
}

async function GetDatabases(notion: Client) {
  const response = await notion.search({
    query: '',
    filter: {
      property: 'object',
      value: 'database',
    },
  })

  return response
}
