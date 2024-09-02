'use client'
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Select,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import FallbackSpinner from 'src/@core/components/spinner'
import { fetchOneFileType, updateFileType } from 'src/api/data/filetype'
import { fetchContractTypes } from 'src/api/entities/contractType'
import { fetchZonesByLevel } from 'src/api/organizations/zones'
import { PERMISSIONS } from 'src/constants'

const types = [
  { value: 'PbfOrganizationZones', label: 'Zones' },
  { value: 'PbfContractTypes', label: 'contractTypes' }
]

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { control, handleSubmit, setValue, watch } = useForm()
  const [selectedType, setSelectedType] = useState(types[0].value)

  const { id } = router.query

  const {
    data: fileType,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['fileType', id],
    queryFn: async () => {
      const res = await fetchOneFileType(id)

      return res.object
    }
  })

  const {
    data: initZones,
    isLoading: isLoadingZones,
    error: errorZones
  } = useQuery({
    queryKey: ['zones'],
    queryFn: async () => {
      const res = await fetchZonesByLevel(4)

      return res
    }
  })

  const {
    data: initContractTypes,
    isLoading: isLoadingContractTypes,
    error: errorContractTypes
  } = useQuery({
    queryKey: ['contractTypes'],
    queryFn: async () => {
      const res = await fetchContractTypes()

      return res?.map(e => ({
        label: e.title,
        value: e.id
      }))
    }
  })

  const allZones = useMemo(() => {
    const assignedZones = fileType?.zoneIds || []

    console.log('init', initZones)

    return initZones
      ?.flatMap(el =>
        el.initial_zones.map(e => ({
          label: e.name,
          value: e.id,
          group: el.name
        }))
      )
      ?.filter(e => !assignedZones.includes(e.value))
  }, [initZones, fileType])

  const handleTypeChange = event => {
    setSelectedType(event.target.value)
  }

  const tableData = useMemo(() => {
    switch (selectedType) {
      case 'PbfOrganizationZones':
        if (!fileType?.zoneIds) return []
        if (!allZones) return []
        console.log('allZones', allZones)

        return fileType?.zoneIds?.map(zoneId => {
          const zone = initZones
            ?.flatMap(el =>
              el.initial_zones.map(e => ({
                label: e.name,
                value: e.id
              }))
            )
            ?.find(e => e.value == zoneId)

          return {
            assignabale: zone?.label,
            assignabaleType: 'PbfOrganizationZones',
            id: zone?.value
          }
        })
      case 'PbfContractTypes':
        console.log('fileType', fileType)

        return fileType?.contracttypeIds?.map(contractTypeId => {
          const contractType = initContractTypes?.find(e => e.value == contractTypeId)
          console.log('contractType', contractType)

          return {
            assignabale: contractType?.label,
            assignabaleType: 'PbfContractTypes',
            id: contractType?.value
          }
        })
      default:
        return []
    }
  }, [fileType, selectedType, initZones, initContractTypes])

  const onSubmit = useCallback(
    async data => {
      try {
        const fileTypeId = fileType?.id
        console.log('fileTypeId', data)
        if (!data.zones && !data.contractTypes) {
          alert('Please fill out all fields.')

          return
        }

        let request: any = []

        switch (selectedType) {
          case 'PbfOrganizationZones':
            await updateFileType(fileTypeId, {
              id: +fileType?.id,
              zoneIds: [data?.zones, ...fileType?.zoneIds]
            })
            break
          case 'PbfContractTypes':
            await updateFileType(fileTypeId, {
              id: +fileType?.id,
              contracttypeIds: [data?.contractTypes, ...fileType?.contracttypeIds]
            })
            break
          default:
            break
        }

        await Promise.resolve(request)

        refetch()
        toast.success('Successfully added')
      } catch (e) {
        console.error(e)
        toast.error('Failed to add')
      }
    },
    [selectedType, refetch, fileType]
  )

  const handleDlete = async (id, type) => {
    console.log('id', id)
    try {
      let request: any = []

      switch (type) {
        case 'PbfOrganizationZones':
          await updateFileType(fileType?.id, {
            id: +fileType?.id,
            zoneIds: fileType?.zoneIds.filter(e => e !== id)
          })
          break
        case 'PbfContractTypes':
          await updateFileType(fileType?.id, {
            id: +fileType?.id,
            contracttypeIds: fileType?.contracttypeIds.filter(e => e !== id)
          })
          break
        default:
          break
      }

      await Promise.resolve(request)

      refetch()
      toast.success('Successfully deleted')
    } catch (e) {
      console.error(e)
      toast.error('Failed to delete')
    }
  }

  const renerSelectedType = () => {
    switch (selectedType) {
      case 'PbfOrganizationZones':
        return (
          <Controller
            name='zones'
            control={control}
            render={({ field }) => (
              <Autocomplete
                multiple
                options={allZones || []}
                disablePortal
                value={allZones?.filter(option => field.value?.includes(option.value)) || []}
                onChange={(event, newValue) => {
                  field.onChange(newValue.map(option => option.value))
                }}
                size='medium'
                groupBy={option => option.group}
                getOptionLabel={option => option.label}
                renderInput={params => <TextField {...params} variant='outlined' label='Zones' />}
                disableCloseOnSelect
              />
            )}
          />
        )
      case 'PbfContractTypes':
        return (
          <Controller
            name='contractTypes'
            control={control}
            render={({ field }) => (
              <Autocomplete
                multiple
                options={initContractTypes || []}
                disablePortal
                value={initContractTypes?.filter(option => field.value?.includes(option.value)) || []}
                onChange={(event, newValue) => {
                  field.onChange(newValue.map(option => option.value))
                }}
                size='medium'
                getOptionLabel={option => option.label}
                renderInput={params => <TextField {...params} variant='outlined' label='Contract Types' />}
                disableCloseOnSelect
              />
            )}
          />
        )
      default:
        return null
    }
  }

  if (isLoading || isLoadingZones) {
    return <FallbackSpinner />
  }

  return (
    <Card>
      <CardHeader title='Assign' />
      <CardContent>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='type'
            control={control}
            defaultValue={selectedType}
            render={({ field }) => (
              <Select
                {...field}
                label='Type'
                variant='outlined'
                fullWidth
                margin='normal'
                size='medium'
                onChange={event => {
                  field.onChange(event)
                  handleTypeChange(event)
                }}
              >
                {types.map((type, index) => (
                  <MenuItem key={index} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />

          {renerSelectedType()}
          <Button type='submit' variant='contained'>
            {t('Add')}
          </Button>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('Assignabale')}</TableCell>
                <TableCell>{t('Assignabale Type')}</TableCell>
                <TableCell>{t('Action')}</TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {tableData?.map((value, idx) => (
                <TableRow key={`${idx}`}>
                  <TableCell>{value.assignabale}</TableCell>
                  <TableCell>{value.assignabaleType}</TableCell>

                  <TableCell>
                    <Button color='secondary' onClick={() => handleDlete(value.id, selectedType)}>
                      <IconifyIcon icon='mdi:delete-outline' color='red' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </form>
      </CardContent>
    </Card>
  )
}

Form.acl = [PERMISSIONS.Gestion_acces.write, PERMISSIONS.Gestion_acces.update]
export default Form
