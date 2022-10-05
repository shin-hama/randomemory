import * as React from 'react'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_TOKEN })

const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID

export const TestButton = () => {
  const add = React.useCallback(async (text: string) => {
    try {
      console.log(process.env.NEXT_PUBLIC_NOTION_TOKEN)

      console.log(databaseId)
      if (databaseId) {
        const response = await notion.pages.create({
          parent: { database_id: databaseId },
          properties: {
            title: {
              title: [
                {
                  text: {
                    content: text,
                  },
                },
              ],
            },
          },
        })
        console.log(response)
        console.log('Success! Entry added.')
      }
    } catch (error) {
      console.error(error)
    }
  }, [])

  return <button onClick={async () => await add('test')}>Add item</button>
}
