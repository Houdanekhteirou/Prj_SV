'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Icon } from '@iconify/react'
import { Card, CardActions, CardContent, CardHeader, Divider, MenuItem, Select } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { fetchRoles } from 'src/api/access-management/rols'
import { fetchPbfReportType } from 'src/api/reports/types'
import * as yup from 'yup'
import { updatePbfReportType } from 'src/api/reports/types'
import toast from 'react-hot-toast'
import { fileOperations } from 'src/@core/components/FileOperations'
import FallbackSpinner from 'src/@core/components/spinner'

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  signatories: yup.array().of(
    yup.object().shape({
      name: yup.string()
    })
  )
})

const ReportTypeForm = () => {
  const { t } = useTranslation()
  const router = useRouter()
  let { mode, id } = router.query
  if (!mode || !['view', 'edit'].includes(mode)) {
    mode = 'view'
  }

  const { data: reportType, isLoading: isLoadingReportType } = useQuery({
    queryKey: ['reports', 'pbf-report-types', id],
    queryFn: () => fetchPbfReportType(id),
    enabled: !!id
  })

  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles', 'pbf-roles'],
    queryFn: fetchRoles
  })

  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      signatories: [{ name: '', roleId: '' }]
    },
    resolver: yupResolver(validationSchema)
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'signatories'
  })

  useEffect(() => {
    if (reportType) {
      setValue('name', reportType.name)
      setValue('description', reportType.description)
      setValue('signatories', reportType.signatories || [{ name: '', roleId: '' }])
    }
  }, [reportType, setValue])

  const onSubmit = async data => {
    data.signatories = data.signatories.filter(signatory => signatory.name !== '')
    data.signatories = data.signatories.map((signatory, idx) => ({
      ...signatory,
      roleId: signatory.roleId ? Number(signatory.roleId) : null,
      code: `sig__${reportType.uid}__${idx}`
    }))

    try {
      const response = await updatePbfReportType(id, data)
      if (response) {
        toast.success(`${t(fileOperations.operation)}`)
        router.back()
      }
    } catch (error) {
      toast.error(`${t('error')}`)
    }
  }

  if (isLoadingReportType || isLoadingRoles) {
    return <FallbackSpinner />
  }

  const isDisabled = mode === 'view'

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader title={`${t('Modification')} de Type de rapport`} />
        <Divider sx={{ m: '0 !important' }} />

        <CardContent className={'w-full'}>
          <div className='w-full flex flex-col items-stretch gap-3 sm:gap-3 mt-4'>
            <div>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='outlined'
                    fullWidth
                    label={t('Name')}
                    disabled={isDisabled}
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='outlined'
                    fullWidth
                    label={t('Description')}
                    disabled={isDisabled}
                    error={!!errors.description}
                    helperText={errors.description ? errors.description.message : ''}
                  />
                )}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label>{t('Signatories')}</label>
              {fields.map((item, index) => (
                <Box key={item.id} display='flex' alignItems='center' gap={2} mb={2}>
                  <Controller
                    name={`signatories[${index}].name`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant='outlined'
                        fullWidth
                        label={t('Name')}
                        disabled={isDisabled}
                        error={!!errors.signatories?.[index]?.name}
                        helperText={errors.signatories?.[index]?.name ? errors.signatories[index].name.message : ''}
                      />
                    )}
                  />
                  <Controller
                    name={`signatories[${index}].roleId`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        variant='outlined'
                        fullWidth
                        label={t('Job Title')}
                        disabled={isDisabled}
                        error={!!errors.signatories?.[index]?.roleId}
                        helperText={errors.signatories?.[index]?.roleId ? errors.signatories[index].roleId.message : ''}
                      >
                        {roles.map(role => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {!isDisabled && (
                    <IconButton onClick={() => remove(index)}>
                      <Icon icon='mdi:delete' width={24} height={24} />
                    </IconButton>
                  )}
                </Box>
              ))}
              {!isDisabled && (
                <div className='self-end'>
                  <IconButton onClick={() => append({ name: '', roleId: '' })}>
                    <Icon icon='mdi:plus' width={24} height={24} />
                  </IconButton>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <Divider sx={{ m: '0 !important' }} />
        <CardActions>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'end', marginTop: '10px', width: '100%' }}>
            <Button size='medium' variant='outlined' onClick={() => router.push('/reports')}>
              {t('Cancel')}
            </Button>
            {mode === 'edit' && (
              <Button size='medium' variant='contained' type='submit'>
                {t('Submit')}
              </Button>
            )}
          </Box>
        </CardActions>
      </form>
    </Card>
  )
}

// ReportTypeForm.acl = [PERMISSIONS.reportType.write, PERMISSIONS.reportType.update]
export default ReportTypeForm
