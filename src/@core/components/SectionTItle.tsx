import React from 'react'
import { Box, CardHeader, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

function SectionTitle({ title, total, addButton }: { title: string; total?: number; addButton?: any }) {
  const { t } = useTranslation()

  return (
    <CardHeader
      sx={{
        borderBottom: 2,
        borderBottomColor: 'divider',
        borderBottomStyle: 'solid'
      }}
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className='flex gap-2'>
            <Typography variant='h6'>{t(title)}</Typography>
            {total && <Typography variant='h6'>[{total}]</Typography>}
          </div>
          {addButton}
        </Box>
      }
    />
  )
}

export default SectionTitle
