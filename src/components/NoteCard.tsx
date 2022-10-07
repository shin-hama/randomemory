import * as React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ReactMarkdown from 'react-markdown'
import dayjs from 'dayjs'

type Props = {
  body: string
  createdAt: string
  properties?: Array<string>
}
const NoteCard: React.FC<Props> = ({ body, createdAt, properties }) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} divider={<Divider />}>
          <ReactMarkdown>{body}</ReactMarkdown>
          <Stack spacing={2}>
            <Typography variant="subtitle2">
              Created at: {dayjs(createdAt).format('YYYY/MM/DD HH:mm:ss')}
            </Typography>
            <Stack direction="row" spacing={1}>
              {properties?.map((prop) => (
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
