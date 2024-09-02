// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'
import authConfig from 'src/configs/auth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (auth.user === null && !window.localStorage.getItem(authConfig.userStorangeKeyName)) {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath !== '/' ? router.asPath : undefined }
      })
    }
  }, [auth.user, router])

  // if (auth.loading || auth.user === null) {
  //   return fallback
  // }

  return <>{children}</>
}

export default AuthGuard
