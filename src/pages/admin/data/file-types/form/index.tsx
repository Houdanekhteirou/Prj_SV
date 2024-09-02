'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import TableE from 'src/@core/components/Element_Sub_Table/TableE'
import { fileOperations } from 'src/@core/components/FileOperations'
import { FormField, depsToOptions } from 'src/@core/utils'
import { createFileType, fetchOneFileType, updateFileType } from 'src/api/data/filetype'
import { fetchFrequencies } from 'src/api/data/frequency'
import { PERMISSIONS } from 'src/constants'
import { schema_file_type as schema } from 'src/constants/forms/validationSchemas'
import FormRenderer from 'src/views/components/forms/FormRenderer'

const Form = () => {
  const { t } = useTranslation()

  const router = useRouter()

  let { mode, id } = router.query
  if (!mode || !['create', 'view', 'edit'].includes(mode)) {
    mode = 'create'
  }
  const queryClient = useQueryClient()

  const {
    data: fileType,
    isLoading,
    error
  } = useQuery({
    queryKey: ['filetype', mode, id],
    queryFn: () => fetchOneFileType(parseInt(id)),
    enabled: !!id
  })

  const { data: frequencies, isLoading: isLoadingFrequencies } = useQuery({
    queryKey: ['frequencies'],
    queryFn: () => fetchFrequencies()
  })

  const fields: FormField[] = [
    {
      name: 'title',
      type: 'text',
      label: 'Title'
    },
    {
      name: 'frequencyId',
      type: 'select',
      label: 'Frequency',
      options: depsToOptions(frequencies)
    },
    {
      name: 'uid',
      type: 'text',
      label: 'Title Pub'
    },
    {
      name: 'dhis2Uid',
      type: 'text',
      label: 'dhis2Uid'
    }
  ]

  const initialValues = useMemo(() => (mode === 'create' ? {} : fileType?.object), [mode, fileType])

  const action = useCallback(
    async data => {
      let res
      if (mode === 'create') {
        res = await createFileType(data)
      } else {
        res = await updateFileType(Number(id), { ...data, id: Number(id) })
      }

      const msg =
        mode === 'create'
          ? `${t('fileType')} ${t(fileOperations.create.successMessage)}`
          : `${t('fileType')} ${t(fileOperations.modify.successMessage)}`

      if (res) {
        toast.success(msg + ' ' + res.id)
        queryClient.invalidateQueries({ queryKey: ['filetypes'] })
        router.back()
      } else {
        // toast.error(t('Error'))
        let errorMessage
        if (mode === 'create') {
          errorMessage = t(fileOperations.create.errorMessage)
        } else {
          errorMessage = t(fileOperations.modify.errorMessage)
        }
        toast.error(errorMessage)
      }
    },
    [id, mode]
  )

  if ((mode == 'view' || mode === 'edit') && !initialValues) return

  return (
    <div className='section animate-fadeIn'>
      <div className='flex flex-col gap-4'>
        <FormRenderer
          readOnly={mode === 'view'}
          fields={fields}
          validationSchema={schema}
          initialValues={initialValues}
          onSubmit={action}
          title={t(mode === 'create' ? 'Création' : 'edition') + ' ' + t('fileType')}
        />

        <TableE isFileType={true} id={id} />
      </div>
    </div>
  )
}

Form.acl = [PERMISSIONS.fileType.write, PERMISSIONS.fileType.update]
export default Form
