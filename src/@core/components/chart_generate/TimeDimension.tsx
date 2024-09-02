import { cu } from '@fullcalendar/core/internal-common'
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { years as yearsA } from 'src/@core/utils'

const TimeDimension = ({ title, subtitle, handleNext, setStep1 }) => {
  const [selectedYears, setSelectedYears] = useState([])
  const [timeType, setTimeType] = useState('')
  const [options, setOptions] = useState({})
  const [selectedOptions, setSelectedOptions] = useState({})
  const { t } = useTranslation()

  useEffect(() => {
    const newOptions = {}
    const newSelectedOptions = { ...selectedOptions }
    if (timeType === 'quarter' || timeType === 'month') {
      selectedYears.forEach(year => {
        if (timeType === 'quarter') {
          newOptions[year] = ['Q1', 'Q2', 'Q3', 'Q4']
        } else if (timeType === 'month') {
          newOptions[year] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
        if (!newSelectedOptions[year]) {
          newSelectedOptions[year] = []
        }
      })
    }
    setOptions(newOptions)
    setSelectedOptions(newSelectedOptions)
  }, [selectedYears, timeType])

  const handleCheckboxChange = (year, option, isChecked) => {
    const yearOptions = selectedOptions[year] || []
    if (isChecked) {
      setSelectedOptions({ ...selectedOptions, [year]: [...yearOptions, option] })
    } else {
      setSelectedOptions({ ...selectedOptions, [year]: yearOptions.filter(o => o !== option) })
    }
  }

  const handleSubmit = e => {
    e.preventDefault()

    setStep1({
      type: timeType,
      data:
        timeType === 'year'
          ? selectedYears
          : Object.keys(selectedOptions).map(year => ({ year, value: selectedOptions[year] }))
    })

    handleNext()
  }

  const handleYearChange = e => {
    const selectedOptions = e.target.value
    setSelectedYears(selectedOptions)
  }

  const currentYear = new Date().getFullYear()

  // const years = Array.from(new Array(20), (val, index) => currentYear - index)
  const years = yearsA.map(year => year)

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
            {t(title)}
          </Typography>
          <Typography variant='caption' component='p'>
            {t(subtitle)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>{t('Year')}</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={selectedYears}
              onChange={handleYearChange}
              multiple
              label='Year'
            >
              {years.map(yearOption => (
                <MenuItem key={yearOption} value={yearOption}>
                  {yearOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>{t('Time Type')}</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={timeType}
              onChange={e => setTimeType(e.target.value)}
              label='Time Type'
            >
              <MenuItem value=''>{t('Select...')}</MenuItem>
              <MenuItem value='year'>{t('Year')}</MenuItem>
              <MenuItem value='quarter'>{t('Quarter')}</MenuItem>
              <MenuItem value='month'>{t('Month')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
            {t('Time Options')}
          </Typography>
          <div className='divider' />
          <div className='flex '>
            {Object.keys(options).map(year => (
              <div key={year}>
                <Typography variant='caption' component='p' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {t(year)}
                </Typography>
                {options[year].map(option => (
                  <FormControl key={`${year}-${option}`} fullWidth>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedOptions[year]?.includes(option)}
                          onChange={e => handleCheckboxChange(year, option, e.target.checked)}
                        />
                      }
                      label={t(option)}
                    />
                  </FormControl>
                ))}
              </div>
            ))}
          </div>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button size='large' type='submit' variant='contained'>
            {t('next')}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default TimeDimension
