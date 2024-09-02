'use client'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import FallbackSpinner from 'src/@core/components/spinner'
import { FormField } from 'src/@core/utils'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import * as yup from 'yup'

import { schema_group as Schema } from 'src/constants/forms/validationSchemas'
import { fileOperations } from 'src/@core/components/FileOperations'
import { createGroupe, fetchOneGroupe, updateGroupe } from 'src/api/access-management/groups'
import { PERMISSIONS } from 'src/constants'

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }

  const {
    data: group,
    isLoading,
    error
  } = useQuery({
    queryKey: ['org_user', mode, id],
    queryFn: () => fetchOneGroupe(parseInt(id)),
    enabled: !!id
  })

  const initialValues = useMemo(() => (mode === 'create' ? {} : group), [mode, group])
  const fields: FormField[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text'
    }
  ]

  const action = useCallback(
    async (data: any) => {
      let res
      if (mode === 'create') {
        res = await createGroupe(data)
      } else if (mode === 'edit') {
        res = await updateGroupe(Number(id), data)
      }

      const msg =
        mode === 'create'
          ? ` ${t(fileOperations.create.successMessage)}`
          : ` ${t(fileOperations.modify.successMessage)}`
      if (res) {
        toast.success(msg)
        router.push('/admin/access-management/groups')
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
    [id]
  )

  if ((mode == 'view' || mode === 'edit' || mode === 'editpassword') && !initialValues) return <FallbackSpinner />

  return (
    <div className='section animate-fadeIn'>
      <div>
        <div className='w-full flex flex-col items-stretch gap-8 sm:gap-14 mt-4'>
          <FormRenderer
            readOnly={mode === 'view'}
            fields={fields}
            validationSchema={Schema}
            initialValues={initialValues}
            onSubmit={action}
            title={
              mode === 'view'
                ? t('View user')
                : mode === 'edit'
                ? t('Edit user')
                : mode === 'editpassword'
                ? t('Edit password')
                : t('Add user')
            }
          />
        </div>
      </div>
    </div>
  )
}
Form.acl = [PERMISSIONS.Gestion_acces.write, PERMISSIONS.Gestion_acces.update]
export default Form
