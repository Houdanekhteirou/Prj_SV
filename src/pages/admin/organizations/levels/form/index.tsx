'use client'
import React, { useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createLevel, fetchOneLevel, updateLevel } from '/src/api/organizations/levels'
import FallbackSpinner from 'src/@core/components/spinner'
import SectionTitle from 'src/@core/components/SectionTItle'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import { FormField } from 'src/@core/utils'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { schema_levels as schema } from 'src/constants/forms/validationSchemas'
import { PERMISSIONS } from 'src/constants'
import { FileOperation, fileOperations, translateFileOperations } from 'src/@core/components/FileOperations'

// import Pagination from "@/components/Pagination";

const Form = () => {
  // Use useI18n for translations
  const router = useRouter()
  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }

  const fields: FormField[] = [
    {
      name: 'name',
      type: 'text',
      label: 'Name'
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title'
    }

    // {
    //   name: "level",
    //   type: "number",
    //   label: "Level",
    // },
  ]
  const queryClient = useQueryClient()

  const {
    data: level,
    isLoading,
    error
  } = useQuery({
    queryKey: ['org_level'],
    queryFn: () => fetchOneLevel(parseInt(id)),
    enabled: !!id
  })

  const initialValues = useMemo(() => (mode === 'create' ? {} : level), [mode, level])

  const action = useCallback(
    async data => {
      const serializedData = { ...data, level: parseInt(data.level) }
      let res
      if (mode === 'create') {
        res = await createLevel(serializedData)
      } else {
        res = await updateLevel(Number(id), serializedData)
      }

      const msg =
        mode === 'create'
          ? ` ${t(fileOperations.create.successMessage)}`
          : ` ${t(fileOperations.modify.successMessage)}`
      if (res) {
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
      queryClient.invalidateQueries({ queryKey: ['levels'] })

      // back()
      router.push('/admin/organizations/levels')
    },
    [id]
  )

  // if (isLoading) return <Loading />;

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
            title={mode === 'view' ? t('viewTitle') : mode === 'edit' ? t('editTitle') : t('addTitle')}
          />
        </div>
      </div>
    </div>
  )
}
Form.acl = [PERMISSIONS.zone.write, PERMISSIONS.zone.update]
export default Form
