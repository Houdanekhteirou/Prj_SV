// ** React Imports
import { ReactNode } from 'react'

// ** Types
import { NavGroup } from 'src/@core/layouts/types'
import { hasPermission } from 'src/@core/utils'
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  navGroup?: NavGroup
  children: ReactNode
}

const CanViewNavGroup = (props: Props) => {
  // ** Props
  const { children, navGroup } = props
  const auth = useAuth()

  // {
  //   title: 'Elements',
  //   icon: 'grommet-icons:indicator',
  //   requiredPermissions: [PERMISSIONS.element.read, PERMISSIONS.element.read],
  //   children: [
  //     {
  //       title: 'Elements',
  //       path: '/admin/data/elements',
  //       requiredPermissions: [PERMISSIONS.element.read]
  //     },
  //     {
  //       title: 'element_groups',
  //       path: '/admin/data/elements-groups',
  //       requiredPermissions: [PERMISSIONS.element.read]
  //     }
  //   ]
  // },

  if (!navGroup?.requiredPermissions) {
    return <>{children}</>
  }
  const canViewGroup = hasPermission(navGroup?.requiredPermissions, auth.user.authorities)

  if (canViewGroup) {
    return <>{children}</>
  }

  return null
}

export default CanViewNavGroup
