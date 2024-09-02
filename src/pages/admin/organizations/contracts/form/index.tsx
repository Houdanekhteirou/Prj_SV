'use client'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { endDate } from 'src/@core/components/E_Sub_T/ContractForms'
import FallbackSpinner from 'src/@core/components/spinner'
import { FormField, depsToOptions } from 'src/@core/utils'
import { fetchBanks } from 'src/api/banks/bank'
import { createContractObject, fetchOneContract, updateContract } from 'src/api/entities/contract'
import { fetchContractTypes } from 'src/api/entities/contractType'
import { PERMISSIONS } from 'src/constants'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import { schema_contract_action_2 as schema } from 'src/constants'

const groupFields = [
  { id: 1, name: 'Information Contractuelle' },
  { id: 5, name: "Zone d'utilisation" },
  { id: 2, name: 'Compte bancaire' },
  { id: 3, name: 'Signateur' },
  { id: 4, name: 'Contact' }
]

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }

  const { data: contractTypes } = useQuery({
    queryKey: ['contractTypes'],
    queryFn: fetchContractTypes
  })

  const { data: allBanks } = useQuery({
    queryKey: ['banks'],
    queryFn: () => fetchBanks({ all: true })
  })

  const {
    data: contract,
    isLoading,
    error
  } = useQuery({
    queryKey: ['orgcklkontract', mode, id],
    queryFn: () => fetchOneContract(parseInt(id)),
    enabled: !!id
  })

  const fields: FormField[] = useMemo(
    () => [
      {
        name: 'contracttypeId',
        type: 'select',
        label: 'contractType',
        options: contractTypes ? contractTypes?.map(el => ({ value: el.id, label: el.title })) : [],
        groupKey: 1,
        className: 'col-span-2',
        readOnly: true
      },
      {
        name: 'number',
        type: 'text',
        label: 'Numéro',
        groupKey: 1,
        className: 'col-span-2',
        readOnly: true
      },
      {
        name: 'startDate',
        type: 'date',
        label: 'startDate',
        groupKey: 1,
        className: 'col-span-2'
      },
      {
        name: 'endDate',
        type: 'date',
        label: 'endDate',
        groupKey: 1,
        className: 'col-span-2',
        readOnly: true
      },
      {
        name: 'resourceId',
        type: 'file',
        label: 'Fichier de contrat',
        className: 'col-span-full',
        groupKey: 1,
        fileType: 'file'
      }
    ],
    [contractTypes]
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
    { name: 'accountNumber', type: 'text', label: 'Numero compte', groupKey: 2, className: 'col-span-2' },
    { name: 'accountName', type: 'text', label: 'name', groupKey: 2, className: 'col-span-full' },
    { name: 'signatory', type: 'text', label: 'Nom Signature', groupKey: 3, className: 'col-span-2' },
    { name: 'signatoryFunction', type: 'text', label: 'fonction Signature', groupKey: 3, className: 'col-span-2' },
    { name: 'contactName', type: 'text', label: 'Nom', groupKey: 4, className: 'col-span-2' },
    { name: 'phoneNumber', type: 'number', label: 'Phone Number', groupKey: 4, className: 'col-span-2' },
    { name: 'email', type: 'email', label: 'Email', groupKey: 4, className: 'col-span-2' }
  ]

  const initialValues = useMemo(() => {
    if (!contract) return {}

    return {
      startDate: new Date(contract?.startDate),
      endDate: new Date(contract?.endDate),
      phoneNumber: contract?.contact?.phoneNumber || '',
      contactName: contract?.contact?.name || '',
      email: contract?.contact?.email || '',
      contracttypeId: contract?.contracttypeId,
      bankId: contract?.account?.bankId || '',
      accountNumber: contract?.account?.number || '',
      accountName: contract?.account?.name || '',
      number: contract?.number || '',
      signatory: contract?.signatory || '',
      signatoryFunction: contract?.signatoryFunction || '',
      resourceId: contract?.resourceId
    }
  }, [contract])

  const action = useCallback(
    async data => {
      try {
        const consttractType = contractTypes?.find(el => el.id == data.contracttypeId)
        let newContract

        if (!consttractType) return toast.error(t('Error'))

        const res = await createContractObject({ formData: data, contract, consttractType })

        if (res.success) {
          newContract = await updateContract(id, res.data)
        }

        if (newContract.success) {
          toast.success(t('Opération avec succès'))
          router.push('/admin/organizations/contracts')
        }
      } catch (error) {
        return toast.error(t('Error'))
      }
    },
    [contract, contractTypes]
  )

  if (((mode == 'view' || mode === 'edit') && !initialValues) || isLoading) return <FallbackSpinner />

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
            extraFields={extraFields}
            groups={groupFields}
            title={
              mode === 'view'
                ? t('Voir le contrat')
                : mode === 'edit'
                ? t('Modifier le contrat')
                : t('Ajouter un contrat')
            }
          />
        </div>
      </div>
    </div>
  )
}
Form.acl = [PERMISSIONS.entityClass.write, PERMISSIONS.entityClass.update]
export default Form
