import * as React from 'react'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

import { useFetch } from '../hooks/useFetch'
import type { GetDatabasesResponse } from '../pages/api/notion/databases'
import { isFullDatabase } from '@notionhq/client'
import { DatabaseObject } from '../pages/api/notion/types'
import { plainText } from '../pages/api/lib/markdown'

const NotionSettings = () => {
  const { data: databases } = useFetch<GetDatabasesResponse>('/api/notion/databases')
  console.log(databases)

  return (
    <Stack>
      <Typography variant="h2">Public databases</Typography>
      {databases?.results
        .filter((data): data is DatabaseObject => isFullDatabase(data))
        .map((data) => (
          <Stack key={data.id} direction="row">
            <Typography>{plainText(data.title)}</Typography>
            <Switch />
          </Stack>
        ))}
    </Stack>
  )
}

export default NotionSettings
