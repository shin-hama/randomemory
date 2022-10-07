import type { NextApiRequest, NextApiResponse } from 'next'

import { notion } from './notion'

export default async function databases(req: NextApiRequest, res: NextApiResponse) {
  const result = await GetDatabases()

  res?.status(200).json({ ...result })
}

async function GetDatabases() {
  const response = await notion.search({
    query: '',
    filter: {
      property: 'object',
      value: 'database',
    },
  })

  return response
}
