'use client'
import React, { useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createBank, fetchBanksByParentId, fetchOneBank, updateBank } from 'src/api/banks/bank'
import FallbackSpinner from 'src/@core/components/spinner'
import { FormField, depsToOptions } from 'src/@core/utils'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import * as yup from 'yup'
import toast from 'react-hot-toast'

import { useTranslation } from 'react-i18next'
import { useRouter as userRouters } from 'next/navigation'

import { schema_bank as schema } from 'src/constants/forms/validationSchemas'
import { PERMISSIONS } from 'src/constants'
import { FileOperation, fileOperations, translateFileOperations } from 'src/@core/components/FileOperations'

const Form = () => {
  const router = useRouter()
  const route = userRouters()

  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }
  const queryClient = useQueryClient()

  const {
    data: bank,
    isLoading,
    error
  } = useQuery({
    queryKey: ['bank', mode, id],
    queryFn: () => fetchOneBank(parseInt(id)),
    enabled: !!id
  })
  const { data: banks, isLoading: isLoadingBanks } = useQuery({
    queryKey: ['banks'],
    queryFn: fetchBanksByParentId
  })

  const initialValues = useMemo(() => (mode === 'create' ? {} : bank), [mode, bank])

  const parentBank = useMemo(() => {
    return banks?.map(el => ({
      label: el.name,
      value: el.id
    }))
  }, [isLoadingBanks, banks])

  const fields: FormField[] = [
    {
      name: 'name',
      type: 'textarea',
      label: 'Name'
    },
    {
      name: 'title',
      type: 'textarea',
      label: 'Title'
    },

    // { name: "openingDate", type: "datetime", label: "Opening ate") },
    {
      name: 'parentId',
      type: 'select',
      label: 'Parent',
      options: parentBank
    }
  ]

  const action = useCallback(
    async data => {
      let res
      if (mode === 'create') {
        res = await createBank(data)
      } else {
        res = await updateBank(Number(id), data)
      }

      const msg =
        mode === 'create'
          ? `${t('bank')} ${t(fileOperations.create.successMessage)}`
          : `${t('bank')} ${t(fileOperations.modify.successMessage)}`

      if (res) {
        toast.success(msg + ' ' + res.id)
        queryClient.invalidateQueries({ queryKey: ['banks'] })
        route.back()
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
    [id, mode, t]
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
                ? t('bank_details') // Use translated message
                : mode === 'edit'
                ? 'Edit bank' // Use translated message
                : 'Add bank' // Use translated message
            }
          />
        </div>
      </div>
    </div>
  )
}

Form.acl = [PERMISSIONS.bank.write, PERMISSIONS.bank.update]
export default Form
