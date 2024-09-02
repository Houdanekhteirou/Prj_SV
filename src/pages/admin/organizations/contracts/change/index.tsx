'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import FallbackSpinner from 'src/@core/components/spinner'

import { useTranslation } from 'react-i18next'
import {
  Avenant,
  Delocalisation,
  Promotion,
  Relegation,
  Renouvelment,
  Suspension
} from 'src/@core/components/E_Sub_T/ContractForms'
import { fetchBanks } from 'src/api/banks/bank'
import { fetchOneContract } from 'src/api/entities/contract'
import { fetchContractTypes } from 'src/api/entities/contractType'
import { PERMISSIONS } from 'src/constants'

const Types = {
  renouvellement: Renouvelment,
  promotion: Promotion,
  relegation: Relegation,
  resiliation: Suspension,
  suspension: Suspension,
  avenant: Avenant,
  delocalisation: Delocalisation
}

const Change = () => {
  const router = useRouter()
  const { t } = useTranslation()

  let { mode, id } = router.query
  if (
    !mode ||
    !['renouvellement', 'avenant', 'delocalisation', 'promotion', 'resiliation', 'suspension', 'relegation'].includes(
      mode
    )
  ) {
    mode = 'renouvellement'
  }
  const queryClient = useQueryClient()

  const { data: contractTypes, isLoading: isLoadingContracTypes } = useQuery({
    queryKey: ['contractTypes'],
    queryFn: fetchContractTypes
  })

  const {
    data: contract,
    isLoading,
    error
  } = useQuery({
    queryKey: ['orgcklkontract', mode, id],
    queryFn: () => fetchOneContract(id),
    enabled: !!id
  })

  const { data: allBanks } = useQuery({
    queryKey: ['banks'],
    queryFn: () => fetchBanks({ all: true })
  })

  if (isLoading || isLoadingContracTypes || !contract || !contractTypes) return <FallbackSpinner />

  const render = () => {
    if (!contract) return null
    const ModalComponent = Types[mode]

    return (
      <ModalComponent contract={contract} contractTypes={contractTypes} allBanks={allBanks} id={id} operation={mode} />
    )
  }

  return (
    <div className='section animate-fadeIn'>
      <div>{render()}</div>
    </div>
  )
}
Change.acl = [PERMISSIONS.entityClass.write, PERMISSIONS.entityClass.update]
export default Change
