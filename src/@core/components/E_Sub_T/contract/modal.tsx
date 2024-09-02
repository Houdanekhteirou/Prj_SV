import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { FormField, FormFieldGroup, depsToOptions, getValidContractTypes } from 'src/@core/utils'
import { renewContract } from 'src/api/entities/contract'
import { divisionOptions } from 'src/constants'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import * as yup from 'yup'

export const ContratForm = ({ isOpen, onClose, contract, contractTypes, allBanks, refetch }) => {
  const { t } = useTranslation()

  const groupFields: FormFieldGroup[] = [
    { id: 1, name: 'Information Contractuelle' },
    { id: 5, name: "Zone d'utilisation" },
    { id: 2, name: 'Compte bancaire' },
    { id: 3, name: 'Signateur' },
    { id: 4, name: 'Contact' }
  ]

  const fields: FormField[] = useMemo(
    () => [
      {
        name: 'contracttypeId',
        type: 'select',
        label: 'contractType',
        options: getValidContractTypes(contractTypes, contract?.entityTypeId, contract?.entityClassId),
        groupKey: 1,
        className: 'col-span-2'
      },
      {
        name: 'startDate',
        type: 'date',
        label: 'startDate',
        groupKey: 1,
        className: 'col-span-2'
      },

      {
        name: 'resourceFile',
        type: 'file',
        label: 'Fichier de contrat',
        fileType: 'file',
        className: 'col-span-full',
        groupKey: 1
      },
      {
        name: 'zoneId',
        type: 'contractZones',
        label: 'contractZones',
        groupKey: 5,
        className: 'col-span-full',
        data: contractTypes
      }
    ],

    [contractTypes, contract?.entityTypeId, contract?.entityClassId]
  )
  const extraFields: FormField[] = [
    {
      name: 'bankId',
      type: 'select',
      label: 'Agence Bancaire',
      options: depsToOptions(allBanks?.data),
      groupKey: 2,
      className: 'col-span-2'
    },
    {
      name: 'accountNumber',
      type: 'text',
      label: 'Numero compte',
      groupKey: 2,
      className: 'col-span-2'
    },
    // {
    //   name: 'contactName',
    //   type: 'text',
    //   label: 'name',
    //   groupKey: 4,
    //   className: 'col-span-full'
    // },
    {
      name: 'signatory',
      type: 'text',
      label: 'Nom Signature',
      groupKey: 3,
      className: 'col-span-2'
    },
    {
      name: 'signatoryFunction',
      type: 'text',
      label: 'fonction Signature',
      groupKey: 3,
      className: 'col-span-2'
    },
    {
      name: 'contactName',
      type: 'text',
      label: 'Nom',
      groupKey: 4,
      className: 'col-span-2'
    },
    {
      name: 'phoneNumber',
      type: 'number',
      label: 'Phone Number',
      groupKey: 4,
      className: 'col-span-2'
    },
    // {
    //   name: 'phoneNumber',
    //   type: 'number',
    //   label: 'Phone Number',
    //   groupKey: 4,
    //   className: 'col-span-full'
    // }
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      groupKey: 4,
      className: 'col-span-full'
    }
  ]

  const schema = yup.object().shape({
    startDate: yup.date().required(),
    contracttypeId: yup.number().required(),
    accountNumber: yup.string().required()
  })

  const initialValues = useMemo(() => {
    return {
      // startDate: new Date(contract?.endDate) || new Date(),
      startDate: contract?.startDate || new Date(),
      phoneNumber: contract?.contact?.phoneNumber || '',
      contactName: contract?.contact?.name || '',
      email: contract?.contact?.email || '',
      contracttypeId: contract?.contracttypeId || '',
      bankId: contract?.account?.bankId || '',
      accountNumber: contract?.account?.number || '',
      signatory: contract?.signatory || '',
      signatoryFunction: contract?.signatoryFunction || '',
      zoneId: contract?.zoneId || ''
    }
  }, [contract])

  const action = useCallback(
    async data => {
      try {
        const consttractType = contractTypes?.find(el => el.id == data.contracttypeId)

        if (!consttractType) return toast.error(t('Error'))

        const res = await renewContract({ formData: data, contract, consttractType })
        if (res.success) {
          toast.success(t('Opération avec succès'))
          onClose()
          refetch()
        }
      } catch (error) {
        return toast.error(t('Error'))
      }
    },
    [contract, contractTypes, refetch]
  )

  const keyValuePairs = [
    {
      label: t('entity'),
      value:
        (
          <>
            <span>{contract?.wilaya}</span> / <span>{contract?.moughtaa}</span> / <span>{contract?.airsanitaire}</span>{' '}
            / <span>{contract?.entity}</span>
          </>
        ) || 'N/A'
    }
  ]

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen bg-slate-400 bg-opacity-60  transition-opacity'>
        <div
          style={{
            width: '90%'
          }}
        >
          <FormRenderer
            readOnly={false}
            fields={fields}
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={action}
            // stopTheGrid={true}
            closeButton={false}
            extraFields={extraFields}
            groups={groupFields}
            keyValuePairs={keyValuePairs}
            title={
              <div className='flex items-center '>
                <span>
                  {t('Renouvelment du contrat de')} {contract?.entity}
                </span>
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
  )
}
