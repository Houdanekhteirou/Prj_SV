import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { fileOperations } from 'src/@core/components/FileOperations'
import { TranslationComponentModal } from 'src/@core/components/TradictionComponent'
import PageHeader from 'src/@core/components/page-header'
import { calculateEcart, calcule_montant_penalite, formatNumberWithSpaces, monthsObjectFrench } from 'src/@core/utils'
import { fetchFileElementsPerFile, fetchOneFile, updateFile, updateFileElements } from 'src/api/data/file'
import { TFileDataEntry } from 'src/configs/traslationFields'

export type ElementFormData = {
  declaredValue: number
  verifiedValue: number
  validatedValue: number
  price: number
  amount: number
}

const useElementData = id => {
  const { data: elements, isLoading } = useQuery({
    queryKey: ['elements', id],
    queryFn: () => fetchFileElementsPerFile(id),
    enabled: id !== undefined && id !== null
  })

  console.log('render')
  const [newElements, setNewElements] = useState([])
  useEffect(() => {
    const initCashedState = localStorage.getItem('cashedState')
    console.log(initCashedState)
    const isThereCashedState =
      initCashedState !== null &&
      initCashedState !== 'undefined' &&
      initCashedState !== 'null' &&
      initCashedState !== '[]'

    if (isThereCashedState) {
      setNewElements(JSON.parse(initCashedState))
    } else if (elements) {
      const transformedElements = elements
        ?.map(fileElement => ({
          id: fileElement.id,
          info: fileElement.element
            ? {
                ...fileElement.element,
                orderNumber: fileElement?.fileElement?.orderNumber
              }
            : {
                id: fileElement.id,
                name: fileElement.indicateur,
                title: fileElement.indicateur,
                orderNumber: fileElement?.fileElement?.orderNumber
              },
          formData: {
            declaredValue: fileElement.declaredValue || 0,
            orderNumber: fileElement?.fileElement?.orderNumber,
            validatedValue: fileElement.validatedValue || 0,
            verifiedValue: fileElement.verifiedValue || 0,
            price: fileElement.price,
            amount: fileElement.amount || 0

            // ecart:
          }
        }))
        ?.sort((a, b) => a.info.orderNumber - b.info.orderNumber)

        // remove elements with no orderNumber
        ?.filter(item => !!item.info.orderNumber)

      setNewElements(transformedElements)
    }
  }, [elements])

  const updateField = useCallback((id, name, value) => {
    setNewElements(prev => {
      return prev.map(el => {
        if (el.id === id) {
          return {
            ...el,
            formData: {
              ...el.formData,
              [name]: value
            }
          }
        }

        return el
      })
    })
  }, [])

  useEffect(() => {
    if (newElements.length > 0) localStorage.setItem('cashedState', JSON.stringify(newElements))
  }, [newElements])

  return [newElements, updateField, isLoading]
}

const Form = ({
  info, // Element
  readOnly,
  declaredValue,
  validatedValue,
  verifiedValue,
  price,
  amount,
  updateField,
  index,
  fileTypeTemplate,
  globalTotal,
  id
}: any) => {
  const ecart = useMemo(() => calculateEcart(declaredValue, verifiedValue), [declaredValue, verifiedValue])

  useEffect(() => {
    const total =
      fileTypeTemplate === 'qtty_evaluation' ? price * validatedValue : price === 0 ? 0 : (verifiedValue * 100) / price
    updateField(id, 'amount', fileTypeTemplate === 'qtty_evaluation' ? calcule_montant_penalite(total, ecart) : total)
  }, [index, declaredValue, verifiedValue, validatedValue, price, ecart, fileTypeTemplate, id, updateField])

  const handleInputChange = e => {
    const { name, value } = e.target
    if (!/^(\d+|)$/.test(value) || value.includes('-')) return

    const intValue = value === '' ? 0 : parseInt(value, 10)
    if (fileTypeTemplate == 'qlty_evaluation' && name === 'verifiedValue' && intValue > price) return

    updateField(id, name, intValue)
  }

  return (
    <TableRow>
      <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>{info?.orderNumber}</TableCell>
      <TableCell sx={{ fontWeight: 'bold' }}>{info?.title}</TableCell>
      {fileTypeTemplate === 'qtty_evaluation' && (
        <TableCell>
          <TextField
            required
            type='number'
            value={declaredValue}
            name='declaredValue'
            onChange={handleInputChange}
            disabled={!globalTotal || readOnly}
            onWheel={e => e.preventDefault()} // Disable spin arrows
            onPaste={e => e.preventDefault()}
            // only positive and naturel numbers

            onKeyDown={e => {
              // Prevent arrow key input
              if (e.keyCode === 38 || e.keyCode === 40) {
                e.preventDefault()
              }
            }}
          />
        </TableCell>
      )}
      <TableCell>
        <TextField
          required
          type='number'
          value={verifiedValue}
          name='verifiedValue'
          onChange={handleInputChange}
          disabled={!globalTotal || readOnly}
          onKeyDown={e => {
            // Prevent arrow key input
            if (e.keyCode === 38 || e.keyCode === 40) {
              e.preventDefault()
            }
          }}
        />
      </TableCell>

      {fileTypeTemplate === 'qtty_evaluation' && (
        <TableCell>
          <TextField
            required
            type='number'
            value={validatedValue}
            name='validatedValue'
            onChange={handleInputChange}
            disabled={!globalTotal || readOnly}
            onWheel={e => e.preventDefault()} // Disable spin arrows
            onPaste={e => e.preventDefault()} // Prevent pasting
            onKeyDown={e => {
              // Prevent arrow key input
              if (e.keyCode === 38 || e.keyCode === 40) {
                e.preventDefault()
              }
            }}
          />
        </TableCell>
      )}
      <TableCell>{price}</TableCell>

      {fileTypeTemplate === 'qtty_evaluation' && <TableCell>{ecart}</TableCell>}
      <TableCell>{fileTypeTemplate === 'qtty_evaluation' ? amount : amount.toFixed(2) + '%'}</TableCell>
    </TableRow>
  )
}
const KeyValueItem = ({ label, value, comp = null }) => {
  return (
    <Box display='flex' alignItems='center' gap={2}>
      <Typography variant='subtitle2' fontWeight='medium'>
        {label} {':'}
      </Typography>
      {value ? <Typography>{value}</Typography> : comp}
    </Box>
  )
}

export default function Edit() {
  const router = useRouter()
  const { id, entityClass } = router.query
  const mode = router.query.mode as 'edit' | 'view'

  const { data: file, isLoading } = useQuery({
    queryKey: ['file', id],
    queryFn: () => fetchOneFile(id),
    enabled: id !== undefined && mode !== undefined && id !== null
  })

  const [totalValue, setTotalValue] = useState(0)
  const [totalState, setTotalState] = useState({
    valid: false,
    global: 0,
    form: 0,
    point_attribued: 0,
    point_disponible: 0,
    totalQuality: 0
  })
  const [description, setDescription] = useState(null)
  useEffect(() => {
    if (file) {
      setDescription(file.description)
    }
  }, [file])

  const [modalOpen, setModalOpen] = useState(false)
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('cashedState')
    }
    window.addEventListener('unload', handleBeforeUnload)
  }, [])

  const [elements, updateField, isElementLoading] = useElementData(id)

  const { t } = useTranslation()

  const fileTypeTemplate: 'qtty_evaluation' | 'qlty_evaluation' = useMemo(
    () => file?.fileType.template,
    [file?.fileType]
  )

  useEffect(() => {
    const theTotal = elements?.reduce((prev, curr) => prev + curr.formData.amount, 0)
    const formTotal = fileTypeTemplate === 'qlty_evaluation' ? theTotal / elements.length : theTotal
    const point_attribued = elements?.reduce((prev, curr) => prev + parseFloat(curr.formData.verifiedValue), 0)
    const point_disponible = elements?.reduce((prev, curr) => prev + parseFloat(curr.formData.price), 0)

    setTotalState((prev: any) => {
      return {
        ...prev,
        valid:
          fileTypeTemplate === 'qtty_evaluation'
            ? formTotal?.toFixed(2) == parseFloat(totalValue).toFixed(2)
            : ((point_attribued / point_disponible) * 100).toFixed(2) == parseFloat(totalValue).toFixed(2),
        form: parseFloat(formTotal)?.toFixed(2),
        global: Number(totalValue),
        point_attribued,
        point_disponible,
        totalQuality: ((point_attribued / point_disponible) * 100).toFixed(2)
      }
    })
  }, [totalValue, elements, fileTypeTemplate])

  useEffect(() => {
    if (file) {
      setTotalValue(file.totalValue)
    }
  }, [file])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()

    if (!totalState.valid) {
      return alert('Total is invalid')
    }
    const newElements = elements.map(el => ({
      id: el.id,
      declaredValue: el.formData.declaredValue,
      verifiedValue: el.formData.verifiedValue,
      validatedValue: el.formData.validatedValue,
      amount: el.formData.amount
    }))
    let success = true

    await updateFileElements(newElements).catch(() => {
      success = false
    })
    if (!success) {
      return toast.error(t(fileOperations.modify.errorMessage))
    }
    await updateFile(id, {
      description,
      totalValue: totalState.global
    })

    toast.success(`${t('file')} ${t(fileOperations.modify.successMessage)}`)
    router.push('/admin/data/data-entry?entityClass=' + entityClass)
  }

  if (!id || !mode || !['edit', 'view'].includes(mode)) {
    return <div>Invalid mode</div>
  }

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Box>
            <Box sx={{ display: 'flex', flexDirection: { md: 'row' }, justifyContent: 'start' }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <KeyValueItem
                      label={t('entity')}
                      value={
                        file?.info?.wilayaa +
                          ' / ' +
                          file?.info?.moughataa +
                          ' / ' +
                          file?.info.zoneSanitaire +
                          ' / ' +
                          file?.info?.entity +
                          ' / ' +
                          file?.fileType.title || 'N/A'
                      }
                    />
                    <KeyValueItem label={t('period')} value={`${monthsObjectFrench[file?.month]} ${file?.year}`} />
                    <KeyValueItem
                      label={t('total')}
                      comp={
                        mode === 'view' ? (
                          fileTypeTemplate === 'qtty_evaluation' ? (
                            formatNumberWithSpaces(totalValue)
                          ) : (
                            formatNumberWithSpaces(totalState.totalQuality) + ' %'
                          )
                        ) : (
                          <Box display='flex' alignItems='center' gap={1}>
                            <TextField
                              autoFocus
                              required
                              type='number'
                              inputProps={{ step: '0.01' }}
                              fullWidth
                              variant='outlined'
                              size='small'
                              value={totalValue}
                              onChange={e => setTotalValue(e.target.value)}
                              onPaste={e => e.preventDefault()}
                            />
                          </Box>
                        )
                      }
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '20rem' }}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      value={description}
                      label={t('description')}
                      variant='outlined'
                      onChange={e => setDescription(e.target.value)}
                      disabled={mode === 'view'}
                      sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='mdi:message-outline' />
                          </InputAdornment>
                        )
                      }}
                    />
                    {description && (
                      <Button variant='contained' onClick={() => setModalOpen(true)} sx={{ borderRadius: 1 }}>
                        {t('translate')}
                      </Button>
                    )}
                    <TranslationComponentModal
                      isOpen={modalOpen}
                      onClose={() => setModalOpen(false)}
                      translations={file?.translations}
                      fields={TFileDataEntry}
                      elementId={file?.id}
                      path='pbf-data-files'
                    />
                    <Box mx='auto'></Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        }
      />
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('orderNumber')}</TableCell>
                    <TableCell>{t('indicator')}</TableCell>
                    {fileTypeTemplate === 'qtty_evaluation' && <TableCell>{t('declaredValue')}</TableCell>}
                    <TableCell>
                      {fileTypeTemplate === 'qtty_evaluation' ? t('verifiedValue') : t('point_attribued')}
                    </TableCell>

                    {fileTypeTemplate === 'qtty_evaluation' && <TableCell>{t('validatedValue')}</TableCell>}
                    <TableCell>{fileTypeTemplate === 'qtty_evaluation' ? t('price') : t('point_disponible')}</TableCell>

                    {fileTypeTemplate === 'qtty_evaluation' && <TableCell>{t('ecart')}</TableCell>}
                    <TableCell>{fileTypeTemplate === 'qtty_evaluation' ? t('total') : t('score')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isElementLoading ? (
                    <TableRow>
                      <TableCell colSpan={fileTypeTemplate === 'qtty_evaluation' ? 8 : 7}>
                        {(Array.from(Array(10).keys()) as number[]).map((_, index) => (
                          <Skeleton key={index} height={50} />
                        ))}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {' '}
                      {elements?.map((element, idx) => (
                        <Form
                          key={element.id}
                          index={idx + 1}
                          globalTotal={totalValue}
                          readOnly={mode === 'view'}
                          updateField={updateField}
                          {...element.formData}
                          fileTypeTemplate={fileTypeTemplate}
                          info={element.info}
                          id={element.id}
                        />
                      ))}
                      <TableRow>
                        <TableCell colSpan={fileTypeTemplate === 'qtty_evaluation' ? 7 : 2}></TableCell>
                        {fileTypeTemplate === 'qlty_evaluation' && (
                          <TableCell sx={{ fontWeight: 'bold' }} align='left'>
                            {totalState.point_attribued.toFixed(2)}
                          </TableCell>
                        )}
                        {fileTypeTemplate === 'qlty_evaluation' && (
                          <TableCell sx={{ fontWeight: 'bold' }} align='left'>
                            {formatNumberWithSpaces(totalState.point_disponible)}
                          </TableCell>
                        )}

                        <TableCell sx={{ fontWeight: 'bold' }} align='left'>
                          {fileTypeTemplate === 'qlty_evaluation'
                            ? formatNumberWithSpaces(totalState.totalQuality)
                            : formatNumberWithSpaces(totalState.form)}
                          {fileTypeTemplate === 'qlty_evaluation' && ' %'}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          <CardContent>
            {mode !== 'view' && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant='contained' onClick={onSubmit} disabled={isElementLoading || !totalState.valid}>
                  {t('save')}
                </Button>
                <Button variant='contained' color='inherit' onClick={() => router.back()}>
                  {t('cancel')}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
