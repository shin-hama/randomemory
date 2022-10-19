import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import ReactMarkdown from 'react-markdown'
import dayjs from 'dayjs'

import { useFetch } from '../hooks/useFetch'
import { PageContentResponse } from '../pages/api/notion/pages/[id]'

type Props = {
  pageId?: string
}
const NoteCard: React.FC<Props> = ({ pageId }) => {
  const { data: page, error } = useFetch<PageContentResponse>(
    pageId ? `api/notion/pages/${pageId}` : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
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

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} divider={<Divider />}>
          {page ? (
            <Box height="22rem" overflow="hidden" sx={{ overflowWrap: 'break-word' }}>
              <ReactMarkdown>{page.body || ''}</ReactMarkdown>
            </Box>
          ) : (
            <Skeleton variant="rectangular" height="10rem" animation="wave" />
          )}
          <Stack spacing={2}>
            {page ? (
              <Typography variant="subtitle2">
                Created at: {dayjs(page.page.created_time).format('YYYY/MM/DD HH:mm:ss')}
              </Typography>
            ) : (
              <Skeleton animation="wave" width="40%" />
            )}
            <Stack direction="row" spacing={1}>
              {page
                ? page.properties.map((prop) => <Chip key={prop} label={prop} />)
                : [...Array(3)].map((_, i) => (
                    <Skeleton
                      key={`chip-skeleton-${i}`}
                      variant="rounded"
                      animation="wave"
                      width="5rem"
                    />
                  ))}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
      {page && (
        <CardActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="text" href={page.page.url} target="_blank" rel="noreferrer noopener">
            Open in Notion
          </Button>
        </CardActions>
      )}
    </Card>
  )
}

export default NoteCard
