import { useCallback, useMemo } from 'react'

import { Icon } from '@iconify/react'
import { Dialog, DialogTitle, IconButton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { FormField } from 'src/@core/utils'
import { addFileTypeToElement, fetchOneFileTypeFrequencie, updateFileTypeFrequencie } from 'src/api/data/element'
import FormRenderer from 'src/views/components/forms/FormRenderer'
import * as yup from 'yup'

export const FileTypeModal = ({
  isOpen,
  onClose,
  elementId,
  fileTypes,
  id,
  mode,
  refetch,
  isFileType,
  allIndicators,
  title
}) => {
  const { t } = useTranslation() // Use useI18n for translations

  const { data: frequencie, isLoading: isLoadingFrequencie } = useQuery({
    queryKey: ['frequencie', mode, id],
    queryFn: () => fetchOneFileTypeFrequencie(id),
    enabled: mode === 'edit' && id !== null
  })

  const initialValues = useMemo(() => {
    if (mode === 'edit' && frequencie) {
      return {
        frequencyId: frequencie.frequencyId,
        filetypeId: frequencie.filetypeId,
        openingDate: new Date(frequencie.openingDate) || null,
        closedDate: new Date(frequencie.closedDate) || null,
        price: frequencie.price,
        orderNumber: frequencie.orderNumber,
        bonus: frequencie.bonus
      }
    }

    return {
      frequencyId: '',
      filetypeId: '',
      openingDate: '',
      closedDate: '',
      price: '',
      orderNumber: '',
      bonus: ''
    }
  }, [frequencie, mode, id])

  const fields: FormField[] = [
    {
      name: 'openingDate',
      type: 'date',
      label: 'Opening Date',
      className: 'col-span-2'
    },
    {
      name: 'closedDate',
      type: 'date',
      label: 'Closed Date',
      className: 'col-span-2'
    },
    {
      name: 'price',
      type: 'number',
      label: 'price',
      className: 'col-span-2'
    },
    {
      name: 'orderNumber',
      type: 'number',
      label: 'orderNumber',
      className: 'col-span-2'
    },
    {
      name: 'bonus',
      type: 'number',
      label: 'bonus',
      className: 'col-span-2'
    }
  ]

  if (mode === 'create') {
    if (!isFileType) {
      fields.push({
        name: 'filetypeId',
        type: 'select',
        label: 'File Type',
        options: fileTypes,
        className: 'col-span-2'
      })
    } else {
      fields.push({
        name: 'frequencyId',
        type: 'select',
        label: 'Indicateur',
        options: allIndicators,
        className: 'col-span-2'
      })
    }
  }
  const schemaFiltye = yup.object().shape({
    openingDate: yup.date().required(t('is_required')),
    closedDate: yup
      .date()
      .required(t('Closed Date') + ' ' + t('is_required'))
      .when('openingDate', (openingDate, schema) => {
        return schema.min(openingDate, t('Closed Date') + ' ' + t('should_be_after_started_at'))
      }),
    price: yup.string().required(t('price') + ' ' + t('is_required')), // Use translated message
    orderNumber: yup.string().required(t('orderNumber') + ' ' + t('is_required')),
    frequencyId: yup.string().required(t('frequencieId') + ' ' + t('is_required'))
  })

  const schema = isFileType
    ? schemaFiltye
    : yup.object().shape({
        openingDate: yup.date().required(t('is_required')),
        closedDate: yup
          .date()
          .required(t('Closed Date') + ' ' + t('is_required'))
          .when('openingDate', (openingDate, schema) => {
            return schema.min(openingDate, t('Closed Date') + ' ' + t('should_be_after_started_at'))
          }),
        price: yup.string().required(t('price') + ' ' + t('is_required')), // Use translated message
        orderNumber: yup.string().required(t('orderNumber') + ' ' + t('is_required')),
        filetypeId: yup.string().required(t('filetypeId') + ' ' + t('is_required'))
      })

  const action = useCallback(
    async data => {
      if (mode === 'create') {
        if (isFileType) {
          data.filetypeId = +elementId
        } else {
          data.frequencyId = +elementId
        }
      }

      data.price = parseFloat(data.price)
      data.orderNumber = parseFloat(data.orderNumber)
      data.bonus = parseFloat(data.bonus)
      data.openingDate = new Date(data.openingDate).toISOString()
      data.closedDate = new Date(data.closedDate).toISOString()

      data.bonus = data.bonus || 0

      if (mode === 'edit') {
        await updateFileTypeFrequencie(id, data)
      } else {
        await addFileTypeToElement(data)
      }
      refetch()
      onClose()
    },
    [elementId]
  )

  if (!isOpen) return <></>

  return (
    <Dialog open={isOpen} onClose={() => onClose()}>
      {/* <DialogTitle className='flex justify-between'>

      </DialogTitle> */}

      {mode === 'edit' ? (
        isLoadingFrequencie ? (
          <div>Loading...</div>
        ) : (
          <FormRenderer
            readOnly={false}
            fields={fields}
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={action}
            closeButton={false}
            title={
              <div className='flex justify-between'>
                <span>{title}</span>
                <IconButton
                  onClick={() => {
                    onClose()
                  }}
                >
                  <Icon icon='mdi:close' />
                </IconButton>
              </div>
            }
          />
        )
      ) : (
        <FormRenderer
          readOnly={false}
          fields={fields}
          validationSchema={schema}
          initialValues={initialValues}
          onSubmit={action}
          closeButton={false}
          title={
            <div className='flex justify-between'>
              <span>
                {t('create')} {t("Grille d'évaluation")}
              </span>
              <IconButton
                onClick={() => {
                  onClose()
                }}
              >
                <Icon icon='mdi:close' />
              </IconButton>
            </div>
          }
        />
      )}
    </Dialog>
  )
}
