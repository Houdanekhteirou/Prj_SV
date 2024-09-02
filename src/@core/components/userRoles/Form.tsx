import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { FormField, depsToOptions } from 'src/@core/utils'
import { createRoleMember } from 'src/api/access-management/rols/members'
import { fetchRoles } from 'src/api/access-management/rols'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import * as yup from 'yup'

export const FormUserRoles = ({ isOpen, onClose, userId, refetch }) => {
  const { t } = useTranslation() // Use useI18n for translations
  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => fetchRoles({})
  })

  const fields: FormField[] = [
    {
      name: 'roleId',
      label: 'Role',
      type: 'select',
      options: depsToOptions(roles)
    },
    {
      name: 'startedAt',
      type: 'date',
      label: 'Started At'
    },
    {
      name: 'closedAt',
      type: 'date',
      label: 'Closed Date'
    }
  ]

  const schema = yup.object().shape({
    // opening date is required
    roleId: yup.string().required(t('Group') + ' ' + t('is_required')),
    startedAt: yup.date().required(t('Started At') + ' ' + t('is_required')),
    closedAt: yup
      .date()
      .required(t('Closed Date') + ' ' + t('is_required'))
      .when('startedAt', (startedAt, schema) => {
        return schema.min(startedAt, t('Closed Date') + ' ' + t('should_be_after_started_at'))
      })
  })

  const action = useCallback(async values => {
    try {
      const res = await createRoleMember({
        ...values,
        userId: parseInt(userId),
        roleId: parseInt(values.roleId)
      })
      refetch()
      onClose()
      toast.success('Action was successful!')
    } catch (error) {
      toast.error('An error occurred while performing the action.')
    }
  }, [])

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto' style={isOpen ? { display: 'block' } : { display: 'none' }}>
      <div className='flex items-center justify-center min-h-screen'>
        <div className='bg-white rounded-lg sm:max-w-lg sm:w-full'>
          <FormRenderer
            title={
              <div className='flex justify-between items-center'>
                <h3 className='text-xl font-medium text-gray-900'>{t('Add Role')}</h3>
                <button
                  onClick={e => {
                    e.preventDefault()
                    onClose()
                  }}
                  type='button'
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
            readOnly={false}
            fields={fields}
            validationSchema={schema}
            onSubmit={action}
            stopTheGrid={true}
            closeButton={false}
          />
        </div>
      </div>
    </div>
  )
}
