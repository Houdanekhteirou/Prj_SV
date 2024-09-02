'use client'
import { classNames } from 'src/@core/utils'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import Label from './Label'
import { FormEvent, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ChangeEvent, FormField } from 'src/@core/utils'
import { Checkbox as Check } from '@mui/material'
import { Icon } from '@iconify/react'

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

const Checkbox = ({
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

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={initialValue}
      render={({ field, fieldState: { error } }) => (
        <div>
          {!noLabel && <Label id={name}>{t(label)}</Label>}
          <Check
            {...register(name)}
            {...field}
            onChange={e => (handleChange ? handleChange(e.target.checked) : field.onChange(e.target.checked))}
            checkedIcon={<Icon icon='mdi:checkbox-marked' fontSize={30} />}
            icon={<Icon icon='mdi:checkbox-blank-outline' fontSize={30} />}
            disabled={readOnly || shouldWait}
            checked={field.value}
            size='medium'
          />
          {error && <p className='text-red-500 mt-0.5 text-sm'>{t(error.message)}</p>}
        </div>
      )}
    />
  )
}

export default Checkbox
