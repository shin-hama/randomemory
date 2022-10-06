import { BlockObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'

export type BlockObject = BlockObjectResponse & {
  children?: Array<BlockObject>
}

export type RichTextItem = RichTextItemResponse
