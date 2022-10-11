import type { NextApiRequest, NextApiResponse } from 'next'
import { renderPage, renderProperty } from '../lib/render'
import { BlockObject, PageObject } from './types'

import { notion } from './notion'
import { isFullPage } from '@notionhq/client'

const pageIds = ['a', 'b', 'c', 'd', 'e', 'f']
const pageId = process.env.NOTION_PAGE_ID

export default async function pages(req: NextApiRequest, res: NextApiResponse) {
  const result = await getPageContents()

  res?.status(200).json({ ...result })
}

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
const getPageContents = async (): Promise<Response> => {
  try {
    if (pageId) {
      const id = pageIds[Math.floor(Math.random() * pageIds.length)]
      const page = await notion.pages.retrieve({
        page_id: pageId,
      })

      if (isFullPage(page)) {
        const blocks = await getBlocks(page.id)
        const properties = renderProperty(page.properties)
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
