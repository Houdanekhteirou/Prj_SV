import { Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getZonesOptions, monthsObjectFrench, years } from 'src/@core/utils'
import { fetchEntitiesByZoneId } from 'src/api/entities'
import { fetchZonesByUser } from 'src/api/organizations/zones'
import { trimOptions } from 'src/configs/constant'
import { reportsTypesEnum } from 'src/constants'

const FormFacture = ({ type }) => {
  const searchParams = useSearchParams()
  const { t } = useTranslation()

  const {
    control,
    watch,
    getValues,
    formState: { errors }
  } = useFormContext()

  console.log('getValues', getValues('wilaya'), getValues('moughataa'))

  const { data: zonesByUser } = useQuery({
    queryKey: ['zonesByUser'],
    queryFn: fetchZonesByUser
  })

  const { wilayas, moughataas, zoneSanitaires } = useMemo(() => {
    return getZonesOptions(getValues('wilaya'), getValues('moughataa'), zonesByUser)
  }, [zonesByUser, watch('wilaya'), watch('moughataa')])

  const { data: entities } = useQuery({
    queryKey: ['entities', watch('zoneSanitaire')],
    queryFn: () =>
      fetchEntitiesByZoneId({
        zoneId: +getValues('zoneSanitaire'),
        entityclassId: parseInt(searchParams.get('classe')!)
      }),
    enabled: !!getValues('zoneSanitaire')
  })

  const monthOptions = useMemo(
    () =>
      Object.keys(monthsObjectFrench).map(key => ({
        value: key,
        label: monthsObjectFrench[key]
      })),
    []
  )

  const yearOptions = useMemo(() => years.map(year => ({ value: year, label: year })), [])

  const renderSelect = (name, label, options, error, required = true) => (
    <FormControl fullWidth key={name}>
      <InputLabel error={Boolean(error)} id={name} htmlFor={name}>
        {t(label)}
      </InputLabel>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field: { value, onChange } }) => (
          <Select fullWidth value={value} onChange={onChange} error={Boolean(error)} id={name} labelId={name}>
            <MenuItem value=''>
              <em>{t('none')}</em>
            </MenuItem>
            {options?.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  )

  return (
    <Card sx={{ p: 2, mb: 3, width: '100%' }}>
      <form>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              {renderSelect('wilaya', 'Wilaya', wilayas, errors.wilaya)}
            </Grid>

            {type !== reportsTypesEnum.CONSOLIDE_MENSUELLE_WILAYA && (
              <Grid item xs={12} md={4}>
                {renderSelect('moughataa', 'Moughataa', moughataas, errors.moughataa)}
              </Grid>
            )}

            {![reportsTypesEnum.CONSOLIDE_MENSUELLE_WILAYA, reportsTypesEnum.CONSOLIDE_MENSUELLE_MOUGHATAA].includes(
              type
            ) && (
              <Grid item xs={12} md={4}>
                {renderSelect('zoneSanitaire', 'Zone Sanitaire', zoneSanitaires, errors.zoneSanitaire)}
              </Grid>
            )}

            {[reportsTypesEnum.CONSOLIDE_MENSUELLE_PRESTATAIRES, reportsTypesEnum.BONUS_QUALITE].includes(type) && (
              <Grid item xs={12} md={4}>
                {renderSelect(
                  'entity',
                  'Entity',
                  entities?.map(entity => ({ value: entity.id, label: entity.name })) || [],
                  errors.entity
                )}
              </Grid>
            )}

            <Grid item xs={12} md={4}>
              {renderSelect('year', 'Year', yearOptions, errors.year)}
            </Grid>

            {type !== reportsTypesEnum.BONUS_QUALITE && (
              <Grid item xs={12} md={4}>
                {renderSelect('month', 'Month', monthOptions, errors.month)}
              </Grid>
            )}

            {type === reportsTypesEnum.BONUS_QUALITE && (
              <Grid item xs={12} md={4}>
                {renderSelect('trim', 'trimestre', trimOptions, errors.trim)}
              </Grid>
            )}
          </Grid>
        </CardContent>
      </form>
    </Card>
  )
}

export default FormFacture
