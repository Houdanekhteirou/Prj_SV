'use client'
import React, { useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import FallbackSpinner from 'src/@core/components/spinner'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import { FormField } from 'src/@core/utils'
import toast from 'react-hot-toast'

import { createElementGroups, fetchOneElementGroups, updateElementGroups } from 'src/api/element-groups/element-groups'
import { useTranslation } from 'react-i18next'
import { FileOperation, fileOperations } from 'src/@core/components/FileOperations'

import { PERMISSIONS } from 'src/constants'
import { schema_element as schema } from 'src/constants/forms/validationSchemas'

const fields: FormField[] = [
  {
    name: 'title',
    type: 'text',
    label: 'title'
  },

  {
    name: 'sortOrder',
    type: 'number',
    label: 'ordre de tri'
  },
  {
    name: 'featured',
    type: 'checkbox',
    label: 'publié'
  },
  {
    name: 'realtimeResult',
    type: 'checkbox',
    label: 'résultat en temps réel'
  },
  {
    name: 'iconFile',
    type: 'file',
    label: 'iconFile',
    fileType: 'img'
  }
]

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }
  const queryClient = useQueryClient()

  const {
    data: elementgroup,
    isLoading,
    error
  } = useQuery({
    queryKey: ['elementgroup', mode, id],
    queryFn: () => fetchOneElementGroups(parseInt(id)),
    enabled: !!id
  })

  const initialValues = useMemo(() => (mode === 'create' ? {} : elementgroup), [mode, elementgroup])

  const action = useCallback(
    async data => {
      data.featured = data.featured ? 1 : 0
      data.realtimeResult = data.realtimeResult ? 1 : 0

      let res
      if (mode === 'create') {
        res = await createElementGroups(data)
      } else {
        res = await updateElementGroups(Number(id), data)
      }

      // const msg = mode === 'create' ? t('created successfully') : t('updated successfully')
      const msg =
        mode === 'create'
          ? ` ${t(fileOperations.create.successMessage)}`
          : ` ${t(fileOperations.modify.successMessage)}`

      if (res.success) {
        toast.success(msg)

        queryClient.invalidateQueries({ queryKey: ['elementgroup'] })
        router.back()
      } else {
        // toast.error(t(fileOperations.create.errorMessage))
        let errorMessage
        if (mode === 'create') {
          errorMessage = t(fileOperations.create.errorMessage)
        } else {
          errorMessage = t(fileOperations.modify.errorMessage)
        }
        toast.error(errorMessage)
      }
    },
    [id, mode, t, queryClient, router]
  )

  if ((mode == 'view' || mode === 'edit') && isLoading) return <FallbackSpinner />

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
                ? t('View element_groups')
                : mode === 'edit'
                ? t('Edit element_groups')
                : t('add element_groups')
            }
          />
        </div>
      </div>
    </div>
  )
}
Form.acl = [PERMISSIONS.element.write, PERMISSIONS.element.update]
export default Form
