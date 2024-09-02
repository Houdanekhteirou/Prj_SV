'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useEffect } from 'react'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/@core/components/spinner'
import { FormField } from 'src/@core/utils'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import * as yup from 'yup'

import { useTranslation } from 'react-i18next'
import { createPopulation, fetchOnePopulation, updatePopulation } from 'src/api/populations/population'
import { FileOperation, fileOperations, translateFileOperations } from 'src/@core/components/FileOperations'

const schema = yup.object().shape({
  name: yup.string().required(),
  percentage: yup.number().required()
})

export default function Zone() {
  const router = useRouter()
  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }
  const queryClient = useQueryClient()

  const {
    data: population,
    isLoading,
    error
  } = useQuery({
    queryKey: ['population', mode, id],
    queryFn: () => fetchOnePopulation(parseInt(id)),
    enabled: !!id
  })

  const initialValues = useMemo(() => (mode === 'create' ? {} : population), [mode, population])

  const fields: FormField[] = [
    {
      name: 'name',
      type: 'text',
      label: 'Name'
    },
    {
      name: 'percentage',
      type: 'text',
      label: 'percentage'
    }
  ]

  const action = useCallback(
    async data => {
      let res
      if (mode === 'create') {
        res = await createPopulation(data)
      } else {
        res = await updatePopulation(Number(id), data)
      }

      const msg =
        mode === 'create'
          ? ` ${t(fileOperations.create.successMessage)}`
          : ` ${t(fileOperations.modify.successMessage)}`
      if (res.success) {
        toast.success(msg + ' : ' + res.id)
      } else {
        let errorMessage
        if (mode === 'create') {
          errorMessage = t(fileOperations.create.errorMessage)
        } else {
          errorMessage = t(fileOperations.modify.errorMessage)
        }
        toast.error(errorMessage)
      }
      queryClient.invalidateQueries({ queryKey: ['zones'] })
      router.back()
    },
    [id, mode, queryClient, router, t]
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
            title={
              mode === 'view'
                ? t('View target-population')
                : mode === 'edit'
                ? t('Edit target-population')
                : t('Add target-population')
            }
          />
        </div>
      </div>
    </div>
  )
}
