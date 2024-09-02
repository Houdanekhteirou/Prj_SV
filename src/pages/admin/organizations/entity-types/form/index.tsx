'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/@core/components/spinner'
import { FormField, depsToOptions } from 'src/@core/utils'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import * as yup from 'yup'

import { useTranslation } from 'react-i18next'
import { fetchEntityClasses } from 'src/api/entities/entityclasse'
import { createEntityType, fetchOneEntityType, updateEntityType } from 'src/api/entities/entitytype'

import { fileOperations, translateFileOperations } from 'src/@core/components/FileOperations'
import { PERMISSIONS } from 'src/constants'

import { schema_entity_type as schema } from 'src/constants/forms/validationSchemas'

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }
  const queryClient = useQueryClient()

  const {
    data: entity,
    isLoading,
    error
  } = useQuery({
    queryKey: ['entity', mode, id],
    queryFn: () => fetchOneEntityType(parseInt(id)),
    enabled: !!id
  })

  const { data: entityClasses } = useQuery({
    queryKey: ['entityclasses'],
    queryFn: () => fetchEntityClasses({})
  })

  const fields: FormField[] = [
    {
      name: 'name',
      type: 'text',
      label: 'Name'
    },
    {
      name: 'shortname',
      type: 'text',
      label: 'shortname'
    },
    {
      name: 'entityclassId',
      type: 'select',
      label: 'EntityClass',
      options: depsToOptions(entityClasses?.data)
    },
    {
      name: 'dhis2Uid',
      type: 'text',
      label: 'dhis2Uid'
    },
    {
      name: 'code',
      type: 'file',
      label: 'iconFile',
      fileType: 'img'
    }
  ]

  const initialValues = useMemo(() => (mode === 'create' ? {} : entity), [mode, entity])

  const action = useCallback(
    async data => {
      let res
      if (mode === 'create') {
        res = await createEntityType(data)
      } else {
        res = await updateEntityType(Number(id), data)
      }

      const msg =
        mode === 'create'
          ? `${t('entityType')} ${t(fileOperations.create.successMessage)}`
          : `${t('entityType')} ${t(fileOperations.modify.successMessage)}`
      if (res.success) {
        toast.success(msg)
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
      queryClient.invalidateQueries({ queryKey: ['entities'] })
      router.push('/admin/organizations/entity-types')
    },
    [id]
  )

  if (((mode == 'view' || mode === 'edit') && !initialValues) || isLoading) return <FallbackSpinner />

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
                ? t('View') + ' ' + t('entityType')
                : mode === 'edit'
                ? t('Edit entityType')
                : t('add entityType')
            }
          />
        </div>
      </div>
    </div>
  )
}
Form.acl = [PERMISSIONS.entityType.write, PERMISSIONS.entityType.update]
export default Form
