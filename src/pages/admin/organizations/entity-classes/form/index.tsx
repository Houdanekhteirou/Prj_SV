'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useEffect } from 'react'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/@core/components/spinner'
import { FormField } from 'src/@core/utils'
import { createEntityClasse, fetchOneEntityClasse, updateEntityClasse } from 'src/api/entities/entityclasse'
import FormRenderer from 'src/views/components/forms/FormRenderer'

import { PERMISSIONS } from 'src/constants'
import { schema_entity_class as schema } from 'src/constants/forms/validationSchemas'

// import Pagination from "@/components/Pagination";
// import { useI18n } from "@/locales/client";
import { useTranslation } from 'react-i18next'
import { fileOperations } from 'src/@core/components/FileOperations'

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }
  const queryClient = useQueryClient()

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
    }
  ]

  const {
    data: entityClasse,
    isLoading,
    error
  } = useQuery({
    queryKey: ['org_entityclasse', mode, id],
    queryFn: () => fetchOneEntityClasse(parseInt(id)),
    enabled: !!id
  })

  const initialValues = useMemo(() => (mode === 'create' ? {} : entityClasse), [mode, entityClasse])

  const action = useCallback(
    async data => {
      let res
      if (mode === 'create') {
        res = await createEntityClasse(data)
      } else {
        res = await updateEntityClasse(Number(id), data)
      }

      const msg =
        mode === 'create' ? ` ${t(fileOperations.create.successMessage)}` : `${t(fileOperations.modify.successMessage)}`
      if (res) {
        toast.success(msg)
      } else {
        let errorMessage
        if (mode === 'create') {
          errorMessage = t(fileOperations.create.errorMessage)
        } else {
          errorMessage = t(fileOperations.modify.errorMessage)
        }
        toast.error(errorMessage)
      }
      queryClient.invalidateQueries({ queryKey: ['entityclasses'] })
      router.push('/admin/organizations/entity-classes/')
    },
    [id]
  )

  if ((mode == 'view' || mode === 'edit') && !initialValues) return <FallbackSpinner />

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
                ? t('view Entity Classes')
                : mode === 'edit'
                ? t('Edit Entity Classes')
                : t('Add Entity Classes')
            }
          />
        </div>
      </div>
    </div>
  )
}
Form.acl = [PERMISSIONS.entityClass.write, PERMISSIONS.entityClass.update]
export default Form
