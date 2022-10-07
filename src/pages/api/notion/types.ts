import {
  BlockObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'

export type BlockObject = BlockObjectResponse & {
  children?: Array<BlockObject>
}

export type PropertyObject = PageObjectResponse['properties']

export type RichTextItem = RichTextItemResponse
