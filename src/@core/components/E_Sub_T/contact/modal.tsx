import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { FormField, depsToOptions } from 'src/@core/utils'
import { createContact } from 'src/api/entities/contact'
import * as yup from 'yup'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import { fetchContracts } from 'src/api/entities/contract'
import { useQuery } from '@tanstack/react-query'

export const ContactForm = ({ isOpen, onClose, entityId, refetch }) => {
  const { t } = useTranslation()

  const { data } = useQuery({
    queryKey: ['entityContracts'],
    queryFn: () => fetchContracts({ id: entityId })
  })

  const fields: FormField[] = [
    {
      name: 'name',
      type: 'text',
      label: 'name'
    },
    {
      name: 'phoneNumber',
      type: 'number',
      label: 'Phone Number'
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email'
    },
    {
      name: 'contractId',
      type: 'select',
      label: 'Contract',
      options: depsToOptions(data)
    },
    {
      name: 'openingDate',
      type: 'date',
      label: 'startDate'
    },
    {
      name: 'closedDate',
      type: 'date',
      label: 'endDate'
    }
  ]
  const schema = yup.object().shape({
    name: yup.string().required(t('name') + ' ' + t('is_required')), // Use translated message
    phoneNumber: yup.string().required(t('Phone Number') + ' ' + t('is_required')),
    email: yup.string().required(t('Email') + ' ' + t('is_required')),
    openingDate: yup.string().required(t('Opening Date') + ' ' + t('is_required')),
    closedDate: yup.string().required(t('Closed Date') + ' ' + t('is_required'))
  })

  const action = useCallback(
    async data => {
      data.entityId = entityId
      const res = await createContact(data)
      const msg = t('created successfully')
      if (res.success) {
        toast.success(msg + ' ' + res.id)
        refetch()
      } else {
        toast.error(t('Error'))
      }
      onClose()
    },
    [entityId]
  )

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto' style={isOpen ? { display: 'block' } : { display: 'none' }}>
      <div className='flex items-center justify-center min-h-screen'>
        <div className='fixed inset-0 bg-slate-50 bg-opacity-20 transition-opacity'></div>
        <div className='transform transition-all sm:max-w-lg sm:w-full'>
          <div className='p-6 space-y-6'>
            <div className=''>
              <FormRenderer
                readOnly={false}
                fields={fields}
                validationSchema={schema}
                initialValues={{}}
                onSubmit={action}
                stopTheGrid={true}
                closeButton={false}
                title={
                  <div className='flex items-center gap-2'>
                    <span>{t('Add Contact to this Element')}</span>
                    <button
                      onClick={e => {
                        e.preventDefault()
                        onClose()
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
