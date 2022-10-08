import * as React from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { NextPage } from 'next'

import Layout from '../components/Layout'
import TabPanel from '../components/TabPanel'
import NotionSettings from '../components/NotionSettings'

const Setting: NextPage = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Layout>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Notion"></Tab>
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <NotionSettings />
      </TabPanel>
    </Layout>
  )
}

export default Setting
