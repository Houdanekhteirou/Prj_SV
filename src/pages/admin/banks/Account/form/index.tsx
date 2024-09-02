'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/@core/components/spinner'
import { depsToOptions, FormField } from 'src/@core/utils'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import * as yup from 'yup'
import { fetchAccounts2, fetchOneAccounts, updateAccounts, createAccount } from 'src/api/banks/account'
import { schema_account as schema } from 'src/constants/forms/validationSchemas'
import { useTranslation } from 'react-i18next'
import { fileOperations, translateFileOperations } from 'src/@core/components/FileOperations'
import { PERMISSIONS } from 'src/constants'
import { fetchBanks } from 'src/api/banks/bank'

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }
  const queryClient = useQueryClient()

  const {
    data: account,
    isLoading,
    error
  } = useQuery({
    queryKey: ['account', mode, id],
    queryFn: () => fetchOneAccounts(parseInt(id)),
    enabled: !!id
  })

  const { data: allBanks } = useQuery({
    queryKey: ['banks'],
    queryFn: () => fetchBanks({ all: true })
  })

  const initialValues = useMemo(() => (mode === 'create' ? {} : account), [mode, account])

  const fields: FormField[] = [
    {
      name: 'entity',
      type: 'entitySelector',
      label: 'Entity',
      className: 'col-span-full'
    },
    {
      name: 'number',
      type: 'number',
      label: 'Number'
    },
    {
      name: 'bankId',
      type: 'select',
      label: 'Bank',
      options: depsToOptions(allBanks?.data)
    }
  ]

  const action = useCallback(
    async data => {
      let res
      if (mode === 'create') {
        res = await createAccount(data)
      } else {
        res = await updateAccounts(Number(id), data)
      }

      const msg =
        mode === 'create'
          ? `${t('Account')} ${t(fileOperations.create.successMessage)}`
          : `${t('Account')} ${t(fileOperations.modify.successMessage)}`
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
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      router.push('/admin/banks/Account')
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
            title={mode === 'view' ? t('View Account') : mode === 'edit' ? t('Edit Account') : t('Add Account')}
          />
        </div>
      </div>
    </div>
  )
}
export default Form
