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
import { fetchEntities } from 'src/api/entities'
import { fetchZonesByLevel } from 'src/api/organizations/zones'

const levels = [
  { value: 2, label: 'Region' },
  { value: 4, label: 'Moughataa' },
  { value: 5, label: 'Aire de santé' },
  { value: 6, label: 'Entités' }
]
const SpaceDimension = ({ handleBack, title, subtitle, handleNext, setStep2 }) => {
  const [level, setLevel] = useState(2)
  const [selectedZones, setSelectedZones] = useState([])
  const { t } = useTranslation()

  const {
    data: zones,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['zones', level],
    queryFn: async () => {
      const data = level !== 6 ? await fetchZonesByLevel(level, undefined, true) : await fetchEntities({})

      return data?.map(zone => ({
        value: zone.id,
        label: zone.name
      }))
    }
  })

  const onSubmit = () => {
    setStep2({
      level,
      zones: selectedZones.map(zone => zone.value)
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
            <InputLabel id='demo-simple-select-label'>Level</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={level}
              label='Level'
              onChange={e => {
                setLevel(e.target.value)
                setSelectedZones([])
              }}
            >
              {levels.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Autocomplete
              multiple
              id='tags-outlined'
              options={zones || []}
              getOptionLabel={option => option.label}
              value={selectedZones}
              onChange={(event, newValue) => {
                setSelectedZones(newValue)
              }}
              renderInput={params => <TextField {...params} label='Zone' />}
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

export default SpaceDimension
