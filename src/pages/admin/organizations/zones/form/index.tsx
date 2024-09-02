'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/@core/components/spinner'
import { FormField } from 'src/@core/utils'
import { createZone, fetchOneZone, fetchZonesByLevel, updateZone } from 'src/api/organizations/zones'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import * as yup from 'yup'

import { schema_levels as schema } from 'src/constants/forms/validationSchemas'
import { useTranslation } from 'react-i18next'
import { fileOperations, translateFileOperations } from 'src/@core/components/FileOperations'
import { fetchLevels } from 'src/api/organizations/levels'
import { PERMISSIONS } from 'src/constants'

// const schema = yup.object().shape({
//   name: yup.string().required('Name is required'),
//   title: yup.string().required('Title is required'),
//   // populationCount: yup.string().required('populationCount is required'),
//   // populationYear: yup.string().required('populationYear is required'),
//   openingDate: yup.date().required('openingDate is required')
// })

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }
  const queryClient = useQueryClient()

  const {
    data: zone,
    isLoading,
    error
  } = useQuery({
    queryKey: ['org_zone', mode, id],
    queryFn: () => fetchOneZone(parseInt(id)),
    enabled: !!id
  })

  const { data: levels, isLoading: isLoadingLevels } = useQuery({
    queryKey: ['levels'],
    queryFn: () => fetchLevels({})
  })

  const initialValues = useMemo(() => (mode === 'create' ? {} : zone), [mode, zone])

  // const parentZones = useMemo(() => {
  //   return moughtaas?.map(el => ({
  //     label: el.title,
  //     value: el.id
  //   }))
  // }, [isLoadingMoughtaas, moughtaas])

  const fields: FormField[] = [
    {
      name: 'name',
      type: 'text',
      label: 'Name'
    },
    { name: 'title', label: 'Title', type: 'text' },
    {
      name: 'populationCount',
      type: 'number',
      label: 'Population Count'
    },
    { name: 'populationYear', type: 'number', label: 'Population Year' },
    { name: 'openingDate', type: 'date', label: 'Opening Date' },
    {
      name: 'levelId',
      type: 'select',
      label: 'Niveau parent',
      options: levels?.data?.map(el => ({
        label: el.title,
        value: el.id
      }))
    },
    {
      name: 'parentId',
      type: 'select',
      label: 'Parent',
      options: [],
      syncTo: { field: 'levelId', func: fetchZonesByLevel }
    }
  ]

  const action = useCallback(
    async data => {
      let level
      for (let i = 0; i < levels?.data.length; i++) {
        if (levels.data[i].id === data.levelId) {
          level = levels.data[i + 1]
        }
      }
      data.levelId = level ? level.id : null
      let res
      if (mode === 'create') {
        res = await createZone(data)
      } else {
        res = await updateZone(Number(id), data)
      }

      const msg =
        mode === 'create'
          ? `${t('Zone')} ${t(fileOperations.create.successMessage)}`
          : `${t('Zone')} ${t(fileOperations.modify.successMessage)}`
      if (res.success) {
        toast.success(msg + ' : ' + res.id)
      } else {
        // toast.error('Error')
        let errorMessage
        if (mode === 'create') {
          errorMessage = t(fileOperations.create.errorMessage)
        } else {
          errorMessage = t(fileOperations.modify.errorMessage)
        }
        toast.error(errorMessage)
      }
      queryClient.invalidateQueries({ queryKey: ['zones'] })
      router.push('/admin/organizations/zones')
    },
    [id, levels, mode, queryClient, router, t]
  )

  if ((mode == 'view' || mode === 'edit') && !initialValues) return <FallbackSpinner />
  if (isLoading) return <FallbackSpinner />

  return (
    <div className='section animate-fadeIn'>
      <div>
        <div className='w-full flex flex-col items-stretch gap-8 sm:gap-14 mt-4'>
          <FormRenderer
            readOnly={mode === 'view'}
            fields={fields}
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={action}
            title={mode === 'view' ? t('View zone') : mode === 'edit' ? t('Edit zone') : t('Add zone')}
          />
        </div>
      </div>
    </div>
  )
}
Form.acl = [PERMISSIONS.zone.write, PERMISSIONS.zone.update]
export default Form
