import { classNames } from 'src/@core/utils'
import React from 'react'

type Props = {
  name: string
  label: string
  value: string
  setValue: (value: string) => void
  color?: 'blue' | 'primary'
  rows?: number
  className?: string
  labelIcon?: any
}

function UTextarea({
  name,
  label,
  value,
  setValue,
  color = 'primary',
  rows = 4,
  className = '',
  labelIcon = null
}: Props) {
  return (
    <div>
      <label htmlFor={name} className='flex gap-3 items-center text-sm font-medium leading-6 text-gray-900'>
        {label}
        <span>{labelIcon}</span>
      </label>
      <div className='mt-2'>
        <textarea
          rows={rows}
          name={name}
          id={name}
          value={value}
          onChange={e => setValue(e.target.value)}
          className={classNames(
            `block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-${color}-600 sm:text-sm sm:leading-6`,
            className
          )}
          defaultValue={''}
        />
      </div>
    </div>
  )
}

export default UTextarea
