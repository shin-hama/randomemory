import {
  BlockObjectResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
  SearchResponse,
  PartialDatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

export type DatabaseObject = DatabaseObjectResponse
export type PartialDatabaseObject = PartialDatabaseObjectResponse

export type PageObject = PageObjectResponse

export type BlockObject = BlockObjectResponse & {
  children?: Array<BlockObject>
}

export type PropertyObject = PageObjectResponse['properties']

export type RichTextItem = RichTextItemResponse

export type SearchObjet = SearchResponse
