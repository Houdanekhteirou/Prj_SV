'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useEffect } from 'react'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/@core/components/spinner'
import { FormField, depsToOptions } from 'src/@core/utils'
import FormRenderer from 'src/views/components/forms/FormRenderer'

import { fetchLookups } from 'src/api/lookups/lookups'

import { useTranslation } from 'react-i18next'
import { createElement, fetchOneElement, updateElement } from 'src/api/data/element'
import { fetchTargetPopulations } from 'src/api/data/filetype'
import TableE from 'src/@core/components/Element_Sub_Table/TableE'
import { FileOperation, fileOperations } from 'src/@core/components/FileOperations'
import { schema_element as schema } from 'src/constants/forms/validationSchemas'
import { PERMISSIONS } from 'src/constants'

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation() // Use useI18n for translations

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }

  const queryClient = useQueryClient()

  const {
    data: element,
    isLoading,
    error
  } = useQuery({
    queryKey: ['element', mode, id],
    queryFn: () => fetchOneElement(parseInt(id)),
    enabled: !!id
  })

  const { data: targetPopulations, isLoading: isLoadingTargetPopulations } = useQuery({
    queryKey: ['targetPopulations'],
    queryFn: () => fetchTargetPopulations({})
  })
  const { data: vartypeOptions } = useQuery({
    queryKey: ['lookups'],
    queryFn: () =>
      fetchLookups({
        // locale: ,
        pbfLookups: 'indicator_vartypes'
      })
  })
  const { data: unitOptions } = useQuery({
    queryKey: ['lookups1'],
    queryFn: () =>
      fetchLookups({
        // locale: locale,
        pbfLookups: 'indicator_units'
      })
  })

  const fields: FormField[] = [
    {
      name: 'title',
      type: 'text',
      label: 'Titre'
    },
    {
      name: 'shortname',
      type: 'text',
      label: 'shortname'
    },
    {
      name: 'formName',
      type: 'text',
      label: 'Nom commun'
    },
    {
      name: 'dhis2Uid',
      type: 'text',
      label: 'dhis2Uid'
    },

    {
      name: 'units',
      type: 'select',
      placeholder: 'choisir',
      options: depsToOptions(unitOptions),
      label: 'Unités'
    },
    {
      name: 'vartype',
      type: 'select',
      label: 'Type de donnée',
      options: depsToOptions(vartypeOptions)
    },
    {
      name: 'targetPopulationId',
      type: 'select',

      label: 'Population cible utilisée',
      options: isLoadingTargetPopulations ? [] : depsToOptions(targetPopulations?.data)
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: "Montrer Sur la page d'accueil"
    },
    {
      name: 'useNeedinessBonus',
      type: 'checkbox',
      label: "Appliquer se bonus d'indigence"
    },
    {
      name: 'editablePrice',
      type: 'checkbox',
      label: 'Tarif Modifiable'
    },
    {
      name: 'realtimeResult',
      type: 'checkbox',
      label: 'Résultat en temps réel'
    },
    {
      name: 'useCoverage',
      type: 'checkbox',
      label: 'Utiliser le couverture'
    },
    {
      name: 'description',
      type: 'textEditor',
      label: 'Description'
    },
    {
      name: 'iconFile',
      type: 'file',
      label: 'iconFile',
      fileType: 'img'
    }
  ]

  const initialValues = useMemo(() => (mode === 'create' ? {} : element?.object), [mode, element])

  const action = useCallback(
    async data => {
      data.featured = data.featured ? 1 : 0
      data.useCoverage = data.useCoverage ? 1 : 0
      data.useNeedinessBonus = data.useNeedinessBonus ? 1 : 0
      data.editablePrice = data.editablePrice ? 1 : 0
      data.realtimeResult = data.realtimeResult ? 1 : 0

      let res
      if (mode === 'create') {
        res = await createElement(data)
      } else {
        res = await updateElement(Number(id), data)
      }

      // const msg =
      //   mode === 'create'
      //     ? t('element') + t('created successfully') // Use translated message
      //     : t('element') + t('updated successfully') // Use translated message

      const msg =
        mode === 'create'
          ? `${t('indicateur')} ${t(fileOperations.create.successMessage)}`
          : `${t('indicateur')} ${t(fileOperations.modify.successMessage)}`

      if (res.success) {
        toast.success(msg)
        queryClient.invalidateQueries({ queryKey: ['elements'] })
        router.back()
      } else {
        // toast.error(t(fileOperations.create.errorMessage))
        let errorMessage
        if (mode === 'create') {
          errorMessage = t(fileOperations.create.errorMessage)
        } else {
          errorMessage = t(fileOperations.modify.errorMessage)
        }
        toast.error(errorMessage)
      }
    },
    [id, mode, t]
  )

  if ((mode == 'view' || mode === 'edit') && isLoading) return <FallbackSpinner color='primary' />

  return (
    <div className='section animate-fadeIn'>
      {/* {!(mode === 'create') && <TableE fileTypes={initialValues.filetypes} id={id} isLoading={isLoading} />} */}

      <div>
        <div className='w-full flex flex-col items-stretch gap-8 sm:gap-14 mt-4'>
          <FormRenderer
            readOnly={mode === 'view'}
            fields={fields}
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={action}
            title={mode === 'view' ? t('View element') : mode === 'edit' ? t('Edit element') : t('Add element')}
            extraComponent={mode === 'create' ? null : <TableE id={id} />}
          />
        </div>
      </div>
    </div>
  )
}
Form.acl = [PERMISSIONS.element.write, PERMISSIONS.element.update]
export default Form
