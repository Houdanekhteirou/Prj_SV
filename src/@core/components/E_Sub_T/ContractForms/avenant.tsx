import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { depsToOptions, getValidContractTypes } from 'src/@core/utils'
import { renewContract } from 'src/api/entities/contract'
import { repoEnum, schema_contract_action } from 'src/constants'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import { endDate } from './delocalisation'

const groupFields = [
  { id: 1, name: 'Information Contractuelle' },
  { id: 5, name: "Zone d'utilisation" },
  { id: 2, name: 'Compte bancaire' },
  { id: 3, name: 'Signateur' },
  { id: 4, name: 'Contact' }
]

export const Avenant = ({ id, contractTypes, allBanks, contract, operation }) => {
  const { t } = useTranslation()

  const router = useRouter()

  const fields = useMemo(
    () => [
      {
        name: 'contracttypeId',
        type: 'select',
        label: 'contractType',
        options: contract ? getValidContractTypes(contractTypes, contract?.entityTypeId, contract?.entityClassId) : [],
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
        name: 'resourceId',
        type: 'FileBrowser',
        accept: 'application/pdf',
        label: 'Fichier de contrat',
        className: 'col-span-full',
        repoTitle: repoEnum.CONTRACTS,
        groupKey: 1
      }
    ],
    [contractTypes, contract]
  )

  const extraFields = [
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
    { name: 'email', type: 'email', label: 'Email', groupKey: 4, className: 'col-span-full' }
  ]

  const initialValues = useMemo(() => {
    if (!contract) return {}

    return {
      startDate: endDate(contract?.endDate) || new Date(),
      phoneNumber: contract?.contact?.phoneNumber || '',
      contactName: contract?.contact?.name || '',
      email: contract?.contact?.email || '',
      contracttypeId: contract?.contracttypeId,
      bankId: contract?.account?.bankId || '',
      accountNumber: contract?.account?.number || '',
      signatory: contract?.signatory || '',
      signatoryFunction: contract?.signatoryFunction || ''
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
          router.back()
        }
      } catch (error) {
        return toast.error(t('Error'))
      }
    },
    [contract, contractTypes]
  )

  if (!contract) return <div>Loading...</div>

  return (
    <div>
      <FormRenderer
        readOnly={false}
        fields={fields}
        validationSchema={schema_contract_action}
        initialValues={initialValues}
        onSubmit={action}
        extraFields={extraFields}
        groups={groupFields}
        title={
          <Box display='flex' alignItems='center' gap={2}>
            <Typography variant='h6' fontWeight='medium'>
              {`${t('Subtitution du contrat de')}:`}
            </Typography>
            <Typography variant='body2'>
              {`${contract?.wilaya} / ${contract?.moughtaa} / ${contract?.airsanitaire} / ${contract?.entity}`}
            </Typography>
          </Box>
        }
      />
    </div>
  )
}
