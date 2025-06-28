import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { authApi } from './api/authApi'
import { userApi } from './api/userApi'
import { projectApi } from './api/projectApi'
import { taskApi } from './api/taskApi'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    authApi.middleware, 
    userApi.middleware,
    projectApi.middleware,
    taskApi.middleware
  )
})

setupListeners(store.dispatch)