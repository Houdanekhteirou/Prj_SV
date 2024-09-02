'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/@core/components/spinner'
import { FormField, depsToOptions } from 'src/@core/utils'
import FormRenderer from 'src/views/components/forms/FormRenderer'

import { useTranslation } from 'react-i18next'
import { fetchEntityClasses } from 'src/api/entities/entityclasse'
import { fetchEntityTypes } from 'src/api/entities/entitytype'

import { fileOperations } from 'src/@core/components/FileOperations'
import { PERMISSIONS, authorityOptions, divisionOptions } from 'src/constants'

import { createContractType, fetchOneContractTypeType, updateContractType } from 'src/api/entities/contractType'
import { fetchLevels } from 'src/api/organizations/levels'
import { schema_contract_type as schema } from 'src/constants/forms/validationSchemas'

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }
  const queryClient = useQueryClient()

  const {
    data: contractType,
    isLoading,
    error
  } = useQuery({
    queryKey: ['entity', mode, id],
    queryFn: () => fetchOneContractTypeType(parseInt(id)),
    enabled: !!id
  })

  const { data: entityClasses } = useQuery({
    queryKey: ['entityclasses'],
    queryFn: () => fetchEntityClasses({})
  })

  const { data: entityTypes } = useQuery({
    queryKey: ['entitytypes'],
    queryFn: () => fetchEntityTypes({})
  })

  const { data: levels } = useQuery({
    queryKey: ['zoneLevels'],
    queryFn: () => fetchLevels({})
  })

  const fields: FormField[] = [
    {
      name: 'title',
      type: 'text',
      label: 'title',
      className: 'w-full col-span-2'
    },
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      className: 'w-full col-span-2'
    },
    {
      name: 'shortname',
      type: 'text',
      label: 'Shortname'
    },
    {
      name: 'duration',
      type: 'number',
      label: 'Duration'
    },
    {
      name: 'authority',
      type: 'select',
      label: 'Authority',
      options: authorityOptions
    },
    {
      name: 'division',
      type: 'select',
      label: 'division',
      options: divisionOptions
    },

    {
      name: 'renewable',
      type: 'checkbox',
      label: 'Renewable'
    },
    {
      name: 'entitytypes',
      type: 'multiple',
      label: 'Entity Type',
      options: depsToOptions(entityTypes?.data),
      isMulti: true,
      className: 'w-full col-span-3'
    },

    {
      name: 'entityclasses',
      type: 'multiple',
      label: 'Entity Class',
      options: depsToOptions(entityClasses?.data),
      className: 'w-full col-span-2',
      isMulti: true
    },

    {
      name: 'zoneLevels',
      type: 'multiple',
      label: 'Zone Level',
      options: depsToOptions(levels?.data),
      isMulti: true,
      className: 'w-full col-span-2'
    }
  ]

  const initialValues = useMemo(
    () =>
      mode === 'create' || !contractType
        ? {}
        : {
            ...contractType,
            renewable: contractType?.renewable === 'Y',
            entitytypes: JSON.parse(contractType?.entitytypes),
            entityclasses: JSON.parse(contractType?.entityclasses),
            zoneLevels: JSON.parse(contractType?.zoneLevels)
          },
    [mode, contractType]
  )

  const action = useCallback(
    async data => {
      const payload = {
        ...data,
        renewable: data.renewable ? 'Y' : 'N',
        entitytypes: JSON.stringify(data.entitytypes),
        entityclasses: JSON.stringify(data.entityclasses),
        zoneLevels: JSON.stringify(data.zoneLevels)
      }
      let res
      if (mode === 'create') {
        res = await createContractType(payload)
      } else {
        res = await updateContractType(Number(id), payload)
      }

      const msg =
        mode === 'create'
          ? ` ${t(fileOperations.create.successMessage)}`
          : ` ${t(fileOperations.modify.successMessage)}`
      if (res.success) {
        toast.success(msg)
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
      router.push('/admin/organizations/contrat-type')
    },
    [id]
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
            title={
              mode === 'view'
                ? t('View') + ' ' + t('contractType')
                : mode === 'edit'
                ? t('Edit contractType')
                : t('add contractType')
            }
          />
        </div>
      </div>
    </div>
  )
}
Form.acl = [PERMISSIONS.entityType.write, PERMISSIONS.entityType.update]
export default Form
