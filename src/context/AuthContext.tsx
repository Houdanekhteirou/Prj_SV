// ** React Imports
import { ReactNode, createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { authenticate } from 'src/api/auth'
import { AuthValuesType, ErrCallbackType, LoginParams, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  loginLoading: false,
  zones: []
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [loginLoading, setLoginLoading] = useState<boolean>(defaultProvider.loginLoading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!

      if (storedToken) {
        setLoading(true)
        setUser(JSON.parse(window.localStorage.getItem(authConfig.userStorangeKeyName)!) as UserDataType)
        setLoading(false)

        return
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.userData })
          })
          .catch(() => {
            localStorage.removeItem(authConfig.userStorangeKeyName)
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    setLoginLoading(true)
    authenticate(params)
      .then(async response => {
        if (!response.success || !response.token) {
          errorCallback ? errorCallback(response) : null

          return
        }
        const userData = {
          id: response.account.id,
          role: 'admin',
          password: 'admin',
          fullName: response.account.firstName + ' ' + response.account.lastName,
          username: response.account.login,
          email: response.account.email,
          authorities: response.account.authorities,
          zones: response.userZones
        }
        params.rememberMe ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.token) : null
        const returnUrl = router.query.returnUrl
        params.rememberMe ? window.localStorage.setItem(authConfig.userStorangeKeyName, JSON.stringify(userData)) : null

        setUser(userData)
        setLoginLoading(false)

        const redirectURL = returnUrl && returnUrl !== '/admin' ? returnUrl : '/admin'

        router.replace(redirectURL as string)
      })

      .catch(err => {
        setLoginLoading(false)
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem(authConfig.userStorangeKeyName)
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.replace('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    loginLoading
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
