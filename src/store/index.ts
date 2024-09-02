// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import permissions from 'src/store/apps/permissions'
import user from 'src/store/apps/user'

export const store = configureStore({
  reducer: {
    user,
    permissions
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
