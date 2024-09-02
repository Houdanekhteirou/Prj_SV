import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FormField } from 'src/@core/utils'
import { createContract } from 'src/api/entities/contract'
import { fetchContractTypes } from 'src/api/entities/contractType'
import * as yup from 'yup'
import FormRenderer from '../../../views/components/forms/FormRenderer'
import { useQuery } from '@tanstack/react-query'

export const ContractModal = ({ isOpen, onClose, entityId }) => {
  const { t } = useTranslation()

  const { data: contractTypes, isLoading: isLoadingContractTypes } = useQuery({
    queryKey: ['contractTypes'],
    queryFn: fetchContractTypes
  })
  const theContractTypes = useMemo(() => {
    return contractTypes?.map(el => ({
      label: el.title,
      value: el.id
    }))
  }, [contractTypes])

  const fields: FormField[] = [
    {
      name: 'number',
      label: 'number',
      type: 'number'
    },
    {
      name: 'contracttype',
      label: 'Contract Type',
      type: 'select',
      options: theContractTypes
    },
    { name: 'startDate', label: 'startDate', type: 'date' },
    { name: 'endDate', label: 'endDate', type: 'date' }
  ]

  const schema = yup.object().shape({
    number: yup.string().required(t('Number') + ' ' + t('is_required')), // Use translated message
    contracttypeId: yup.string().required(t('Contract Type') + ' ' + t('is_required')),
    startDate: yup.string().required(t('startDate') + ' ' + t('is_required')),
    endDate: yup.string().required(t('endDate') + ' ' + t('is_required'))
  })

  const action = useCallback(
    async data => {
      data.entityId = entityId
      let res = await createContract(data)
      const msg = t('Contract created successfully')
      if (res.success) {
        toast.success(msg + ' ' + res.id)
      } else {
        toast.error(t('Error'))
      }
      onClose()
    },
    [entityId]
  )
  // if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto' style={isOpen ? { display: 'block' } : { display: 'none' }}>
      <div className='flex items-center justify-center min-h-screen'>
        <div className='bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full'>
          <div className='bg-white '>
            <div className='flex justify-between items-center p-2 border-b border-primary-700'>
              <h3 className='text-xl font-medium text-gray-900'>{t('Add File Type to this indicator')}</h3>
              <button
                onClick={onClose}
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
            <FormRenderer
              readOnly={false}
              fields={fields}
              validationSchema={schema}
              initialValues={{}}
              onSubmit={action}
              stopTheGrid={true}
              closeButton={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
