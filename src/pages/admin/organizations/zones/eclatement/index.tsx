'use client'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { fetchOneZone, fetchZones } from 'src/api/organizations/zones'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { PERMISSIONS } from 'src/constants'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Button, Card, CardActions, CardContent, CardHeader, Divider } from '@mui/material'
import { Box } from '@mui/system'
import SubmitButton from 'src/views/components/forms/SubmitButton'

const EclatementForm = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { control, handleSubmit, setValue } = useForm()
  const [numberOfZones, setNumberOfZones] = useState(2)
  const [selectedSubZones, setSelectedSubZones] = useState({})

  let { id } = router.query

  const {
    data: zone,
    isLoading,
    error
  } = useQuery({
    queryKey: ['org_zone', id],
    queryFn: () => fetchOneZone(parseInt(id)),
    enabled: !!id
  })

  const { data: subZones, isLoading: isLoadingSubZones } = useQuery({
    queryKey: ['org_zones'],
    queryFn: () =>
      fetchZones({
        all: true,
        parentId: parseInt(id)
      }),
    enabled: !!id
  })

  const onSubmit = data => {
    const formattedData = {
      id: parseInt(id), // Assuming id is from the router query
      name: zone?.name || '', // The name of the "eclated" zone
      zones: []
    }

    for (let i = 1; i <= numberOfZones; i++) {
      formattedData.zones.push({
        name: data[`zone_${i}_name`],
        children: data[`zone_${i}_sub_zones`] || []
      })
    }

    console.log(formattedData)
  }

  useEffect(() => {
    if (zone) {
      setValue('zone_1_name', zone.name)
    }
  }, [zone, setValue])

  const handleZoneChange = (index, value) => {
    setSelectedSubZones(prev => ({
      ...prev,
      [index]: value
    }))
  }

  if (isLoading || isLoadingSubZones || error) {
    return <div>Loading...</div>
  }

  const filterSubZones = index => {
    const selected = Object.values(selectedSubZones).flat()

    return (
      subZones?.data?.filter(
        subZone => !selected.includes(subZone.id) || selectedSubZones[index]?.includes(subZone.id)
      ) || []
    )
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader title={`${t('Eclatement')} de ${zone?.name}`} />
        <Divider sx={{ m: '0 !important' }} />

        <CardContent className={'w-full'}>
          <div className='w-full flex flex-col items-stretch gap-8 sm:gap-14 mt-4'>
            <div className='grid gap-4 grid-cols-2'>
              <Controller
                name='numberOfZones'
                control={control}
                defaultValue={2}
                render={({ field }) => (
                  <TextField
                    type='number'
                    {...field}
                    onChange={e => {
                      if (+e.target.value < 2 || +e.target.value > 4) return
                      field.onChange(e)
                      setNumberOfZones(parseInt(e.target.value))
                    }}
                    inputProps={{ min: 2, max: 4 }}
                    variant='outlined'
                    fullWidth
                    label={t('Number of zones')}
                  />
                )}
              />
              {/* // the start date of the eclatement */}
              <Controller
                name='start_date'
                control={control}
                render={({ field }) => (
                  <TextField {...field} type='date' variant='outlined' fullWidth placeholder={t('Start Date')} />
                )}
              />
            </div>
            {numberOfZones &&
              [...Array(numberOfZones)].map((_, index) => (
                <div key={index} className='grid gap-4 grid-cols-2 '>
                  <div>
                    <Controller
                      name={`zone_${index + 1}_name`}
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} variant='outlined' fullWidth label={t(`Zone ${index + 1} Name`)} />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      name={`zone_${index + 1}_sub_zones`}
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          multiple
                          options={filterSubZones(index)}
                          getOptionLabel={option => option.name}
                          renderInput={params => (
                            <TextField {...params} variant='outlined' label={t(`Zone ${index + 1} Sub Zones`)} />
                          )}
                          onChange={(_, value) => {
                            const selectedOptions = value.map(option => option.id)
                            field.onChange(selectedOptions)
                            handleZoneChange(index, selectedOptions)
                          }}
                          value={subZones?.data.filter(subZone => field.value?.includes(subZone.id)) || []}
                        />
                      )}
                    />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
        <Divider sx={{ m: '0 !important' }} />
        <CardActions>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'end', marginTop: '10px', width: '100%' }}>
            <Button size='medium' variant='outlined'>
              {t('cancel')}
            </Button>
            <Button size='medium' variant='contained' type='submit'>
              {t('submit')}
            </Button>
          </Box>
        </CardActions>
      </form>
    </Card>
  )
}
EclatementForm.acl = [PERMISSIONS.zone.write, PERMISSIONS.zone.update]
export default EclatementForm
