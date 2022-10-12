import { Client } from '@notionhq/client'

export const notion = new Client({ auth: process.env.NOTION_TOKEN })

export const createClient = (token: string) => {
  return new Client({ auth: token })
}
