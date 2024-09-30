// AddButton.js
import React from 'react'
import { Button } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { hasPermission } from 'src/@core/utils'
import { useAuth } from 'src/hooks/useAuth'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

const AddButton = ({ requiredPermissions, text = 'Neew', ...props }) => {
  const router = useRouter()
  const pathname = usePathname()
  const auth = useAuth()
  // const { authorities } = auth.user
  const { t } = useTranslation()

  return (
    <Link href={`${pathname}/form?mode=create`} passHref>
      <Button
        variant='contained'
        size='large'
        color='primary'
        style={{
          // display: !hasPermission(authorities, requiredPermissions) ? 'none' : 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Icon icon='mdi:plus' fontSize={20} />
        {t(text)}
      </Button>
    </Link>
  )
}

export default AddButton
