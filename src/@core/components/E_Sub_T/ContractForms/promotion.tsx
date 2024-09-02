import { Box, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { depsToOptions, getValidContractTypes } from 'src/@core/utils'
import { fetchPromotionContract } from 'src/api/entities/contact'
import FormRenderer from 'src/views/components/forms/FormRenderer'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { renewMultipleContracts } from 'src/api/entities/contract'
import { authorityEnum, divisionEnum, schema_contract_action } from 'src/constants'
import { AlertCompnent } from '../../alert'
import FallbackSpinner from '../../spinner'
import { endDate } from './delocalisation'

const groupFields = [
  { id: 1, name: 'Information Contractuelle' },
  { id: 5, name: "Zone d'utilisation" },
  { id: 2, name: 'Compte bancaire' },
  { id: 3, name: 'Signateur' },
  { id: 4, name: 'Contact' }
]

const getOtherContractTypeId = (contractTypes, currentId) => {
  return contractTypes.find(type => type.value !== currentId)?.value
}

const getContractType = (contractTypes, authority) =>
  contractTypes.find(type => type.authority === authority && type.division === divisionEnum.HEALTH_AREA)

export const Promotion = ({ id, contractTypes, allBanks }) => {
  const { t } = useTranslation()
  const [alertMessage, setAlertMessage] = useState<any>(null)

  const router = useRouter()

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['contractPromotion', id],
    queryFn: () => fetchPromotionContract(id),
    enabled: !!id
  })
  const [activeStep, setActiveStep] = useState(0)

  const initialFormData = type => {
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
  }

  const [form1Data, setForm1Data] = useState(null)
  const [form2Data, setForm2Data] = useState(null)

  const initialValues1 = useMemo(() => initialFormData('primary'), [data, contractTypes])
  const initialValues2 = useMemo(() => initialFormData('secondary'), [data, contractTypes])

  const generateFields = type => [
    {
      name: 'contracttypeId',
      type: 'select',
      label: 'contractType',
      options: data ? getValidContractTypes(contractTypes, data[type]?.entityTypeId, data[type]?.entityClassId) : [],
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
      name: 'comment',
      type: 'textarea',
      label: 'comment',
      className: 'col-span-2'
    }
  ]

  const fields1 = useMemo(() => generateFields('primary'), [contractTypes, data, generateFields])
  const fields2 = useMemo(() => generateFields('secondary'), [contractTypes, data, generateFields])

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
        const contractType = getOtherContractTypeId(
          getValidContractTypes(contractTypes, data['secondary']?.entityTypeId, data['secondary']?.entityClassId),
          data['secondary']?.contracttypeId
        )

        if (contractType !== formData?.contracttypeId) return setAlertMessage(t('Contract type must be Secondary'))

        const form1ContractType = getContractType(contractTypes, authorityEnum.PRIMARY)
        const form2ContractType = getContractType(contractTypes, authorityEnum.SECONDARY)

        await renewMultipleContracts({
          data: [
            {
              formData: form1Data,
              contract: data['primary'],
              consttractType: form1ContractType
            },
            {
              formData: formData,
              contract: data['secondary'],
              consttractType: form2ContractType
            }
          ]
        })

        toast.success(t('Opération avec succès'))
        router.push('/admin/organizations/contracts/')
      } catch (error) {
        toast.error(t(error.message))
      }
    },

    [form1Data, contractTypes, data]
  )
  const handleNext = useCallback(
    async formData => {
      setForm1Data(formData)
      const contractType = getOtherContractTypeId(
        getValidContractTypes(contractTypes, data['primary']?.entityTypeId, data['primary']?.entityClassId),
        data['primary']?.contracttypeId
      )

      if (contractType !== formData?.contracttypeId) return setAlertMessage(t('Contract type must be Primary'))

      setActiveStep(prevActiveStep => prevActiveStep + 1)
    },
    [contractTypes, data]
  )

  const hadleBack = data => {
    setForm2Data(data)
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const renderActiveStep = () => {
    const stepComponents = [
      {
        key: 0,
        data: form1Data || initialValues1,
        fields: fields1,
        title: `${t('Promotion du contrat de')}:`,
        location: `${data?.primary?.wilaya} / ${data?.primary?.moughtaa} / ${data?.primary?.airsanitaire} / ${data?.primary?.entity}`,
        action: handleNext,
        saveButtonText: t('next')
        // setFormData: setForm1Data
      },
      {
        key: 1,
        data: form2Data || initialValues2,
        fields: fields2,
        title: `${t('Relegation du contrat de')}:`,
        location: `${data?.secondary?.wilaya} / ${data?.secondary?.moughtaa} / ${data?.secondary?.airsanitaire} / ${data?.secondary?.entity}`,
        action: action,
        saveButtonText: undefined,
        // setFormData: ,
        backButton: hadleBack
      }
    ]

    const currentStep = stepComponents[activeStep]

    if (!data['primary'] || !data['secondary']) return <div>Cette promotion n'est pas possible</div>

    return (
      <FormRenderer
        key={currentStep.key}
        readOnly={false}
        fields={currentStep.fields}
        validationSchema={schema_contract_action}
        initialValues={currentStep.data}
        onSubmit={currentStep.action}
        submitButtonText={currentStep.saveButtonText}
        extraFields={extraFields}
        groups={groupFields}
        backButton={currentStep.backButton}
        setFormData={currentStep.setFormData}
        alertCompnent={() => <AlertCompnent message={alertMessage} setMessage={setAlertMessage} />}
        title={
          <div className='flex items-center'>
            <Box display='flex' alignItems='center' gap={2}>
              <Typography variant='h6' fontWeight='medium'>
                {currentStep.title}
              </Typography>
              <Typography variant='body2'>{currentStep.location}</Typography>
            </Box>
          </div>
        }
      />
    )
  }

  if (isLoading) return <FallbackSpinner />
  if (isError || !data) {
    // toast(t(error.response.data.errorKey))

    return (
      <div className='h-full w-full flex justify-center items-center'>
        <Typography>{t(error?.response?.data?.errorKey)}</Typography>
      </div>
    )
  }

  return renderActiveStep()
}
