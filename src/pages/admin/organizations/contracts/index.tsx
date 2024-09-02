'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, Grid } from '@mui/material'
import toast from 'react-hot-toast'
import { fileOperations } from 'src/@core/components/FileOperations'
import SectionTitle from 'src/@core/components/SectionTItle'
import { getZonesOptions } from 'src/@core/utils'
import { fetchEntitiesByZoneId } from 'src/api/entities'
import { deleteContract, fetchContracts } from 'src/api/entities/contract'
import { fetchContractTypes } from 'src/api/entities/contractType'
import { fetchZonesByUser } from 'src/api/organizations/zones'
import { PERMISSIONS, authorityEnum, col_contract, divisionEnum } from 'src/constants'
import DynamicTable from 'src/views/components/tabs/DynamicTable'

import { depsToOptions } from 'src/@core/utils'

import { useRouter } from 'next/router'
import { fetchEntityTypes } from 'src/api/entities/entitytype'

const isActionAllowed = (action, authority, division, row) => {
  if (division !== divisionEnum.HEALTH_AREA) {
    return false
  }

  switch (action) {
    case 'Promotion':
      return authority === authorityEnum.SECONDARY && row?.nextId === null
    case 'Relegation':
      return authority === authorityEnum.PRIMARY && row?.nextId === null
    case 'Resiliation':
      return row?.nextId === null
    case 'Suspension':
      return row?.nextId === null && new Date(row?.endDate) > new Date()
    case 'Delocalisation':
      return row?.nextId === null
    case 'Substitution':
      return row?.nextId === null && new Date(row?.endDate) > new Date()
    case 'Renewal':
      return row?.nextId === null
    default:
      return false
  }
}

const getStatusBadge = (row, t) => {
  const endDate = new Date(row.endDate)
  const currentDate = new Date()
  const nextId = row.nextId

  if (nextId) {
    return <span className='text-yellow-500'>{t('Historique')}</span>
  }

  if (endDate > currentDate) {
    return <span className='text-green-500'>{t('Valid')}</span>
  }

  return <span className='text-red-500'>{t('Expired')}</span>
}

const statusOptions = [
  {
    value: 'all',
    label: 'All'
  },

  {
    value: 'valid',
    label: 'Valid'
  },
  {
    value: 'expired',
    label: 'Expired'
  },
  {
    value: 'history',
    label: 'Historique'
  }
]

function Contracts() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 })

  const [wilaya, setWilaya] = useState<string | null>(null)
  const [moughataa, setMoughataa] = useState<string | null>(null)
  const [zoneSanitaire, setZoneSanitaire] = useState<string | null>(null)
  const [contractType, setContractType] = useState<string | null>(null)
  const [entity, setEntity] = useState<string | null>(null)
  const [entitytype, setEntitytype] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>('all')

  const { data: zonesByUser } = useQuery({
    queryKey: ['zonesByUser'],
    queryFn: () => fetchZonesByUser()
  })

  const { wilayas, moughataas, zoneSanitaires }: any = useMemo(() => {
    const { wilaya, moughataa } = router.query

    return getZonesOptions(parseInt(wilaya), parseInt(moughataa), zonesByUser)
  }, [router.query, zonesByUser])

  const { data: entitytypes } = useQuery({
    queryKey: ['entitytypes'],
    queryFn: () => fetchEntityTypes({})
  })

  const { data: entities } = useQuery({
    queryKey: ['entities', zoneSanitaire],
    queryFn: () => (zoneSanitaire ? fetchEntitiesByZoneId({ zoneId: +zoneSanitaire, entityclassId: 1 }) : null),
    enabled: !!zoneSanitaire
  })

  const { data: contractTypes } = useQuery({
    queryKey: ['contractTypes'],
    queryFn: fetchContractTypes
  })

  const queryClient = useQueryClient()

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['contracts', pagination, wilaya, moughataa, zoneSanitaire, entity, contractType, entitytype, status],
    queryFn: async () => {
      const res = await fetchContracts({
        ...pagination,
        zoneId: entity ? null : zoneSanitaire ? zoneSanitaire : moughataa ? moughataa : wilaya ? wilaya : null,
        entityId: entity,
        entitytype: entitytype,
        contractType: contractType,
        status: status
      })
      const newData = res?.data.map(el => ({
        ...el,
        status: getStatusBadge(el, t),
        isExpired: new Date(el.endDate) < new Date() || el?.nextId !== null,
        promotionAllowed: isActionAllowed('Promotion', el.authority, el.division, el),
        relegationAllowed: isActionAllowed('Relegation', el.authority, el.division, el),
        resiliationAllowed: isActionAllowed('Resiliation', el.authority, el.division, el),
        suspensionAllowed: isActionAllowed('Suspension', el.authority, el.division, el),
        delocalisationAllowed: isActionAllowed('Delocalisation', el.authority, el.division, el),
        substitutionAllowed: isActionAllowed('Substitution', el.authority, el.division, el),
        renewalAllowed: isActionAllowed('Renewal', el.authority, el.division, el)
      }))

      return { count: res?.count, data: newData }
    }
  })

  const handleDeleteRow = async id => {
    if (!window.confirm(t('forms_delete_confirmation'))) return

    try {
      const res = await deleteContract(id)
      toast.success(fileOperations.delete.successMessage)
      refetch()
    } catch {
      toast.error(fileOperations.delete.errorMessage)
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    }
  }

  return (
    <div className='flex flex-col'>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <SectionTitle title='contracts' total={data?.count} />
            <CardContent>
              <DynamicTable
                columns={col_contract}
                data={data?.data || []}
                isLoading={isLoading || isFetching}
                primaryKey='id'
                filterFields={[
                  {
                    label: 'Entitytype',
                    onChange: e => setEntitytype(e.target.value),
                    value: entitytype,
                    type: 'select',
                    options: depsToOptions(entitytypes?.data),
                    name: 'entitytype'
                  },
                  {
                    label: 'Wilaya',
                    onChange: e => setWilaya(e.target.value),
                    value: wilaya,
                    type: 'select',
                    options: wilayas,
                    name: 'wilaya'
                  },
                  {
                    label: 'Moughataa',
                    onChange: e => setMoughataa(e.target.value),
                    value: moughataa,
                    type: 'select',
                    options: moughataas,
                    name: 'moughataa'
                  },
                  {
                    label: 'Zone Sanitaire',
                    onChange: e => setZoneSanitaire(e.target.value),
                    value: zoneSanitaire,
                    type: 'select',
                    options: zoneSanitaires,
                    name: 'zoneSanitaire'
                  },
                  {
                    label: 'Entity',
                    onChange: e => setEntity(e.target.value),
                    value: entity,
                    type: 'select',
                    options: entities?.map(entity => ({
                      value: entity.id,
                      label: entity.name
                    })),
                    name: 'entity'
                  },
                  {
                    label: 'contractType',
                    onChange: e => setContractType(e.target.value),
                    value: contractType,
                    type: 'select',
                    options: contractTypes ? contractTypes.map(ct => ({ value: ct.id, label: ct.title })) : [],
                    name: 'contractType'
                  },
                  {
                    label: 'Status',
                    onChange: e => setStatus(e.target.value),
                    value: status,
                    type: 'select',
                    options: statusOptions,
                    name: 'status'
                  }
                ]}
                actions={[
                  {
                    name: 'Edit',
                    icon: 'mdi:pencil-outline',
                    handler: id => router.push(`${pathname}/form?mode=edit&id=${id}`),
                    color: 'primary'
                  },
                  {
                    name: 'Delete',
                    icon: 'mdi:delete-outline',
                    handler: id => handleDeleteRow(id),
                    color: 'red',
                    confirmation: true,
                    requiredPermissions: [PERMISSIONS.entityClass.delete]
                  },
                  {
                    name: 'View',
                    icon: 'mdi:eye-outline',
                    handler: id => router.push(`${pathname}/form?mode=view&id=${id}`),
                    color: 'green'
                  },
                  {
                    name: 'Renouveler',
                    icon: 'mdi:refresh',
                    handler: id => router.push(`${pathname}/change?mode=renouvellement&id=${id}`),
                    color: 'green',
                    checkKey: 'renewalAllowed'
                  },
                  {
                    name: 'Promotion',
                    icon: 'mdi:arrow-up-bold',
                    handler: id => router.push(`${pathname}/change?mode=promotion&id=${id}`),
                    color: 'orange',
                    checkKey: 'promotionAllowed'
                  },
                  {
                    name: 'Relegation',
                    icon: 'mdi:arrow-down-bold',
                    handler: id => router.push(`${pathname}/change?mode=relegation&id=${id}`),
                    color: 'green',
                    checkKey: 'relegationAllowed'
                  },
                  {
                    name: 'Resiliation',
                    icon: 'mdi:close',
                    handler: id => router.push(`${pathname}/change?mode=resiliation&id=${id}`),
                    color: 'red',
                    checkKey: 'resiliationAllowed'
                  },
                  ,
                  {
                    name: 'Suspension',
                    icon: 'mdi:pause',
                    handler: id => router.push(`${pathname}/change?mode=suspension&id=${id}`),
                    color: 'red',
                    checkKey: 'suspensionAllowed'
                  },
                  {
                    name: 'Delocalisation',
                    icon: 'mdi:map-marker',
                    handler: id => router.push(`${pathname}/change?mode=delocalisation&id=${id}`),
                    color: 'orange',
                    checkKey: 'delocalisationAllowed'
                  },
                  {
                    name: 'Subtitution',
                    icon: 'mdi:file-document-edit',
                    handler: id => router.push(`${pathname}/change?mode=avenant&id=${id}`),
                    color: 'green',
                    checkKey: 'substitutionAllowed'
                  }
                ]}
                refetchPagination={(page, rowsPerPage) => {
                  setPagination({ pageNumber: page, pageSize: rowsPerPage })
                }}
                count={data?.count || 0}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

Contracts.acl = [PERMISSIONS.entityClass.read]
export default Contracts
