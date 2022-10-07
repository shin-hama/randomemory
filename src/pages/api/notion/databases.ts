import { GetDatabases } from './notion'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function databases(req: NextApiRequest, res: NextApiResponse) {
  const result = await GetDatabases()
  res?.status(200).json({ ...result })
}
