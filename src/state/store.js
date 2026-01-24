import { configureStore } from '@reduxjs/toolkit';
import auth from './features/authSlice';
import { rootApi } from './api/rootApi';
import vehiclesList from '@/containers/vehicles/vehicles-list/slice';
import vehicleEditor from '@/containers/vehicles/vehicles-editor/slice';
import vehicleRepairEditor from '@/containers/vehicles/vehicle-repairs/slice';
import vehicleRepairPartEditor from '@/containers/vehicles/vehicle-repair-parts/slice';

export const store = configureStore({
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(rootApi.middleware),
	reducer: {
		auth: auth.reducer,
		vehicleEditor: vehicleEditor.reducer,
		vehicleRepairEditor: vehicleRepairEditor.reducer,
		vehicleRepairPartEditor: vehicleRepairPartEditor.reducer,
		vehiclesList: vehiclesList.reducer,
		[rootApi.reducerPath]: rootApi.reducer
	}
});
