'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter as userRouters } from 'next/navigation'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import FallbackSpinner from 'src/@core/components/spinner'
import { createPlanification, fetchOnePlanification, updatePlanification } from 'src/api/planifications/planification'

import { Button, CardActions } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { Controller, useForm } from 'react-hook-form'
import SectionTitle from 'src/@core/components/SectionTItle'
import { getZonesOptions, years } from 'src/@core/utils'
import { fetchEntitiesByZoneId } from 'src/api/entities'
import { fetchZonesByUser } from 'src/api/organizations/zones'
import { FileOperation, fileOperations } from 'src/@core/components/FileOperations'
import { PERMISSIONS } from 'src/constants'

interface FormInputs {
  wilaya: any
  moughataa: any
  zoneSanitaire: any
  entityId: any
  year: any
  quarter: any
}
const Form = () => {
  const router = useRouter()
  const route = userRouters()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>()

  const zoneSanitaire = watch('zoneSanitaire')
  const wilayaa = watch('wilaya')
  const moughataa = watch('moughataa')

  const { t } = useTranslation() // Use useI18n for translations
  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }

  const queryClient = useQueryClient()

  const {
    data: planification,
    isLoading,
    error
  } = useQuery({
    queryKey: ['planification', mode, id],
    queryFn: () => fetchOnePlanification(parseInt(id)),
    enabled: !!id && mode !== 'create'
  })

  // Zone query
  const { data: zonesByUser } = useQuery({
    queryKey: ['zonesByUser'],
    queryFn: () => fetchZonesByUser()
  })

  const { wilayas, moughataas, zoneSanitaires } = useMemo(() => {
    return getZonesOptions(wilayaa, moughataa, zonesByUser)
  }, [zonesByUser, wilayaa, moughataa])

  const { data: entities } = useQuery({
    queryKey: ['entities', zoneSanitaire],
    queryFn: () => (zoneSanitaire ? fetchEntitiesByZoneId({ zoneId: +zoneSanitaire }) : null),
    enabled: !!zoneSanitaire
  })

  const yearOptions = useMemo(() => years.map(year => ({ value: year, label: year })), [])

  const action = useCallback(
    async data => {
      let res
      if (mode === 'create') {
        res = await createPlanification(data)
      } else {
        res = await updatePlanification(Number(id), data)
      }

      const msg = mode === 'create' ? t(fileOperations.create.successMessage) : t(fileOperations.modify.successMessage)

      if (res) {
        toast.success(msg + ' ' + res.id)
        queryClient.invalidateQueries({ queryKey: ['planifications'] })
        route.back()
      } else {
        toast.error('Error')
      }
    },
    [id, mode, t]
  )

  if (isLoading) return <FallbackSpinner />

  return (
    <Card>
      <SectionTitle title={t('Planification')} />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit(action)}>
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
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel
                  id='validation-basic-select'
                  error={Boolean(errors.entityId)}
                  htmlFor='validation-basic-select'
                >
                  {t('Entity')}
                </InputLabel>
                <Controller
                  name='entityId'
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
                      error={Boolean(errors.entityId)}
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

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel
                  id='validation-basic-select'
                  error={Boolean(errors.quarter)}
                  htmlFor='validation-basic-select'
                >
                  {t('Quarter')}
                </InputLabel>
                <Controller
                  name='quarter'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      fullWidth
                      value={value}
                      id='select-quarter'
                      label='Select Quarter'
                      labelId='quarter-select'
                      onChange={onChange}
                      inputProps={{ placeholder: 'Select Quarter' }}
                      error={Boolean(errors.quarter)}
                    >
                      <MenuItem value={1}>{t('Q1')}</MenuItem>
                      <MenuItem value={2}>{t('Q2')}</MenuItem>
                      <MenuItem value={3}>{t('Q3')}</MenuItem>
                      <MenuItem value={4}>{t('Q4')}</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
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
          </Grid>
        </CardContent>
        <Divider sx={{ m: '0 !important' }} />
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
            {t('add')}
          </Button>
          <Button
            type='reset'
            size='large'
            color='secondary'
            variant='outlined'
            onClick={() => {
              router.push('/admin/data/data-entry')
            }}
          >
            {t('Cancel')}
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}
Form.acl = [PERMISSIONS.entity.write]
export default Form
