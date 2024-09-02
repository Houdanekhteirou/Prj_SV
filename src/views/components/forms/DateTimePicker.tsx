'use client'

import { TextField, Typography } from '@mui/material'
import { ar, fr } from 'date-fns/locale'
import DatePicker, { registerLocale } from 'react-datepicker'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Label from './Label'
import { useMemo } from 'react'

registerLocale('fr', fr)
registerLocale('ar', ar)

const DateTimePicker = ({ id, label, readOnly = false, defaultValue = null, maxDate, name, required = false }) => {
  const {
    control,
    setValue,
    register,
    getValues,
    formState: { errors }
  } = useFormContext()
  const { t, i18n } = useTranslation()
  const locale = i18n.language

  const handleDateChange = date => {
    setValue(id, date)
  }

  const selected = useMemo(() => {
    const selected = getValues(name) || defaultValue || null

    return selected ? new Date(selected) : null
  }, [name, getValues(name)])

  console.log('selected', selected)
  if (readOnly)
    return (
      <div className='flex flex-col gap-2'>
        <Label id={name}>{t(label)}</Label>
        <Typography variant='body1' sx={{ fontWeight: 500 }}>
          {getValues(name) ? new Date(getValues(name)).toLocaleDateString(locale) : t('not_seted')}
        </Typography>
      </div>
    )

  return (
    <DatePickerWrapper>
      <Controller
        name={id}
        control={control}
        rules={{ required }}
        render={({ field, fieldState: { error } }) => (
          <div>
            <Label name={name}>{t(label)}</Label>
            <DatePicker
              {...field}
              {...register(name)}
              selected={selected}
              showYearDropdown
              showMonthDropdown
              disabled={readOnly}
              name={name}
              onChange={handleDateChange}
              customInput={
                <TextField error={!!error} name={name} helperText={error ? t(error.message) : null} fullWidth />
              }
              maxDate={maxDate ? new Date(maxDate) : undefined}
              placeholderText='DD-MM-YYYY'
              locale={locale}
              dateFormat='dd-MM-yyyy'
            />
          </div>
        )}
      />
    </DatePickerWrapper>
  )
}

export default DateTimePicker
