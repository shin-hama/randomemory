import * as React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const NoteCard = () => {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2} divider={<Divider />}>
          <Box>
            <Typography variant="h2" fontWeight="bold">
              Head
            </Typography>
            <Typography variant="body1">Body</Typography>
          </Box>
          <Typography variant="subtitle2">2022-01-01</Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default NoteCard
