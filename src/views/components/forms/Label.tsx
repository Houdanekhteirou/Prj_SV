'use client'

import { FormLabel } from '@mui/material'

function Label({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <FormLabel htmlFor={id} className='block text-sm font-medium leading-6 text-gray-700 capitalize'>
      {children}
    </FormLabel>
  )
}

export default Label
