const clientId = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID
if (!clientId) {
  throw new Error('NEXT_PUBLIC_NOTION_CLIENT_ID is not defined')
}
export const NOTION_LOGIN_URL = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code`
