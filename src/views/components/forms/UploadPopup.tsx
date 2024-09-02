import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Tabs, Tab, Box } from '@mui/material'
import PropTypes from 'prop-types'
import { saveDocsToReposisotry } from 'src/api/other'
import { fetchPbfMediaRepositoryByTitle } from 'src/api/file-manager'
import { useQuery } from '@tanstack/react-query'

const TabPanel = props => {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

const UploadPopup = ({ open, onClose, onFileUpload, onUrlSubmit, repo }) => {
  const [tabIndex, setTabIndex] = useState(0)
  const [url, setUrl] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['pbf-media-repositories'],
    queryFn: () => fetchPbfMediaRepositoryByTitle(repo)
  })

  const handleFileChange = async event => {
    const file = event.target.files[0]
    if (file) {
      await saveDocsToReposisotry({
        file,
        repositoryTitle: repo
      })
      onClose()
    }
  }

  const handleUrlSubmit = () => {
    onUrlSubmit(url)
    setUrl('')
    onClose()
  }

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Select File Source</DialogTitle>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label='upload tabs'>
        <Tab label='Upload' />
        <Tab label='Mon Drive' />
      </Tabs>
      <DialogContent>
        <TabPanel value={tabIndex} index={0}>
          <img src='/images/upload_background.png' alt='upload' />
          <Button variant='contained' component='label' className='w-100'>
            Parcourir
            <input type='file' hidden onChange={handleFileChange} />
          </Button>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <TextField label='Enter URL' value={url} onChange={e => setUrl(e.target.value)} fullWidth margin='normal' />
        </TabPanel>
      </DialogContent>
      <DialogActions>
        {tabIndex === 1 && (
          <Button onClick={handleUrlSubmit} color='primary'>
            Submit URL
          </Button>
        )}
        <Button onClick={onClose} color='secondary'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

UploadPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFileUpload: PropTypes.func.isRequired,
  onUrlSubmit: PropTypes.func.isRequired
}

export default UploadPopup
