import { AnyObject } from 'src/@core/utils'
import { classNames } from 'src/@core/utils'
import React from 'react'

type Props = {
  name?: string
  label?: string
  value: string | number
  type?: 'text' | 'number'
  setValue?: (value: string | number) => void
  color?: 'blue' | 'primary'
  className?: string
  disabled?: boolean
} & AnyObject

function TextInput({
  name,
  label,
  value,
  setValue,
  color = 'primary',
  className = '',
  type = 'text',
  disabled = false,
  ...props
}: Props) {
  return (
    <div>
      {label && (
        <label htmlFor={name} className='block text-sm font-medium leading-6 text-gray-900'>
          {label}
        </label>
      )}
      <div className='mt-2'>
        <input
          {...props}
          type={type}
          name={name}
          id={name}
          readOnly={disabled}
          value={value}
          onChange={e => {
            setValue && setValue(e.target.value)
          }}
          className={classNames(
            `block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-${color}-600 sm:text-sm sm:leading-6`,
            disabled ? 'bg-gray-200 cursor-default' : '',
            className
          )}
        />
      </div>
    </div>
  )
}

export default TextInput
