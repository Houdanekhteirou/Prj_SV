'use client'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { fileOperations } from 'src/@core/components/FileOperations'
import { FormField } from 'src/@core/utils'
import { createRole } from 'src/api/access-management/rols'
import { PERMISSIONS } from 'src/constants'
import FormRenderer from 'src/views/components/forms/FormRenderer'

import { schema_role as Schema } from 'src/constants/forms/validationSchemas'

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation()

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

  const action = useCallback(async (data: any) => {
    const res = await createRole(data)

    const msg = t(fileOperations.create.successMessage)
    if (res) {
      toast.success(t(msg))
      router.push('/admin/access-management/roles')
    } else {
      const errorMessage = t(fileOperations.create.errorMessage)

      toast.error(errorMessage)
    }
  }, [])

  return (
    <div className='w-full flex flex-col items-stretch gap-8 sm:gap-14 mt-4'>
      <FormRenderer fields={fields} validationSchema={Schema} onSubmit={action} title={t('Add Role')} />
    </div>
  )
}
Form.acl = [PERMISSIONS.Gestion_acces.write, PERMISSIONS.Gestion_acces.update]
export default Form
