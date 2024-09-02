import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { fetchPbfConfigurations, updatePbfConfiguration } from 'src/api/settings'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import { Card, CardContent, CardHeader, Typography, Button } from '@mui/material'
import { fileOperations } from 'src/@core/components/FileOperations'

import { useTranslation } from 'react-i18next'
import { mapMonthsToTrimesters, years } from 'src/@core/utils'
import { fetchOneFrequency } from 'src/api/data/frequency'

const Settings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['settings', 'pbf-configurations'],
    queryFn: fetchPbfConfigurations
  })
  const { t } = useTranslation()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: frequency } = useQuery({
    queryKey: ['frequency'],
    queryFn: fetchOneFrequency
  })

  const contractSeason = data?.find(item => item.name === 'CONTRACTS_SEASON')
  const defaultTrimestre = contractSeason ? contractSeason.value.split('-')[1] : ''
  const defaultYear = contractSeason ? contractSeason.value.split('-')[2] : ''

  const [selectedTrimestre, setSelectedTrimestre] = useState(defaultTrimestre)
  const [selectedYear, setSelectedYear] = useState(defaultYear)

  useEffect(() => {
    if (contractSeason) {
      setSelectedTrimestre(contractSeason.value.split('-')[1])
      setSelectedYear(contractSeason.value.split('-')[2])
    }
  }, [contractSeason])

  const handleTrimestreChange = event => {
    setSelectedTrimestre(event.target.value)
  }

  const handleYearChange = event => {
    setSelectedYear(event.target.value)
  }

  const generateContractValue = () => {
    return `S-${selectedTrimestre}-${selectedYear}`
  }

  const yearOptions = useMemo(() => {
    return years.map(year => ({
      value: year,
      label: year
    }))
  }, [])

  const handleCancel = () => {
    setSelectedTrimestre(defaultTrimestre)
    setSelectedYear(defaultYear)
  }

  const handleSave = useCallback(async () => {
    const updatedData = {
      id: contractSeason.id,
      value: generateContractValue()
    }

    try {
      const res = await updatePbfConfiguration(updatedData)
      toast.success(`${t('Settings')} ${t(fileOperations.modify.successMessage)} : ${res.id}`)

      queryClient.invalidateQueries({ queryKey: ['settings'] })
      router.push('/admin/Setting/')
    } catch (error) {
      toast.error(`${t('settings')} ${t('errorMessage')}`)
    }
  }, [contractSeason, t, queryClient, router, generateContractValue])

  return (
    <>
      {isLoading ? (
        <p>loading</p>
      ) : (
        <Card>
          <CardHeader
            className='text-center'
            variant='h2'
            title={<Typography variant='h4'>{t('Settings')}</Typography>}
          />
          <CardContent>
            <table>
              <tr>
                <td width={500}>
                  {t(contractSeason?.name)} {generateContractValue()}
                </td>
                <td className='flex gap-4'>
                  <FormControl style={{ flexGrow: 1, width: '150px' }}>
                    <InputLabel id='month-select'>{t('Simestre')}</InputLabel>
                    <Select
                      fullWidth
                      value={selectedTrimestre}
                      id='select-month'
                      label='Select Month'
                      labelId='month-select'
                      onChange={handleTrimestreChange}
                      inputProps={{ placeholder: 'Select Month' }}
                    >
                      <MenuItem value='1'>1</MenuItem>
                      <MenuItem value='2'>2</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl style={{ flexGrow: 1, width: '150px' }}>
                    <InputLabel id='year-select'>{t('Year')}</InputLabel>
                    <Select
                      fullWidth
                      value={selectedYear}
                      id='select-year'
                      label='Select Year'
                      labelId='year-select'
                      onChange={handleYearChange}
                      inputProps={{ placeholder: 'Select Year' }}
                    >
                      {yearOptions?.map(year => (
                        <MenuItem key={year.value} value={year.value}>
                          {year.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </td>
              </tr>
            </table>

            <div style={{ display: 'flex', gap: 2, justifyContent: 'end', marginTop: '10px', width: '100%' }}>
              <Button variant='contained' color='secondary' onClick={handleCancel} style={{ marginRight: '10px' }}>
                {t('Annuler')}
              </Button>
              <Button variant='contained' color='primary' onClick={handleSave}>
                {t('Enregistrer')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default Settings
