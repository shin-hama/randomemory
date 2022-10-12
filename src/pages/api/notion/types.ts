import {
  BlockObjectResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
  SearchResponse,
  PartialDatabaseObjectResponse,
  UserObjectResponse,
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

export type AccessTokenResponse = {
  access_token: string
  workspace_id: string
  workspace_name?: string
  workspace_icon?: string
  bot_id: string
  owner: UserObjectResponse
}
