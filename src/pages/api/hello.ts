// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(req?: NextApiRequest, res?: NextApiResponse<Data>) {
  try {
    await fetch('https://sayu-do.com/2022-2-3/196/')
    res?.status(200).json({ name: 'John Doe' })
    console.log('succses')
  } catch (e) {
    console.log(e)
  }
}
