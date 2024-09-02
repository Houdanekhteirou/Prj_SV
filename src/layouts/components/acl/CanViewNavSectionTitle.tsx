// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Types
import { NavSectionTitle } from 'src/@core/layouts/types'
import { hasPermission } from 'src/@core/utils'
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  children: ReactNode
  navTitle?: NavSectionTitle
}

const CanViewNavSectionTitle = (props: Props) => {
  // ** Props
  const { children, navTitle } = props
  const auth = useAuth()
  if (auth.loading) return null
  if (!navTitle?.requiredPermissions) return <>{children}</>

  if (navTitle && navTitle.auth === false) {
    return <>{children}</>
  } else {
    return hasPermission(navTitle?.requiredPermissions, auth.user?.authorities) ? <>{children}</> : null
  }
}

export default CanViewNavSectionTitle
