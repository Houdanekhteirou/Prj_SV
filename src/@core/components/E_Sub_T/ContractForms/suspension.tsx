import { Box, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { depsToOptions, getValidContractTypes } from 'src/@core/utils'
import { fetchDemotionContract } from 'src/api/entities/contact'
import { suspendContract } from 'src/api/entities/contract'
import {
  authorityEnum,
  divisionEnum,
  repoEnum,
  schema_contract_suspension as schema,
  schema_contract_action
} from 'src/constants'
import FormRenderer from 'src/views/components/forms/FormRenderer'

const groupFields = [
  { id: 1, name: 'Information Contractuelle' },
  { id: 5, name: "Zone d'utilisation" },
  { id: 2, name: 'Compte bancaire' },
  { id: 3, name: 'Signateur' },
  { id: 4, name: 'Contact' }
]

const generatePrimariesOptions = primaries =>
  primaries?.map(primary => ({
    value: primary.id,
    label: `${primary.entity}`
  })) || []

const getOtherContractTypeId = (contractTypes, currentId) => contractTypes.find(type => type.value !== currentId)?.value

const getContractType = (contractTypes, authority) =>
  contractTypes.find(type => type.authority === authority && type.division === divisionEnum.HEALTH_AREA)

export const Suspension = ({ id, contractTypes, allBanks, contract, operation }) => {
  const { t } = useTranslation()

  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['contractPromotion', id],
    queryFn: () => fetchDemotionContract(id),
    enabled: !!id && contract.authority === authorityEnum.PRIMARY
  })

  const [activeStep, setActiveStep] = useState(0)
  const [form1Data, setForm1Data] = useState(null)
  const [form2Data, setForm2Data] = useState(null)

  const generateFields = useCallback(() => {
    const fields = [
      {
        name: 'startDate',
        type: 'date',
        label: 'startDate',
        className: 'col-span-2'
      },
      {
        name: 'endDate',
        type: 'date',
        label: 'endDate',
        className: 'col-span-2'
      },
      {
        name: 'reason',
        type: 'textarea',
        label: 'Raison',
        className: 'col-span-2'
      }
    ]

    if (contract.authority === authorityEnum.PRIMARY && data?.primaries) {
      fields.push({
        name: 'pricipalContract',
        type: 'select',
        label: 'Contrat Principal',
        options: generatePrimariesOptions(data['primaries']),
        className: 'col-span-2'
      })
    }

    return fields
  }, [contractTypes, data])

  const fields1 = useMemo(() => generateFields(), [generateFields])

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

  const action = useCallback(
    async formData => {
      try {
        const selectedContract = data['primaries'].find(primary => primary.id === form1Data?.pricipalContract)
        const contractType = getOtherContractTypeId(
          getValidContractTypes(contractTypes, selectedContract?.entityTypeId, selectedContract?.entityClassId),
          selectedContract?.contracttypeId
        )

        if (contractType !== formData?.contracttypeId) {
          alert(t('Contract type must be Primary'))

          return
        }
        const con = getContractType(contractTypes, authorityEnum.PRIMARY)

        const res = await suspendContract({
          suspension: {
            id: contract.id,
            action: operation === 'suspension' ? 'suspend' : 'resolve',
            ...formData
          },
          replacement: {
            formData: formData,
            contractType: con,
            contract: selectedContract
          },
          isPrimary: true
        })

        toast.success(t('Opération avec succès'))
        router.push('/admin/organizations/contracts/')
      } catch (error) {
        toast.error(t(error.message))
      }
    },

    [contractTypes, data, form1Data]
  )

  const handleNext = useCallback(
    async formData => {
      setForm1Data(formData)

      setActiveStep(prevActiveStep => prevActiveStep + 1)
      if (contract.authority === authorityEnum.SECONDARY) {
        try {
          const res = await suspendContract({
            suspension: {
              id: contract.id,
              action: operation === 'suspension' ? 'suspend' : 'resolve',
              comment: formData.comment
            },
            replacement: null,
            isPrimary: false
          })

          toast.success(t('Opération avec succès'))
          // router.push('/admin/organizations/contracts/')
        } catch (error) {
          toast.error(t(error.message))
        }
      }
    },
    [contractTypes, data]
  )

  const RenderSecondForm = () => {
    const selectedContract = data['primaries'].find(primary => primary.id === form1Data?.pricipalContract)

    const fields2 = [
      {
        name: 'contracttypeId',
        type: 'select',
        label: 'contractType',
        options: data
          ? getValidContractTypes(contractTypes, selectedContract?.entityTypeId, selectedContract?.entityClassId)
          : [],
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
        name: 'resourceId',
        type: 'FileBrowser',
        accept: 'application/pdf',
        label: 'Fichier de contrat',
        className: 'col-span-full',
        repoTitle: repoEnum.CONTRACTS,
        groupKey: 1
      }
    ]

    const initialValues2 = useMemo(() => {
      console.log({ selectedContract })
      if (!selectedContract) return {}

      return {
        startDate: new Date(selectedContract?.endDate) || new Date(),
        phoneNumber: selectedContract?.contact?.phoneNumber || '',
        contactName: selectedContract?.contact?.name || '',
        email: selectedContract?.contact?.email || '',
        contracttypeId: selectedContract?.contracttypeId,
        bankId: selectedContract?.account?.bankId || '',
        accountNumber: selectedContract?.account?.number || '',
        signatory: selectedContract?.signatory || '',
        signatoryFunction: selectedContract?.signatoryFunction || ''
      }
    }, [data])

    const handleBack = formData => {
      setForm2Data(formData)
      setActiveStep(prevActiveStep => prevActiveStep - 1)
    }

    return (
      <FormRenderer
        readOnly={false}
        fields={fields2}
        validationSchema={schema_contract_action}
        initialValues={form2Data || initialValues2}
        onSubmit={action}
        extraFields={extraFields}
        backButton={handleBack}
        groups={groupFields}
        title={
          <Box display='flex' alignItems='center' gap={2}>
            <Typography variant='h6' fontWeight='medium'>
              {`${t('Promotion du contrat de')}:`}
            </Typography>
            <Typography variant='body2'>
              {`${selectedContract?.wilaya} / ${selectedContract?.moughtaa} / ${selectedContract?.airsanitaire} / ${selectedContract?.entity}`}
            </Typography>
          </Box>
        }
      />
    )
  }

  const renderActiveStep = () => {
    if (activeStep === 1 && contract.authority === authorityEnum.PRIMARY) return <RenderSecondForm />

    return (
      <FormRenderer
        key={0}
        readOnly={false}
        fields={fields1}
        validationSchema={schema}
        initialValues={form1Data}
        onSubmit={handleNext}
        submitButtonText={contract.authority === authorityEnum.PRIMARY ? t('next') : t('submit')}
        title={
          <Box display='flex' alignItems='center' gap={2}>
            <Typography variant='h6' fontWeight='medium'>
              {t(`${operation} du contrat de`)}
            </Typography>
            <Typography variant='body2'>
              {`${contract?.wilaya} / ${contract?.moughtaa} / ${contract?.airsanitaire} / ${contract?.entity}`}
            </Typography>
          </Box>
        }
      />
    )
  }

  if (isLoading) return <div>Loading...</div>

  return renderActiveStep()
}
