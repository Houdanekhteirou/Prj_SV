import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useAuth } from 'src/hooks/useAuth'
import Error401 from 'src/pages/401'
import FallbackSpinner from '../spinner'
import { ACLObj } from 'src/configs/acl'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  requiredPermissions: string[] | ACLObj | string | null
}
const AclGuard: React.FC<AclGuardProps> = props => {
  const auth = useAuth()
  const router = useRouter()

  const { requiredPermissions, children, guestGuard = false, authGuard = true } = props

  // if (auth.loading) {
  //   return <FallbackSpinner />
  // }

  // if (guestGuard || router.route === '/404' || router.route === '/500' || !authGuard || router.route === '/login') {
  //   return <>{children}</>
  // }

  // const hasPermissions = () => {
  //   if (!auth || !auth.user?.authorities) return false

  //   if (!requiredPermissions || requiredPermissions.length <= 0) return true

  //   return requiredPermissions.some(permission => auth.user.authorities.includes(permission))
  // }

  // if (!hasPermissions()) {
  //   return (
  //     <BlankLayout>
  //       <Error401 />
  //     </BlankLayout>
  //   )
  // }

  // Render the route/component if user has required permissions
  return <>{props.children}</>
}

export default AclGuard
