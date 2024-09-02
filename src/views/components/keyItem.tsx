// KeyValueItem.js
import React from 'react'
import { Box, Typography } from '@mui/material'

const KeyValueItem = ({ value, comp = null, valueStyle = {}, title }) => {
  return (
    <Box display='flex' alignItems='center' gap={2}>
      <Typography variant='subtitle2' fontWeight='medium'>
        {title}:
      </Typography>
      {value ? (
        <Typography fontWeight='bold' style={valueStyle}>
          {value}
        </Typography>
      ) : (
        comp
      )}
    </Box>
  )
}

export default KeyValueItem
