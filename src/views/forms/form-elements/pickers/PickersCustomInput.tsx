// ** React Imports
import { forwardRef } from 'react'

// ** MUI Imports
import TextField from '@mui/material/TextField'

interface PickerProps {
  label?: string
  readOnly?: boolean
}

const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {
  // ** Props
  const { label, readOnly, error } = props

  return (
    <TextField
      inputRef={ref}
      {...props}
      label={label || ''}
      size='medium'
      {...(readOnly && { inputProps: { readOnly: true } })}
      error={error}
    />
  )
})

export default PickersComponent
