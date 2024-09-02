'use client'
import { Autocomplete, TextField, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField } from 'src/@core/utils'
import Label from './Label'

const red500 = '#ef4444'

const SelectMui = ({ name, label, options, readOnly, splitFull = false, setCurrentValue, currentValue }: FormField) => {
  const { control, getValues } = useFormContext()
  const { t } = useTranslation()

  if (readOnly)
    return (
      <div className='flex flex-col gap-2'>
        <Label id={name}>{t(label)}</Label>
        <Typography variant='body1' sx={{ fontWeight: 500 }}>
          {options?.find(option => option.value === getValues(name))?.label || t('not_seted')}
        </Typography>
      </div>
    )

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { name, onChange, onBlur, value }, fieldState: { error } }) => (
        <div className={splitFull ? 'w-full col-span-full' : ''}>
          <Label id={name}>{t(label)}</Label>
          <Autocomplete
            fullWidth
            options={options || []}
            getOptionLabel={option => option.label}
            value={options?.find(option => option.value === value) || null}
            readOnly={readOnly}
            onBlur={onBlur}
            onChange={(event, newValue) => {
              const newValueValue = newValue ? newValue.value : ''
              if (setCurrentValue) {
                setCurrentValue(prev => {
                  return newValueValue
                })
              }
              onChange(newValueValue)
            }}
            renderInput={params => (
              <TextField
                {...params}
                disabled={readOnly}
                name={name}
                error={!!error}
                helperText={error ? t(error.message) : ''}
              />
            )}
            noOptionsText={t('Aucune option')}
            defaultValue={options?.find(option => option.value === currentValue) || null}
          />
        </div>
      )}
    />
  )
}

export default SelectMui
