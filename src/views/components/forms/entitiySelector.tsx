import { Autocomplete, FormControl, InputLabel, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { depsToOptions, getZonesOptions } from 'src/@core/utils'
import { fetchEntitiesFilter } from 'src/api/entities'
import { useAuth } from 'src/hooks/useAuth'

export const EntitySelector = ({ name, label, data }) => {
  const { control, setValue, getValues } = useFormContext()
  const entity = useWatch({ name })

  const { t } = useTranslation()

  const [wilaya, setWilaya] = useState<string | null>(null)
  const [moughataa, setMoughataa] = useState<string | null>(null)
  const [zoneSanitaire, setZoneSanitaire] = useState<string | null>(null)

  const { user } = useAuth()
  const zonesByUser = user?.zones

  const { wilayas, moughataas, zoneSanitaires }: any = useMemo(() => {
    return getZonesOptions(wilaya, moughataa, zonesByUser)
  }, [wilaya, moughataa, zonesByUser])

  const { data: entities } = useQuery({
    queryKey: ['entities', zoneSanitaire],
    queryFn: () =>
      zoneSanitaire
        ? fetchEntitiesFilter({
            'zoneId.equals': zoneSanitaire
          })
        : null,

    enabled: !!zoneSanitaire
  })

  useEffect(() => {
    if (data) {
      setWilaya(data?.initWilaya)
      setMoughataa(data?.initMoughataa)
      setZoneSanitaire(data?.initZoneSanitaire)
      setValue(name, data?.initEntity)
    }
  }, [data])

  return (
    <div className='flex gap-2'>
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
        />
      </FormControl>
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
        />
      </FormControl>
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

      <FormControl fullWidth sx={{ mr: 4, mb: 2 }}>
        <Autocomplete
          id={`filter-entity`}
          options={depsToOptions(entities) || []}
          getOptionLabel={option => t(option.label)}
          value={depsToOptions(entities)?.find(option => option.value == entity) || null}
          clearOnEscape
          onChange={(event, newValue) => setValue(name, newValue?.value || '')}
          renderInput={params => <TextField {...params} label={t('Entity')} size='medium' />}
          fullWidth
        />
      </FormControl>
    </div>
  )
}
