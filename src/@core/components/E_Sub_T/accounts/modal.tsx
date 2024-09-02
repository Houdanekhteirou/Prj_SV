import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { FormField, depsToOptions } from 'src/@core/utils'
import { createEntityAccount, fetchBanks, updateEntityAccount } from 'src/api/banks/bank'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import * as yup from 'yup'
import { fileOperations } from '../../FileOperations'

export const AccountForm = ({
  isOpen,
  onClose,
  entityId,
  refetch,
  mode,
  selected = null,
  setSelected,
  isThereAnyAccount
}) => {
  const { t } = useTranslation()

  const { data } = useQuery({
    queryKey: ['banks'],
    queryFn: () => fetchBanks({ all: true, list: false })
  })

  const fields: FormField[] = [
    {
      name: 'number',
      type: 'number',
      label: 'numero'
    },
    {
      name: 'bankId',
      type: 'select',
      label: 'bank',
      options: depsToOptions(data?.data)
    },
    {
      name: 'openingDate',
      type: 'date',
      label: 'startDate'
    }
  ]

  const initialValues = useMemo(() => {
    if (selected)
      return {
        number: parseInt(selected?.number) || '',
        bankId: selected?.bankId || '',
        openingDate: new Date(selected?.openingDate) || ''
      }

    return {}
  }, [selected])
  const schema = yup.object().shape({
    number: yup.string().required(t('is_required')), // Use translated message
    bankId: yup.string().required(t('is_required'))
  })

  const action = useCallback(
    async data => {
      if (!entityId) return
      data.entityId = +entityId
      data.bankId = +data.bankId
      if (!data.openingDate) data.openingDate = new Date()

      let res
      if (mode === 'edit' && selected?.id) {
        res = await updateEntityAccount(selected.id, {
          ...data,
          active: selected?.active
        })
      } else {
        if (isThereAnyAccount === false) {
          data.active = true
        }

        res = await createEntityAccount(data)
      }
      const msg = t(fileOperations.operations)
      if (res.success) {
        toast.success(msg + ' ' + res.id)
        refetch()
      } else {
        toast.error(t('Error'))
      }
      onClose()
    },
    [entityId, onClose, t]
  )

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto ' style={isOpen ? { display: 'block' } : { display: 'none' }}>
      <div className='flex items-center justify-center min-h-screen'>
        <div className='fixed inset-0 bg-slate-400 bg-opacity-40  transition-opacity'></div>
        <div className='transform transition-all sm:max-w-lg sm:w-full'>
          <div className='p-6 space-y-6'>
            <div className=''>
              <FormRenderer
                readOnly={false}
                fields={fields}
                validationSchema={schema}
                initialValues={initialValues}
                onSubmit={action}
                stopTheGrid={true}
                closeButton={false}
                title={
                  <div className='flex items-center gap-2'>
                    <span>{mode === 'edit' ? t('Edit') : t('Add')}</span>
                    <button
                      onClick={e => {
                        e.preventDefault()
                        onClose()
                        setSelected(null)
                      }}
                      className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
                    >
                      <svg
                        className='w-5 h-5'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        aria-hidden='true'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm4.293-11.707a1 1 0 010 1.414L11.414 10l2.879 2.879a1 1 0 11-1.414 1.414L10 11.414l-2.879 2.879a1 1 0 11-1.414-1.414L8.586 10 5.707 7.121a1 1 0 111.414-1.414L10 8.586l2.879-2.879a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </button>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
