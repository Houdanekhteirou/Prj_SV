'use client'
import { TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { classNames } from 'src/@core/utils'
import Label from './Label'

type Props = {
  name: string
  type: 'number' | 'text' | 'password'
  label: string
  readOnly?: boolean
  placeholder?: string
  autoComplete?: string
}

const Textarea = ({ name, type, label, readOnly, placeholder, autoComplete }: Props) => {
  const {
    control,
    register,
    formState: { errors }
  } = useFormContext()

  const { t } = useTranslation()

  // const defaultValue = useMemo(() => {
  //   return getValues()[name];
  // }, [name]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <Label id={name}>{label}</Label>

          <TextField
            {...register(name)}
            id={name}
            {...field}
            multiline
            maxRows={4}
            rows={4}
            disabled={readOnly}
            autoComplete={autoComplete}
            className={classNames(
              'block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6',
              error ? 'ring-red-500 focus:ring-red-600' : '',
              readOnly ? 'bg-gray-200' : ''
            )}
            placeholder={placeholder || label}
          />
          {error && <p className='text-red-500 mt-0.5 text-sm'>{t(error.message)}</p>}
        </div>
      )}
    />
  )
}

export default Textarea
