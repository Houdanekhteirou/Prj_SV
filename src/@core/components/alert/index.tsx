import { Icon } from '@iconify/react'
import { Alert, IconButton } from '@mui/material'

export const AlertCompnent = ({ message, setMessage }) => {
  return message ? (
    <Alert
      severity='error'
      action={
        <IconButton
          size='small'
          color='inherit'
          aria-label='close'
          onClick={e => {
            e.preventDefault()
            setMessage(null)
          }}
        >
          <Icon icon='mdi:close' fontSize='inherit' />
        </IconButton>
      }
    >
      {message}
    </Alert>
  ) : (
    <></>
  )
}
