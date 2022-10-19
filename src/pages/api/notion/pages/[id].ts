import type { NextApiRequest, NextApiResponse } from 'next'
import { Client, isFullPage } from '@notionhq/client'

import { renderPage, renderProperty } from '../../lib/render'
import { BlockObject, PageObject } from '../types'
import { createUserClient } from '../util'
import { verifyUserToken } from '../../lib/firebaseAuth'

export default async function pages(req: NextApiRequest, res: NextApiResponse) {
  const user = await verifyUserToken(req)
  if (!user) {
    res.status(401).json({ success: false })
  }

  const client = await createUserClient(req)
  const [pageId] = [req.query.id].flat(1)

  if (client && pageId) {
    const result = await getPageContents(client, pageId)
    res.status(200).json({ ...result })
  } else {
    res.status(400).json({ success: false })
  }
}

export type PageContentResponse =
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
const getPageContents = async (notion: Client, pageId: string): Promise<PageContentResponse> => {
  try {
    const page = await notion.pages.retrieve({
      page_id: pageId,
    })

    if (isFullPage(page)) {
      const blocks = await getBlocks(notion, page.id)
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
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}

const getBlocks = async (notion: Client, parentId: string): Promise<Array<BlockObject>> => {
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
            const children = await getBlocks(notion, block.id)
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
