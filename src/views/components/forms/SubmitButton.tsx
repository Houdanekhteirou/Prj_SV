'use client'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

const SubmitButton = ({
  label = 'submit',
  disabled = false,
  hidden = false,
  onSubmit = () => null
}: {
  label?: string
  disabled?: boolean
  hidden?: boolean
  loading?: boolean
  onSubmit?: () => void
  fullWidth?: boolean
  className?: string
}) => {
  const { t } = useTranslation()
  if (hidden) return null

  return (
    <Button
      variant='contained'
      color='primary'
      type='submit'
      size='medium'
      disabled={disabled}
      onClick={(e: any) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      {t(label)}{' '}
    </Button>
  )
}

export default SubmitButton
