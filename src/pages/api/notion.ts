import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

const databaseId = process.env.NOTION_DATABASE_ID

export const get = async () => {
  try {
    if (databaseId) {
      const response = await notion.databases.query({
        database_id: databaseId,
      })
      console.log(response)
      console.log('Success! Entry added.')
      return { results: response.results }
    }
  } catch (error) {
    console.error(error)
    return { error: 'error' }
  }
}
