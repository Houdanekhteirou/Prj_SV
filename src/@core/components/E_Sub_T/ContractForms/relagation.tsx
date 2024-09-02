import { Box, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { depsToOptions, getValidContractTypes } from 'src/@core/utils'
import { fetchDemotionContract } from 'src/api/entities/contact'
import { renewMultipleContracts } from 'src/api/entities/contract'
import { authorityEnum, divisionEnum, repoEnum, schema_contract_action, schema_contract_action_1 } from 'src/constants'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import { endDate } from './delocalisation'
import { AlertCompnent } from '../../alert'
import FallbackSpinner from '../../spinner'

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

export const Relegation = ({ id, contractTypes, allBanks }) => {
  const { t } = useTranslation()

  const router = useRouter()

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['contractPromotion', id],
    queryFn: () => fetchDemotionContract(id),
    enabled: !!id
  })

  const [activeStep, setActiveStep] = useState(0)
  const [form1Data, setForm1Data] = useState(null)
  const [form2Data, setForm2Data] = useState(null)

  const [alertMessage1, setAlertMessage1] = useState<any>(null)
  const [alertMessage2, setAlertMessage2] = useState<any>(null)

  const initialFormData = useCallback(
    type => {
      if (!data) return {}

      return {
        startDate: endDate(data[type]?.endDate) || new Date(),
        phoneNumber: data[type]?.contact?.phoneNumber || '',
        contactName: data[type]?.contact?.name || '',
        email: data[type]?.contact?.email || '',
        contracttypeId: data[type]?.contracttypeId,
        bankId: data[type]?.account?.bankId || '',
        accountNumber: data[type]?.account?.number || '',
        signatory: data[type]?.signatory || '',
        signatoryFunction: data[type]?.signatoryFunction || ''
      }
    },
    [data]
  )

  const initialValues1 = useMemo(() => initialFormData('secondary'), [data, initialFormData])

  const generateFields = useCallback(
    () => [
      {
        name: 'contracttypeId',
        type: 'select',
        label: 'contractType',
        options: data
          ? getValidContractTypes(contractTypes, data['secondary']?.entityTypeId, data['secondary']?.entityClassId)
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
      },
      {
        name: 'pricipalContract',
        type: 'select',
        label: 'Nouveau Contrat Principal',
        options: generatePrimariesOptions(data?.primaries),
        groupKey: 1,
        className: 'col-span-2'
      },
      {
        name: 'comment',
        type: 'textarea',
        label: 'comment',
        className: 'col-span-2'
      }
    ],
    [contractTypes, data]
  )

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

        console.log({ selectedContract })

        if (contractType !== formData?.contracttypeId) {
          setAlertMessage2(t('Contract type must be Primary'))

          return
        }

        const form1ContractType = getContractType(contractTypes, authorityEnum.SECONDARY)
        const form2ContractType = getContractType(contractTypes, authorityEnum.PRIMARY)

        await renewMultipleContracts({
          data: [
            {
              formData: form1Data,
              contract: data['secondary'],
              consttractType: form1ContractType
            },
            {
              formData: formData,
              contract: selectedContract,
              consttractType: form2ContractType
            }
          ]
        })

        toast.success(t('Opération avec succès'))
        router.back()
      } catch (error) {
        toast.error(t(error.message))
      }
    },

    [contractTypes, data, form1Data]
  )

  const handleNext = useCallback(
    formData => {
      const contractType = getOtherContractTypeId(
        getValidContractTypes(contractTypes, data['secondary']?.entityTypeId, data['secondary']?.entityClassId),
        data['secondary']?.contracttypeId
      )

      if (contractType !== formData?.contracttypeId) {
        setAlertMessage1(t('Contract type must be Secondary'))

        return
      }

      setForm1Data(formData)

      setActiveStep(prevActiveStep => prevActiveStep + 1)
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
    }, [data, initialFormData])

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
        alertCompnent={() => <AlertCompnent message={alertMessage2} setMessage={setAlertMessage2} />}
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
    if (activeStep === 1) return <RenderSecondForm />

    return (
      <FormRenderer
        key={0}
        readOnly={false}
        fields={fields1}
        validationSchema={schema_contract_action_1}
        initialValues={form1Data || initialValues1}
        onSubmit={handleNext}
        extraFields={extraFields}
        groups={groupFields}
        alertCompnent={() => <AlertCompnent message={alertMessage1} setMessage={setAlertMessage1} />}
        submitButtonText={t('next')}
        title={
          <Box display='flex' alignItems='center' gap={2}>
            <Typography variant='h6' fontWeight='medium'>
              {`${t('Relagation du contrat de')}:`}
            </Typography>
            <Typography variant='body2'>
              {`${data?.secondary?.wilaya} / ${data?.secondary?.moughtaa} / ${data?.secondary?.airsanitaire} / ${data?.secondary?.entity}`}
            </Typography>
          </Box>
        }
      />
    )
  }

  if (isLoading) return <FallbackSpinner />
  if (isError) {
    // toast(t(error.response.data.errorKey))

    return (
      <div className='h-full w-full flex justify-center items-center'>
        <Typography>{t(error?.response?.data?.errorKey)}</Typography>
      </div>
    )
  }

  return renderActiveStep()
}
