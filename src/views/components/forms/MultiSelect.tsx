import * as React from 'react'
import { useController, useFormContext } from 'react-hook-form'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Label from './Label'
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'

const MultiSelect = ({ name, label, options, readOnly, splitFull = false, setCurrentValue, currentValue, isMulti }) => {
  const { control } = useFormContext()
  const { t } = useTranslation()
  const {
    field: { onChange, onBlur, value },
    fieldState: { error }
  } = useController({
    name,
    control,
    defaultValue: currentValue
  })

  const handleSelectChange = (event, newValue) => {
    const selectedValues = isMulti ? newValue.map(option => option.value) : newValue?.value
    onChange(selectedValues)
    if (setCurrentValue) setCurrentValue(selectedValues)
  }

  const getSelectedOptions = () => {
    if (!isMulti) return options?.find(option => option.value === value)

    return options?.filter(option =>
      typeof value === 'number' ? value === option.value : value?.includes(option.value)
    )
  }

  const handleGroupSelect = (event, groupValue) => {
    const groupOptions = options.filter(option => option.group === groupValue)
    const groupSelected = groupOptions.every(option => value.includes(option.value))

    const updatedValue = groupSelected
      ? value.filter(val => !groupOptions.map(option => option.value).includes(val))
      : [...value, ...groupOptions.map(option => option.value)]

    onChange(updatedValue)
    if (setCurrentValue) setCurrentValue(updatedValue)
  }

  if (readOnly)
    return (
      <div className='flex flex-col gap-2'>
        <Label id={name}>{t(label)}</Label>
        <Typography variant='body1' sx={{ fontWeight: 500 }}>
          {getSelectedOptions()
            ?.map(option => option.label)
            .join(', ') || t('not_seted')}
        </Typography>
      </div>
    )

  return (
    <div className='w-'>
      <Label id={name}>{t(label)}</Label>
      <Autocomplete
        multiple={isMulti}
        id={name}
        options={options}
        fullWidth
        disablePortal
        value={getSelectedOptions()}
        onChange={handleSelectChange}
        onBlur={onBlur}
        size='medium'
        groupBy={option => option.group}
        readOnly={readOnly}
        getOptionLabel={option => option.label}
        renderInput={params => (
          <TextField {...params} error={!!error} helperText={error ? t(error.message) : null} fullWidth />
        )}
        disableCloseOnSelect
        renderGroup={params => (
          <li {...params} className='pl-2'>
            <span style={{ cursor: 'pointer' }} className='bold' onClick={() => handleGroupSelect(null, params.group)}>
              {params.group}
            </span>
            {params.children}
          </li>
        )}
      />
    </div>
  )
}

export default MultiSelect
