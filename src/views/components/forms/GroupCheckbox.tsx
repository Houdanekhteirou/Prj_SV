'use client'
import React from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import Label from './Label'
import { useTranslation } from 'react-i18next'

type CheckboxGroupProps = {
  name: string
  label: string
  readOnly: boolean
  options: CheckboxOption[]
}

type CheckboxOption = {
  label: string
  value: string
}

const gray200 = '#e5e7eb'
const red500 = '#ef4444'

const CheckboxGroup = ({ name, label, options, readOnly }: CheckboxGroupProps) => {
  const { control, register } = useFormContext()
  const selectedValues = useWatch({ name }) || [] // Initialize with an empty array

  const { t } = useTranslation()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { name, onChange, onBlur } }) => (
        <div>
          <Label id={name}>{t(label)}</Label>
          <div>
            {options.map(option => (
              <div key={option.value} className='flex items-center mt-2'>
                <input
                  type='checkbox'
                  {...register(`${name}.${option.value}`)}
                  checked={selectedValues?.includes(option.value)}
                  onChange={e => {
                    const isChecked = e.target.checked
                    const valueToAddOrRemove = option.value
                    const newSelectedValues = isChecked
                      ? [...selectedValues, valueToAddOrRemove]
                      : selectedValues.filter(value => value !== valueToAddOrRemove)
                    onChange(newSelectedValues)
                  }}
                  disabled={readOnly}
                />
                <label className='ml-2'>{option.label}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  )
}

export default CheckboxGroup
