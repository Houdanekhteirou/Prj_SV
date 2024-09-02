'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'

import { createEntity, fetchOneEntity, fetchTypes, updateEntity } from 'src/api/entities'

import toast from 'react-hot-toast'
import FallbackSpinner from 'src/@core/components/spinner'
import { FormField, FormFieldGroup, depsToOptions } from 'src/@core/utils'
import FormRenderer from 'src/views/components/forms/FormRenderer'

import { useTranslation } from 'react-i18next'
import BankAccountsList from 'src/@core/components/E_Sub_T/accounts/list'
import EnityContactsList from 'src/@core/components/E_Sub_T/contact/list'
import ContractsList from 'src/@core/components/E_Sub_T/contract/list'
import { fileOperations } from 'src/@core/components/FileOperations'
import { fetchBanks } from 'src/api/banks/bank'
import { incrementDateByMonths } from 'src/api/entities/contract'
import { fetchContractTypes } from 'src/api/entities/contractType'
import { fetchEntityClasses } from 'src/api/entities/entityclasse'
import { fetchZonesByLevel } from 'src/api/organizations/zones'
import { PERMISSIONS, repoEnum } from 'src/constants'
import { schema_entity as schema, schema_entity_create } from 'src/constants/forms/validationSchemas'

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }
  const queryClient = useQueryClient()

  const {
    data: entity,
    isLoading,
    error
  } = useQuery({
    queryKey: ['entity', mode, id],
    queryFn: () => fetchOneEntity(parseInt(id)),
    enabled: !!id
  })

  const { data: entitytypes, isLoading: isLoadingEntitytypes } = useQuery({
    queryKey: ['entitytypes'],
    queryFn: () => fetchTypes({})
  })

  const { data: entityClasses } = useQuery({
    queryKey: ['entityclasses'],
    queryFn: () => fetchEntityClasses({})
  })

  const {
    data: allZones,
    isLoading: isLoadingZones,
    error: errorZones
  } = useQuery({
    queryKey: ['zones'],
    queryFn: async () => {
      const res = await fetchZonesByLevel(4)
      const a = res.map(el => {
        const b = el.initial_zones.map(e => {
          return { label: e.name, value: e.id, group: el.name }
        })
        return b
      })

      return a.flat()
    }
  })

  const { data: contractTypes } = useQuery({
    queryKey: ['contractTypes'],
    queryFn: fetchContractTypes
  })

  const { data: allBanks } = useQuery({
    queryKey: ['banks'],
    queryFn: () => fetchBanks({ all: true })
  })
  const fields: FormField[] = [
    { name: 'name', label: 'Name', type: 'text', groupKey: 1, className: 'col-span-full' },
    // {
    //   name: 'description',
    //   label: 'description',
    //   type: 'textEditor',
    //   groupKey: 1,
    //   className: 'col-span-full'
    // },
    {
      name: 'entityclassId',
      type: 'select',
      label: 'EntityClass',
      options: isLoadingEntitytypes ? [] : depsToOptions(entityClasses?.data),
      groupKey: 1,
      className: 'col-span-2'
    },
    {
      name: 'entitytypeId',
      type: 'select',
      label: 'entityType',
      options: isLoadingEntitytypes ? [] : depsToOptions(entitytypes?.data),
      groupKey: 1,
      className: 'col-span-2'
    },

    {
      name: 'picturePath',
      type: 'file',
      label: 'Image',
      fileType: 'img',
      className: 'row-span-2 col-span-2 ',
      groupKey: 2,
      repoTitle: repoEnum.ENTITIES
    },
    { name: 'coordinateLong', label: 'Longitude', type: 'number', groupKey: 2, className: 'w-full col-span-2' },
    { name: 'coordinateLat', label: 'Latitude', type: 'number', groupKey: 2, className: 'w-full col-span-2' },

    {
      name: 'equityBonus',
      type: 'checkbox',
      label: "Bonus_d'équité"
    },
    {
      name: 'equityPercentage',
      label: "Pourcentage_d'équité",
      type: 'number'
    },
    {
      name: 'dhis2Uid',
      label: 'dhis2Uid',
      type: 'text',
      className: 'col-span-2'
    }
  ]

  const extraFields: FormField[] = [
    {
      name: 'zoneId',
      type: 'multiple',
      label: 'Zone',
      options: isLoadingZones ? [] : allZones,
      groupKey: 3,
      className: 'col-span-2'
    },
    {
      name: 'zoneStartDate',
      type: 'date',
      label: 'Date de début de zone',
      groupKey: 3,
      className: 'col-span-2'
    },
    {
      name: 'number',
      type: 'text',
      label: 'numero',
      groupKey: 5,
      className: 'col-span-2'
    },
    {
      name: 'bankId',
      type: 'select',
      label: 'BANK',
      options: depsToOptions(allBanks?.data),
      groupKey: 5,
      className: 'col-span-2'
    },
    {
      name: 'compteOpeningDate',
      type: 'date',
      label: 'startDate',
      groupKey: 5,
      className: 'col-span-2'
    },
    {
      name: 'compteClosedDate',
      type: 'date',
      label: 'endDate',
      groupKey: 5,
      className: 'col-span-2'
    },

    {
      name: 'contactName',
      type: 'text',
      label: 'name',
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
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      groupKey: 4,
      className: 'col-span-2'
    },
    {
      name: 'contactOpeningDate',
      type: 'date',
      label: 'startDate',
      groupKey: 4,
      className: 'col-span-2'
    },
    {
      name: 'contactClosedDate',
      type: 'date',
      label: 'endDate',
      groupKey: 4,
      className: 'col-span-2'
    },
    {
      name: 'contractStartDate',
      type: 'date',
      label: 'startDate',
      className: 'col-span-2',
      groupKey: 6
    },
    {
      name: 'contracttypeId',
      type: 'select',
      label: 'contracttype',
      options: depsToOptions(contractTypes),
      className: 'col-span-2',
      groupKey: 6
    },
    {
      // contract file
      name: 'contractPath',
      type: 'file',
      label: 'Fichier de contrat',
      fileType: 'file',
      className: 'col-span-full',
      groupKey: 6
    }
  ]

  const groupFields: FormFieldGroup[] = [
    { id: 1, name: 'Informations générales' },
    { id: 2, name: 'Coordonnées' },
    { id: 3, name: 'Zone' },
    { id: 4, name: 'Contact' },
    { id: 5, name: 'Compte bancaire' },
    { id: 6, name: 'Contrat' }
  ]

  const initialValues = useMemo(() => (mode === 'create' ? {} : entity), [mode, entity])

  const action = useCallback(
    async data => {
      data.equityBonus = data.equityBonus ? 1 : 0
      let entity

      if (mode === 'create') {
        const contact = {
          name: data.contactName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          openingDate: data.contactOpeningDate,
          closedDate: data.contactClosedDate
        }

        const bankAccount = {
          number: data.number,
          bankId: data.bankId,
          openingDate: data.compteOpeningDate,
          closedDate: data.compteClosedDate
        }

        const contract = {
          startDate: data.contractStartDate,
          contracttypeId: data.contracttypeId,
          contractPath: data.contractPath,
          number: `${contractTypes?.find(el => el.id === data.contracttypeId)?.name}-${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()}`,
          endDate: incrementDateByMonths(
            data.contractStartDate,
            contractTypes?.find(el => el.id === data.contracttypeId)?.duration
          )
        }
        entity = {
          name: data.name,
          entitytypeId: data.entitytypeId,
          entityclassId: data.entityclassId,
          picturePath: data.picturePath,
          coordinateLong: data.coordinateLong,
          coordinateLat: data.coordinateLat,
          equityBonus: data.equityBonus,
          equityPercentage: data.equityPercentage,
          dhis2Uid: data.dhis2Uid,
          contact: contact,
          account: bankAccount,
          zoneId: data.zoneId,
          startDate: data.zoneStartDate,
          contract: contract
        }
      }

      let res
      if (mode === 'create') {
        res = await createEntity(entity)
      } else {
        res = await updateEntity(Number(id), data)
      }

      const msg =
        mode === 'create'
          ? ` ${t(fileOperations.create.successMessage)}`
          : ` ${t(fileOperations.modify.successMessage)}`
      if (res.success) {
        toast.success(msg + ' ' + res.id)
        if (mode === 'create') router.push(`/admin/organizations/entities/form/?mode=edit&id=${res.id}`)
        else router.push('/admin/organizations/entities')
      } else {
        // toast.error('Error')
        let errorMessage
        if (mode === 'create') {
          errorMessage = t(fileOperations.create.errorMessage)
        } else {
          errorMessage = t(fileOperations.modify.errorMessage)
        }
        toast.error(errorMessage)
      }
      queryClient.invalidateQueries({ queryKey: ['entities'] })
    },
    [id, contractTypes, entityClasses, entitytypes, allZones, allBanks]
  )

  if (((mode == 'view' || mode === 'edit') && !initialValues) || isLoading) return <FallbackSpinner />

  return (
    <div className='section animate-fadeIn'>
      <FormRenderer
        readOnly={mode === 'view'}
        fields={fields}
        validationSchema={mode === 'create' ? schema_entity_create : schema}
        initialValues={initialValues}
        onSubmit={action}
        groups={groupFields}
        title={mode === 'view' ? t('View entity') : mode === 'edit' ? t('Edit entity') : t('Add entity')}
        extraFields={mode === 'create' ? extraFields : []}
        extraComponent={
          mode === 'edit' || mode === 'view' ? (
            <div className='flex flex-col gap-2'>
              <BankAccountsList id={id} />
              <EnityContactsList id={id} />
              <ContractsList id={id} />
            </div>
          ) : null
        }
      />
    </div>
  )
}
Form.acl = [PERMISSIONS.entity.write, PERMISSIONS.entity.update]
export default Form
