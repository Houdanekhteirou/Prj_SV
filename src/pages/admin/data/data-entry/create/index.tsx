// ** React Imports
import { useMemo, useState } from 'react'

// ** Next Imports

import { useQuery } from '@tanstack/react-query'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import { Button, CardActions } from '@mui/material'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { fileOperations } from 'src/@core/components/FileOperations'
import SectionTitle from 'src/@core/components/SectionTItle'
import FallbackSpinner from 'src/@core/components/spinner'
import { getZonesOptions, mapMonthsToTrimesters, years } from 'src/@core/utils'
import { createFile } from 'src/api/data/file'
import { fetchFileTypesByEntityType } from 'src/api/data/filetype'
import { fetchOneFrequency } from 'src/api/data/frequency'
import { fetchEntitiesFilter } from 'src/api/entities'
import { fetchEntityClasses } from 'src/api/entities/entityclasse'
import { fetchZonesByUser } from 'src/api/organizations/zones'

interface FormInputs {
  entityClass: string
  wilaya: string
  moughataa: string
  zoneSanitaire: string
  entity: string
  month: string
  year: string
  fileType: string
}

const DataList = () => {
  const router = useRouter()
  const routerParams = router.query
  const defaultValues: FormInputs = {
    entityClass: routerParams.entityClass as string,
    wilaya: routerParams.wilaya as string,
    moughataa: routerParams.moughataa as string,
    zoneSanitaire: routerParams.zoneSanitaire as string,
    entity: routerParams.entity as string,
    month: routerParams.month as string,
    year: routerParams.year as string,
    fileType: routerParams.fileType as string
  }
  const {
    control,
    handleSubmit,
    watch,
    reset,

    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Watchers for dynamic queries
  const entityClass = watch('entityClass')
  const zoneSanitaire = watch('zoneSanitaire')
  const entity = watch('entity')
  const fileType = watch('fileType')
  const wilayaa = watch('wilaya')
  const moughataa = watch('moughataa')
  const month = watch('month')
  const year = watch('year')
  const { t } = useTranslation()

  const { data: entityClasses } = useQuery({
    queryKey: ['entityClasses'],
    queryFn: () => fetchEntityClasses({})
  })

  // Zone query
  const { data: zonesByUser } = useQuery({
    queryKey: ['zonesByUser', entityClass],
    queryFn: () => fetchZonesByUser(),
    enabled: !!entityClass
  })

  // Derived state from zonesByUser
  const { wilayas, moughataas, zoneSanitaires } = useMemo(() => {
    return getZonesOptions(wilayaa, moughataa, zonesByUser)
  }, [zonesByUser, wilayaa, moughataa, defaultValues.wilaya, defaultValues.moughataa])

  // Fetch entities based on zone
  const { data: entities } = useQuery({
    queryKey: ['entities', zoneSanitaire],
    queryFn: () =>
      zoneSanitaire
        ? fetchEntitiesFilter({
            'zoneId.equals': zoneSanitaire,
            'entityclassId.equals': entityClass
          })
        : null,

    enabled: !!zoneSanitaire
  })

  // Fetch file types based on entity
  const { data: filetypes } = useQuery({
    queryKey: ['filetypes', entity],
    queryFn: () =>
      entity
        ? fetchFileTypesByEntityType({
            entityTypeId: entities?.find(el => el.id == entity)?.entitytypid
          })
        : null,
    enabled: !!entity
  })

  // Fetch frequency based on file type
  const { data: frequency } = useQuery({
    queryKey: ['frequency', fileType],
    queryFn: () => {
      if (!fileType) return
      const id = filetypes?.data.find(el => el.id === +fileType)?.frequencyId

      return fetchOneFrequency(id as number)
    },
    enabled: !!fileType
  })

  // Compute month and year options
  const monthOptions = useMemo(() => {
    if (!frequency) return []
    const periods = JSON.parse(frequency?.months)

    return mapMonthsToTrimesters(periods)
  }, [frequency])

  const yearOptions = useMemo(() => years.map(year => ({ value: year, label: year })), [])

  // Submission handling
  const submit = async (data: FormInputs) => {
    // if (!isFileDateValid(month, frequency?.id === 1 ? 'quantitative' : 'qualitative')) {
    //   toast.error(t('dateOfDateEntryHasExpiredAskTheAdminToExtendItForYou'))

    //   return
    // }

    setIsSubmitting(true)
    try {
      const res = await createFile({
        day: 1,
        month: month,
        year: year,
        filetypeId: fileType,
        entityId: entity,
        updateFlag: 0,
        totalValue: 0.0,
        source: 'WEB'
      })
      toast.success(`${t('file')} ${t(fileOperations.create.successMessage)}`)
      router.push(`/admin/data/data-entry/edit/${res.id}`)
    } catch (error) {
      toast.error(t(error.response.data.errorKey ? error.response.data.errorKey : 'error'))
    }
    setIsSubmitting(false)
  }

  // Snackbar close handler
  if (isSubmitting) {
    return <FallbackSpinner />
  }

  return (
    <Card>
      <SectionTitle title='nouveauFichier' />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit(submit)}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel
                  id='validation-basic-select'
                  error={Boolean(errors.entityClass)}
                  htmlFor='validation-basic-select'
                >
                  {t('entityClasse')}
                </InputLabel>
                <Controller
                  name='entityClass'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      fullWidth
                      value={value}
                      id='select-entityClass'
                      label='Select EntityClass'
                      labelId='entityClass-select'
                      onChange={onChange}
                      inputProps={{ placeholder: 'Select EntityClass' }}
                      error={Boolean(errors.entityClass)}
                    >
                      {entityClasses?.data.map(entityClass => (
                        <MenuItem key={entityClass.id} value={entityClass.id}>
                          {entityClass.name}
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
                <InputLabel
                  id='validation-basic-select'
                  error={Boolean(errors.fileType)}
                  htmlFor='validation-basic-select'
                >
                  {t('fileType')}
                </InputLabel>

                <Controller
                  name='fileType'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      fullWidth
                      value={value}
                      id='select-fileType'
                      label='Select FileType'
                      labelId='fileType-select'
                      onChange={onChange}
                      inputProps={{ placeholder: 'Select FileType' }}
                      error={Boolean(errors.fileType)}
                    >
                      {filetypes?.data.map(fileType => (
                        <MenuItem key={fileType.id} value={fileType.id}>
                          {fileType.title}
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

export default DataList
