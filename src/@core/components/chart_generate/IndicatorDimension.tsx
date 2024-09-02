import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchElements } from 'src/api/data/element'
import { fetchElementGroups } from 'src/api/element-groups/element-groups'

const IndicatorsDimension = ({ handleBack, title, subtitle, handleNext, setStep3 }) => {
  // 0 for element, 1 for element group
  const [type, setType] = useState(0)

  const [selectedIndicators, setSelectedIndicators] = useState([])
  const { t } = useTranslation()

  const {
    data: indicators,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['indicators', type],
    queryFn: async () => {
      const data = type === 0 ? await fetchElements({ all: true }) : await fetchElementGroups({ all: true })

      return type !== 0
        ? data?.data?.map(indicator => ({
            value: indicator.id,
            label: indicator.title
          }))
        : data?.data?.object?.map(indicator => ({
            value: indicator.id,
            label: indicator.title
          }))
    }
  })

  const onSubmit = () => {
    setStep3({
      type,
      data: selectedIndicators.map(indicator => indicator.value)
    })
    handleNext()
  }

  return (
    <form onSubmit={() => onSubmit()}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
            {title}
          </Typography>
          <Typography variant='caption' component='p'>
            {subtitle}
          </Typography>
        </Grid>
        <div className='grid gap-4 grid-cols-2 w-full p-5 mb-5 gap-x-4 gap-y-4 '>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Type</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={type}
              label='Type'
              onChange={e => {
                setType(e.target.value)
                setSelectedIndicators([])
              }}
            >
              <MenuItem value={0}>Element</MenuItem>
              <MenuItem value={1}>Element Group</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            {/* <Autocomplete
              multiple
              id='tags-outlined'
              options={zones || []}
              getOptionLabel={option => option.label}
              value={selectedZones}
              onChange={(event, newValue) => {
                setSelectedZones(newValue)
              }}
              renderInput={params => <TextField {...params} label='Zone' />}
            /> */}
            <Autocomplete
              multiple
              id='tags-outlined'
              options={indicators || []}
              getOptionLabel={option => option.label}
              value={selectedIndicators}
              onChange={(event, newValue) => {
                setSelectedIndicators(newValue)
              }}
              renderInput={params => <TextField {...params} label='Indicators' />}
            />
          </FormControl>
        </div>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button size='large' variant='outlined' color='secondary' onClick={handleBack}>
            {t('back')}
          </Button>
          <Button size='large' type='submit' variant='contained'>
            {t('next')}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default IndicatorsDimension
