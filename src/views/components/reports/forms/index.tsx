import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useSearchParams } from 'next/navigation'
import { Button, CardActions } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getZonesOptions, monthsObjectFrench, years } from 'src/@core/utils'
import { fetchEntitiesByZoneId } from 'src/api/entities'
import { fetchZonesByUser } from 'src/api/organizations/zones'
import { trimOptions } from 'src/configs/constant'
import { reportsTypesEnum } from 'src/constants'

interface FormInputs {
  entityClass: string
  wilaya: string
  moughataa: string
  zoneSanitaire: string
  entity: string
  month: string
  year: string
  trim: string
}

const defaultValues: FormInputs = {
  wilaya: '',
  moughataa: '',
  zoneSanitaire: '',
  entity: '',
  month: '',
  year: '',
  trim: ''
}

const FormFacture = ({ typeInfo, handleFetchFactures }) => {
  const { id, uid: type } = typeInfo
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })
  const searchParams = useSearchParams()
  const { t } = useTranslation()

  const zoneSanitaire = watch('zoneSanitaire')
  const entity = watch('entity')
  const wilayaa = watch('wilaya')
  const moughataa = watch('moughataa')
  const month = watch('month')
  const year = watch('year')
  const trim = watch('trim')

  const { data: zonesByUser } = useQuery({
    queryKey: ['zonesByUser'],
    queryFn: () => fetchZonesByUser()
  })

  const { wilayas, moughataas, zoneSanitaires } = useMemo(() => {
    return getZonesOptions(wilayaa, moughataa, zonesByUser)
  }, [zonesByUser, wilayaa, moughataa])

  // Fetch entities based on zone
  const { data: entities } = useQuery({
    queryKey: ['entities', zoneSanitaire],
    queryFn: () =>
      zoneSanitaire
        ? fetchEntitiesByZoneId({ zoneId: +zoneSanitaire, entityclassId: parseInt(searchParams.get('classe')!) })
        : null,
    enabled: !!zoneSanitaire
  })

  // Compute month and year options
  const monthOptions = useMemo(() => {
    return Object.keys(monthsObjectFrench).map(key => ({
      value: key,
      label: monthsObjectFrench[key]
    }))
  }, [])

  const yearOptions = useMemo(() => years.map(year => ({ value: year, label: year })), [])

  // Submission handling
  const submit = async (data: FormInputs) => {
    const formDtata = {
      year: year,
      month: {
        value: month,
        label: monthsObjectFrench[month]
      },
      entity: {
        value: entity,
        label: entities?.find(el => el.id === entity)?.name
      },
      wilaya: wilayas?.find(w => w.value === wilayaa),
      moughataa: moughataas?.find(m => m.value == moughataa) || '',
      zoneSanitaire: zoneSanitaires?.find(zone => zone.value === zoneSanitaire) || '',
      period: `Trim - ${trim}`,
      bank: entities?.find(el => el.id === entity)?.bank_name,
      bankAccount: entities?.find(el => el.id === entity)?.bankAccount,
      trim: trim
    }

    handleFetchFactures(formDtata, id)
  }

  // Snackbar close handler

  return (
    <Card
      sx={{
        p: 2,
        mb: 3,
        width: '100%'
      }}
    >
      <form onSubmit={handleSubmit(submit)}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel
                  id='validation-basic-select'
                  error={Boolean(errors.wilaya)}
                  htmlFor='validation-basic-select'
                >
                  {t('Wilaya')}
                </InputLabel>
                <Controller
                  name='wilaya'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      fullWidth
                      value={value}
                      id='select-wilaya'
                      label='Select Wilaya'
                      labelId='wilaya-select'
                      onChange={onChange}
                      inputProps={{ placeholder: 'Select Wilaya' }}
                      error={Boolean(errors.wilaya)}
                    >
                      {wilayas?.map(wilaya => (
                        <MenuItem key={wilaya.value} value={wilaya.value}>
                          {wilaya.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            {type !== reportsTypesEnum.CONSOLIDE_MENSUELLE_WILAYA && (
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel
                    id='validation-basic-select'
                    error={Boolean(errors.moughataa)}
                    htmlFor='validation-basic-select'
                  >
                    {t('Moughataa')}
                  </InputLabel>
                  <Controller
                    name='moughataa'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        fullWidth
                        value={value}
                        id='select-moughataa'
                        label='Select Moughataa'
                        labelId='moughataa-select'
                        onChange={onChange}
                        inputProps={{ placeholder: 'Select Moughataa' }}
                        error={Boolean(errors.moughataa)}
                      >
                        {moughataas?.map(moughataa => (
                          <MenuItem key={moughataa.value} value={moughataa.value}>
                            {moughataa.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            )}

            {![reportsTypesEnum.CONSOLIDE_MENSUELLE_WILAYA, reportsTypesEnum.CONSOLIDE_MENSUELLE_MOUGHATAA].includes(
              type
            ) && (
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel
                    id='validation-basic-select'
                    error={Boolean(errors.zoneSanitaire)}
                    htmlFor='validation-basic-select'
                  >
                    {t('Zone Sanitaire')}
                  </InputLabel>

                  <Controller
                    name='zoneSanitaire'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        fullWidth
                        value={value}
                        id='select-zoneSanitaire'
                        label='Select Zone Sanitaire'
                        labelId='zoneSanitaire-select'
                        onChange={onChange}
                        inputProps={{ placeholder: 'Select Zone Sanitaire' }}
                        error={Boolean(errors.zoneSanitaire)}
                      >
                        {zoneSanitaires?.map(zoneSanitaire => (
                          <MenuItem key={zoneSanitaire.value} value={zoneSanitaire.value}>
                            {zoneSanitaire.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            )}

            {[reportsTypesEnum.CONSOLIDE_MENSUELLE_PRESTATAIRES, reportsTypesEnum.BONUS_QUALITE].includes(type) && (
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel
                    id='validation-basic-select'
                    error={Boolean(errors.entity)}
                    htmlFor='validation-basic-select'
                  >
                    {t('Entity')}
                  </InputLabel>
                  <Controller
                    name='entity'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        fullWidth
                        value={value}
                        id='select-entity'
                        label='Select Entity'
                        labelId='entity-select'
                        onChange={onChange}
                        inputProps={{ placeholder: 'Select Entity' }}
                        error={Boolean(errors.entity)}
                      >
                        {entities?.map(entity => (
                          <MenuItem key={entity.id} value={entity.id}>
                            {entity.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id='validation-basic-select' error={Boolean(errors.year)} htmlFor='validation-basic-select'>
                  {t('Year')}
                </InputLabel>

                <Controller
                  name='year'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      fullWidth
                      value={value}
                      id='select-year'
                      label='Select Year'
                      labelId='year-select'
                      onChange={onChange}
                      inputProps={{ placeholder: 'Select Year' }}
                      error={Boolean(errors.year)}
                    >
                      {yearOptions.map(year => (
                        <MenuItem key={year.value} value={year.value}>
                          {year.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            {type !== reportsTypesEnum.BONUS_QUALITE && (
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel
                    id='validation-basic-select'
                    error={Boolean(errors.month)}
                    htmlFor='validation-basic-select'
                  >
                    {t('Month')}
                  </InputLabel>
                  <Controller
                    name='month'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        fullWidth
                        value={value}
                        id='select-month'
                        label='Select Month'
                        labelId='month-select'
                        onChange={onChange}
                        inputProps={{ placeholder: 'Select Month' }}
                        error={Boolean(errors.month)}
                      >
                        {monthOptions.map(month => (
                          <MenuItem key={month.value} value={month.value}>
                            {t(month.label)}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            )}
            {type === reportsTypesEnum.BONUS_QUALITE && (
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel
                    id='validation-basic-select'
                    error={Boolean(errors.trim)}
                    htmlFor='validation-basic-select'
                  >
                    {t('trimestre')}
                  </InputLabel>
                  <Controller
                    name='trim'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        fullWidth
                        value={value}
                        id='select-trim'
                        label='Select Trimestre'
                        labelId='trim-select'
                        onChange={onChange}
                        inputProps={{ placeholder: 'Select Trimestre' }}
                        error={Boolean(errors.trim)}
                      >
                        {trimOptions.map(trim => (
                          <MenuItem key={trim.value} value={trim.value}>
                            {t(trim.label)}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            )}
          </Grid>
        </CardContent>
        <Divider sx={{ m: '0 !important' }} />
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
            {t('Generate')}
          </Button>
          <Button type='reset' size='large' color='secondary' variant='outlined' onClick={reset}>
            {t('Effacer')}
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default FormFacture
