import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ReactMarkdown from 'react-markdown'
import dayjs from 'dayjs'

import { useFetch } from '../hooks/useFetch'
import { PageContentResponse } from '../pages/api/notion/pages/[id]'

type Props = {
  pageId?: string
}
const NoteCard: React.FC<Props> = ({ pageId }) => {
  const { data: page, error } = useFetch<PageContentResponse>(
    pageId ? `api/notion/pages/${pageId}` : null
  )

  if (error || page?.success === false) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography>{error?.message}</Typography>
        </CardContent>
      </Card>
    )
  }

  if (!page) {
    return <>loading</>
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} divider={<Divider />}>
          <ReactMarkdown>{page?.body || ''}</ReactMarkdown>
          <Stack spacing={2}>
            <Typography variant="subtitle2">
              Created at: {dayjs(page?.page.created_time).format('YYYY/MM/DD HH:mm:ss')}
            </Typography>
            <Stack direction="row" spacing={1}>
              {page?.properties?.map((prop) => (
                <Chip key={prop} label={prop} />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default NoteCard
