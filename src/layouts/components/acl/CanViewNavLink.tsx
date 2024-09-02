// ** React Imports
import { ReactNode } from 'react'

// ** Component Imports

// ** Types
import { NavLink } from 'src/@core/layouts/types'
import { hasPermission } from 'src/@core/utils'
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  navLink?: NavLink
  children: ReactNode
}

const CanViewNavLink = (props: Props) => {
  // ** Props
  const { children, navLink } = props

  const auth = useAuth()
  if (auth.loading) return null

  if (!navLink?.requiredPermissions) return <>{children}</>

  if (navLink && navLink.auth === false) {
    return <>{children}</>
  } else {
    return hasPermission(auth.user.authorities, navLink?.requiredPermissions) ? <>{children}</> : null
  }
}

export default CanViewNavLink
