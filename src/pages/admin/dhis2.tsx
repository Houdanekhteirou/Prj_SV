// ** Next Import
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'

import 'chart.js/auto'
import React from 'react'

const dhis = () => {
  const theme = useTheme()
  const { t } = useTranslation()

  return <Typography variant='h5'>{t(' dhis')}</Typography>
}

export default dhis
