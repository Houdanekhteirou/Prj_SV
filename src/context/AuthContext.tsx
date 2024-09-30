import { ReactNode, createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { authenticate, register as apiRegister } from 'src/api/auth'
import { AuthValuesType, ErrCallbackType, LoginParams, UserDataType, RegisterParams } from './types'

// ** Default values
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  loginLoading: false,
  register: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [loginLoading, setLoginLoading] = useState<boolean>(defaultProvider.loginLoading)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem('token')

      if (storedToken) {
        setLoading(true)
        setUser(JSON.parse(window.localStorage.getItem('user')!) as UserDataType)
        setLoading(false)
      } else {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    setLoginLoading(true)
    authenticate(params)
      .then(response => {
        if (!response.success || !response.token) {
          errorCallback?.(response)
          return
        }

        // Save token and user in localStorage
        window.localStorage.setItem('token', response.token)
        const userData = { role: response.role, userId: response.userId, email: response.email }
        window.localStorage.setItem('user', JSON.stringify(userData))

        setUser(userData)
        setLoginLoading(false)

        router.replace('/admin')
      })
      .catch(err => {
        setLoginLoading(false)
        errorCallback?.(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('user')
    window.localStorage.removeItem('token')
    router.replace('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    setLoginLoading(true)
    apiRegister(params)
      .then(response => {
        if (!response.success || !response.token) {
          errorCallback?.(response)
          return
        }

        // Save token and user in localStorage after successful registration
        window.localStorage.setItem('token', response.token)
        const userData = { role: response.role, userId: response.userId, email: response.email }
        window.localStorage.setItem('user', JSON.stringify(userData))

        setUser(userData)
        setLoginLoading(false)

        // Redirect to dashboard or wherever after registration
        router.replace('/dashboard')
      })
      .catch(err => {
        setLoginLoading(false)
        errorCallback?.(err)
      })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    loginLoading,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
