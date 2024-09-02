import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { use, useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getZonesOptions } from 'src/@core/utils'
import { divisionOptions } from 'src/constants'
import { useAuth } from 'src/hooks/useAuth'

export const ContractZones = ({ name, label, data }) => {
  const { contractTypes } = data

  const { setValue, getValues } = useFormContext()

  const contractType = getValues('contracttypeId')

  const disabled = useMemo(() => {
    const division = contractTypes.find(d => d.id === contractType)?.division

    switch (division) {
      case divisionOptions[2].value:
        return 'district'

      case divisionOptions[3].value:
        return 'zone'
      default:
        return null
    }
  }, [contractType, data])

  const { t } = useTranslation()

  const [wilaya, setWilaya] = useState<string | null>(null)
  const [moughataa, setMoughataa] = useState<string | null>(null)
  const [zoneSanitaire, setZoneSanitaire] = useState<string | null>(null)

  const { user } = useAuth()
  const zonesByUser = user?.zones

  const { wilayas, moughataas, zoneSanitaires }: any = useMemo(() => {
    return getZonesOptions(wilaya, moughataa, zonesByUser)
  }, [wilaya, moughataa, zonesByUser])

  useEffect(() => {
    if (data) {
      setWilaya(data.initWilaya)
      setMoughataa(data.initMoughataa)
    }
  }, [data])

  useEffect(() => {
    switch (disabled) {
      case 'district':
        setValue(name, wilaya)
        break
      case 'zone':
        setValue(name, moughataa)
        break
      default:
        setValue(name, zoneSanitaire)
        break
    }
  }, [disabled, wilaya, zoneSanitaire, moughataa, setValue, name])

  return (
    <div className='flex gap-2 flex-col '>
      <div className='flex gap-2 '>
        <FormControl fullWidth sx={{ mr: 4, mb: 2 }}>
          <Autocomplete
            id={`filter-wilaya`}
            options={wilayas || []}
            getOptionLabel={option => t(option.label)}
            value={wilayas?.find(option => option.value == wilaya) || null}
            clearOnEscape
            onChange={(event, newValue) => setWilaya(newValue?.value || '')}
            renderInput={params => <TextField {...params} label={t('wilaya')} size='medium' />}
            fullWidth
            readOnly
          />
        </FormControl>

        {disabled !== 'district' && (
          <FormControl fullWidth sx={{ mr: 4, mb: 2 }}>
            <Autocomplete
              id={`filter-moughataa`}
              options={moughataas || []}
              getOptionLabel={option => t(option.label)}
              value={moughataas?.find(option => option.value == moughataa) || null}
              clearOnEscape
              onChange={(event, newValue) => setMoughataa(newValue?.value || '')}
              renderInput={params => <TextField {...params} label={t('Moughataa')} size='medium' />}
              fullWidth
              readOnly
            />
          </FormControl>
        )}
        {disabled !== 'district' && disabled !== 'zone' && (
          <FormControl fullWidth sx={{ mr: 4, mb: 2 }}>
            <Autocomplete
              id={`filter-zoneSanitaire`}
              options={zoneSanitaires || []}
              getOptionLabel={option => t(option.label)}
              value={zoneSanitaires?.find(option => option.value == zoneSanitaire) || null}
              clearOnEscape
              onChange={(event, newValue) => setZoneSanitaire(newValue?.value || '')}
              renderInput={params => <TextField {...params} label={t('Zone Sanitaire')} size='medium' />}
              fullWidth
            />
          </FormControl>
        )}
      </div>
    </div>
  )
}
