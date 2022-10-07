import { Client, isFullPage } from '@notionhq/client'
import { renderPage, renderProperty } from './lib/render'
import { BlockObject, PageObject } from './notion/types'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

const databaseId = process.env.NOTION_DATABASE_ID

export type Response =
  | {
      success: true
      page: PageObject
      properties: Array<string>
      blocks: Array<BlockObject>
      body: string
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
        if (isFullPage(page)) {
          const blocks = await getBlocks(page.id)
          const properties = isFullPage(page) ? renderProperty(page.properties) : []
          const body = renderPage(blocks)

          return {
            success: true,
            page,
            blocks,
            properties,
            body,
          }
        } else {
          return { success: false }
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

const getBlocks = async (parentId: string): Promise<Array<BlockObject>> => {
  const blocks: BlockObject[] = []
  let cursor = null
  do {
    try {
      const {
        results,
        next_cursor: nextCursor,
        has_more: hasMore,
      } = await notion.blocks.children.list({
        block_id: parentId,
      })
      for (const block of results) {
        if ('type' in block) {
          if (block.has_children) {
            const children = await getBlocks(block.id)
            blocks.push({ ...block, children })
          } else {
            blocks.push({ ...block })
          }
        }
      }
      cursor = hasMore ? nextCursor : null
    } catch (e) {
      console.error(e)
      break
    }
  } while (cursor !== null)
  return blocks
}
