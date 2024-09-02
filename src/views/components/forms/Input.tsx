'use client'
import { TextField, Typography } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ChangeEvent, FormField } from 'src/@core/utils'
import Label from './Label'

type Props = {
  name: string
  type: FormField['type']
  label: string
  readOnly?: boolean
  placeholder?: string
  autoComplete?: string
  initialValue?: string | number
  resultOf?: {
    type: 'multiplication' | 'addition' | 'soustraction' | 'percentage'
    fields: { a: string; b: string }
  }
  noLabel?: boolean
  waitFor?: string
  handleChange?: (value: boolean) => void
}

// New prop for handling checkbox state change

const Input = ({
  name,
  type,
  label,
  readOnly,
  placeholder,
  autoComplete,
  initialValue,
  resultOf,
  noLabel,
  waitFor,
  handleChange
}: Props) => {
  const {
    control,
    register,
    formState: { errors },
    getValues,
    setValue
  } = useFormContext()

  const { t } = useTranslation()
  const awaitedValue = useWatch({
    name: waitFor
  })
  const fieldA = useWatch({ name: resultOf?.fields.a }) || 0
  const fieldB = useWatch({ name: resultOf?.fields.b }) || 0

  useEffect(() => {
    if (!resultOf) return
    if (resultOf.type === 'multiplication') {
      setValue(name, parseFloat(fieldA) * parseFloat(fieldB))
    } else if (resultOf.type === 'addition') {
      setValue(name, fieldA + fieldB)
    } else if (resultOf.type === 'soustraction') {
      setValue(name, fieldA - fieldB)
    } else if (resultOf.type === 'percentage') {
      setValue(name, (fieldA * 100) / fieldB)
    }
  }, [fieldA, fieldB, name])

  const shouldWait = useMemo(() => !!waitFor && !awaitedValue, [waitFor, awaitedValue])

  // Adjusted handling for checkboxes
  const handleCheckboxChange = (e: ChangeEvent) => {
    const checkboxValue = e.target.checked
    setValue(name, checkboxValue)
  }

  if (readOnly)
    return (
      <div className='flex flex-col gap-2'>
        <Label id={name}>{t(label)}</Label>
        <Typography variant='body1' sx={{ fontWeight: 500 }}>
          {getValues(name) || t('not_seted')}
        </Typography>
      </div>
    )

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={initialValue}
      render={({ field, fieldState: { error } }) => (
        <div>
          {!noLabel && <Label id={name}>{t(label)}</Label>}

          <TextField
            {...register(name)}
            id={name}
            {...field}
            onChange={e =>
              type === 'checkbox'
                ? handleCheckboxChange(e)
                : handleChange
                ? handleChange(e.target.value)
                : field.onChange(e.target.value)
            }
            size='medium'
            disabled={readOnly || shouldWait}
            type={type}
            checked={field.value}
            autoComplete={'off'}
            fullWidth
            onKeyDown={e => {
              // Prevent arrow key input
              if (e.keyCode === 38 || e.keyCode === 40) {
                e.preventDefault()
              }
            }}
            // label={type === 'date' ? '' : t(label)}
          />
          {error && <p className='text-red-500 mt-0.5 text-sm'>{t(error.message)}</p>}
        </div>
      )}
    />
  )
}

export default Input
