import { Client } from '@notionhq/client'
import {
  QueryDatabaseResponse,
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

const databaseId = process.env.NOTION_DATABASE_ID

type Response =
  | {
      success: true
      page: QueryDatabaseResponse['results'][number]
      blocks: ListBlockChildrenResponse['results']
    }
  | {
      success: false
    }
export const getPageContents = async (): Promise<Response> => {
  try {
    if (databaseId) {
      const response = await notion.databases.query({
        database_id: databaseId,
      })

      if (response.results.length > 0) {
        const page = response.results[0]
        const blocks = await getBlocks(page.id)

        return {
          success: true,
          page,
          blocks,
        }
      } else {
        return {
          success: false,
        }
      }
    } else {
      return { success: false }
    }
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}

const getBlocks = async (id: string): Promise<ListBlockChildrenResponse['results']> => {
  try {
    const result = await notion.blocks.children.list({ block_id: id, page_size: 50 })
    return result.results
  } catch (e) {
    console.error(e)
    return []
  }
}
