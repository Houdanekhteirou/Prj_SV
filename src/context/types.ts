export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  username: string
  password: string
  rememberMe?: boolean
}

export type RegisterParams = {
  name: string
  password: string
  email: string
  role_id: number
}

export type UserDataType = {
  id: number
  authorities: string[]
  role: string
  email: string
  fullName: string
  username: string
  zones?: any
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  loginLoading: boolean
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}
