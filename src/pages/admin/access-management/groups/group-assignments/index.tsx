'use client'
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  InputLabel,
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
import { createPbfUserGroupAccess, fetchPbfUserGroupAccess } from 'src/api/access-management/groups/assignments'
import { fetchZonesByLevel } from 'src/api/organizations/zones'
import { PERMISSIONS } from 'src/constants'

const types = [{ value: 'PbfOrganizationZones', label: 'Zones' }]

const Form = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { control, handleSubmit, setValue, watch } = useForm()
  const [zones, setZones] = useState([])
  const [selectedType, setSelectedType] = useState(types[0].value)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [allowed, setAllowed] = useState(true)

  const { id } = router.query

  const {
    data: groupAssignments,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['groupAssignments', id],
    queryFn: () => fetchPbfUserGroupAccess({ groupId: id })
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

  const allZones = useMemo(() => {
    const assignedZones = groupAssignments?.content.map(e => e.assignabaleId) || []

    return initZones
      ?.flatMap(el =>
        el.initial_zones.map(e => ({
          label: e.name,
          value: e.id,
          group: el.name
        }))
      )
      ?.filter(e => !assignedZones.includes(e.value))
  }, [initZones, groupAssignments])

  const handleTypeChange = event => {
    setSelectedType(event.target.value)
  }

  const handleSelectChange = (event, newValue) => {
    setZones(newValue.map(option => option.value))
  }

  const getSelectedOptions = useMemo(() => {
    return allZones?.filter(option => zones.includes(option.value)) || []
  }, [zones, allZones])

  const handleDelete = index => {
    setAllValues(prevValues => prevValues.filter((_, i) => i !== index))
  }

  const onSubmit = useCallback(
    async data => {
      if (!data.startDate || !data.endDate || zones.length === 0) {
        alert('Please fill out all fields.')
        return
      }

      const requests = zones.map(async zone => {
        const res = await createPbfUserGroupAccess({
          groupId: parseInt(id),
          allowed: allowed ? 1 : 0,
          assignabaleId: zone,
          assignabaleType: selectedType,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate)
        })

        return {
          groupId: id,
          assignabaleName: getSelectedOptions?.find(z => z.value === zone)?.label,
          allowed: allowed ? 1 : 0,
          assignabaleId: zone,
          assignabaleType: selectedType,
          startDate: data.startDate,
          endDate: data.endDate
        }
      })

      const allResults = await Promise.all(requests)
      refetch()
      toast.success('Successfully added')
      setZones([])
      setStartDate('')
      setEndDate('')
      setAllowed(true)
    },
    [zones, id, getSelectedOptions, allowed, selectedType, refetch]
  )

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

          {selectedType === 'PbfOrganizationZones' && (
            <Controller
              name='zones'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={allZones || []}
                  disablePortal
                  value={getSelectedOptions}
                  onChange={(event, newValue) => {
                    field.onChange(newValue.map(option => option.value))
                    handleSelectChange(event, newValue)
                  }}
                  size='medium'
                  groupBy={option => option.group}
                  getOptionLabel={option => option.label}
                  renderInput={params => <TextField {...params} variant='outlined' label='Zones' />}
                  disableCloseOnSelect
                />
              )}
            />
          )}

          <div className='flex gap-2'>
            <Controller
              name='startDate'
              control={control}
              defaultValue={startDate}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id='startDate'>{t('Start Date')}</InputLabel>
                  <TextField
                    {...field}
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='medium'
                    type='date'
                    value={startDate}
                    onChange={e => {
                      field.onChange(e)
                      setStartDate(e.target.value)
                    }}
                  />
                </FormControl>
              )}
            />
            <Controller
              name='endDate'
              control={control}
              defaultValue={endDate}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id='endDate'>{t('End Date')}</InputLabel>
                  <TextField
                    {...field}
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    size='medium'
                    type='date'
                    value={endDate}
                    onChange={e => {
                      field.onChange(e)
                      setEndDate(e.target.value)
                    }}
                  />
                </FormControl>
              )}
            />
          </div>

          <Controller
            name='allowed'
            control={control}
            defaultValue={allowed}
            render={({ field }) => (
              <div className='flex items-center'>
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={e => {
                    field.onChange(e.target.checked)
                    setAllowed(e.target.checked)
                  }}
                  inputProps={{ 'aria-label': 'Allowed' }}
                />
                <label>{t('Allowed')}</label>
              </div>
            )}
          />

          <Button type='submit' variant='contained'>
            {t('Add')}
          </Button>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('Assignabale')}</TableCell>
                <TableCell>{t('Assignabale Type')}</TableCell>
                <TableCell>{t('Start Date')}</TableCell>
                <TableCell>{t('End Date')}</TableCell>
                <TableCell>{t('Allowed')}</TableCell>
                <TableCell>{t('Action')}</TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {groupAssignments?.content?.map((value, idx) => (
                <TableRow key={`${idx}`}>
                  <TableCell>{value.assignabale}</TableCell>
                  <TableCell>{value.assignabaleType}</TableCell>
                  <TableCell>
                    {new Date(value.startDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(value.endDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    {value.allowed ? (
                      <IconifyIcon icon='lets-icons:check-ring-duotone' color='green' fontSize={'2rem'} />
                    ) : (
                      <IconifyIcon icon='lets-icons:check-ring-duotone' color='red' fontSize={'2rem'} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleDelete(idx)} color='secondary'>
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
