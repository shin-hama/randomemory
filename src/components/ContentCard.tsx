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

import { Content } from '../types/models'

type Props = {
  content?: Content
  provider: string
  error?: string
}
const ContentCard: React.FC<Props> = ({ content, provider, error }) => {
  if (error) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography>{error}</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} divider={<Divider />}>
          {content ? (
            <Box maxHeight="30rem" overflow="auto" sx={{ overflowWrap: 'break-word' }}>
              <ReactMarkdown>{content.body || ''}</ReactMarkdown>
            </Box>
          ) : (
            <Skeleton variant="rectangular" height="20rem" animation="wave" />
          )}
          <Stack spacing={2}>
            {content ? (
              <Typography variant="subtitle2">
                Created at: {dayjs(content.timestamp).format('YYYY/MM/DD HH:mm:ss')}
              </Typography>
            ) : (
              <Skeleton animation="wave" width="40%" />
            )}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                overflowX: 'scroll',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              {content
                ? content.properties.map((prop) => <Chip key={prop} label={prop} />)
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
      {content && (
        <CardActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="text" href={content.url} target="_blank" rel="noreferrer noopener">
            Open in {provider}
          </Button>
        </CardActions>
      )}
    </Card>
  )
}

export default ContentCard
