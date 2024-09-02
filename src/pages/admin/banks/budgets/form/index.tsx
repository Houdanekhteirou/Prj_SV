'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter as userRouters } from 'next/navigation'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import FallbackSpinner from 'src/@core/components/spinner'
import { createBudget, fetchOneBudget, updateBudget } from 'src/api/budgets/budget'

import { Button, CardActions, TextField } from '@mui/material'
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
import { fetchZonesByUser } from 'src/api/organizations/zones'
import { getZonesOptions, years } from 'src/@core/utils'
import { fetchEntitiesByZoneId } from 'src/api/entities'
import { FileOperation, fileOperations, translateFileOperations } from 'src/@core/components/FileOperations'

import { PERMISSIONS } from 'src/constants'

interface FormInputs {
  wilaya: string
  moughataa: string
  zoneSanitaire: string
  entity: string
  year: string
  amount: string
}
const Form = () => {
  const router = useRouter()
  const route = userRouters()

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormInputs>()

  const zoneSanitaire = watch('zoneSanitaire')
  const entity = watch('entity')
  const wilayaa = watch('wilaya')
  const moughataa = watch('moughataa')
  const year = watch('year')
  const amount = watch('amount')

  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }

  const queryClient = useQueryClient()

  const {
    data: budget,
    isLoading,
    error
  } = useQuery({
    queryKey: ['budget', mode, id],
    queryFn: () => fetchOneBudget(parseInt(id)),
    enabled: !!id
  })

  // Zone query
  const { data: zonesByUser } = useQuery({
    queryKey: ['zonesByUser'],
    queryFn: () => fetchZonesByUser()
  })

  // Derived state from zonesByUser
  const { wilayas, moughataas, zoneSanitaires } = useMemo(() => {
    return getZonesOptions(wilayaa, moughataa, zonesByUser)
  }, [zonesByUser, wilayaa, moughataa])

  // Fetch entities based on zone
  const { data: entities } = useQuery({
    queryKey: ['entities', zoneSanitaire],
    queryFn: () => (zoneSanitaire ? fetchEntitiesByZoneId({ zoneId: +zoneSanitaire }) : null),
    enabled: !!zoneSanitaire
  })

  const defaultValues: FormInputs = useMemo(() => {
    if (mode === 'create') {
      return {}
    } else {
      return {
        amount: budget?.amount
      }
    }
  }, [budget, mode])
  const yearOptions = useMemo(() => years.map(year => ({ value: year, label: year })), [])

  const action = useCallback(
    async data => {
      let res
      if (mode === 'create') {
        res = await createBudget(data)
      } else {
        res = await updateBudget(Number(id), data)
      }

      const msg =
        mode === 'create'
          ? `${t('budget')} ${t(fileOperations.create.successMessage)}`
          : `${t('budget')} ${t(fileOperations.modify.successMessage)}`

      if (res) {
        toast.success(msg + ' ' + res.id)
        queryClient.invalidateQueries({ queryKey: ['budgets'] })
        route.back()
      } else {
        let errorMessage
        if (mode === 'create') {
          errorMessage = t(fileOperations.create.errorMessage)
        } else {
          errorMessage = t(fileOperations.modify.errorMessage)
        }
        toast.error(errorMessage)
      }
    },
    [id, mode, t]
  )

  if ((mode == 'view' || mode === 'edit') && !defaultValues) return <FallbackSpinner />

  return (
    <Card>
      <SectionTitle title={t('Add budget')} />
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
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel
                  id='validation-basic-select'
                  error={Boolean(errors.amount)}
                  htmlFor='validation-basic-select'
                >
                  {t('Amount')}
                </InputLabel>
                <Controller
                  name='amount'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='number'
                      fullWidth
                      value={value}
                      id='amount'
                      label='Amount'
                      onChange={onChange}
                      inputProps={{ placeholder: 'Amount' }}
                      error={Boolean(errors.amount)}
                    />
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

Form.acl = [PERMISSIONS.budget.write, PERMISSIONS.budget.update]
export default Form
