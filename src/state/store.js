import { configureStore } from '@reduxjs/toolkit'
import auth from './features/authSlice'
import { apiSlice } from './api/apiSlice'
import { vehicleApi } from './vehicles/slice'
import { structureApi } from './api/structureApi'
import { equipmentApi } from './api/equipmentApi'
import { currenciesApi } from './currencies/slice'
import vehiclesList from '@/containers/vehicles/vehicles-list/slice';
import vehicleEditor from '@/containers/vehicles/vehicles-editor/slice';

export const store = configureStore({
  reducer: {
    auth: auth.reducer,
    vehiclesList: vehiclesList.reducer,
    vehicleEditor: vehicleEditor.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [vehicleApi.reducerPath]: vehicleApi.reducer,
    [structureApi.reducerPath]: structureApi.reducer,
    [equipmentApi.reducerPath]: equipmentApi.reducer,
    [currenciesApi.reducerPath]: currenciesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(vehicleApi.middleware)
      .concat(structureApi.middleware)
      .concat(equipmentApi.middleware)
      .concat(currenciesApi.middleware)
})
