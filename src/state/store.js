import { configureStore } from '@reduxjs/toolkit';
import auth from './features/authSlice';
import notification from './features/notificationSlice';
import { rootApi } from './api/rootApi';
import equipmentEditor from '@/containers/equipment/equipment-editor/slice';
import equipmentList from '@/containers/equipment/equipment-list/slice';
import equipmentRepairEditor from '@/containers/equipment/equipment-repairs/slice';
import equipmentRepairPartEditor from '@/containers/equipment/equipment-repair-parts/slice';
import structuresList from '@/containers/structures/structures-list/slice';
import structureEditor from '@/containers/structures/structure-editor/slice';
import structureRepairEditor from '@/containers/structures/structure-repairs/slice';
import structureRepairPartEditor from '@/containers/structures/structure-repair-parts/slice';
import vehiclesList from '@/containers/vehicles/vehicles-list/slice';
import vehicleEditor from '@/containers/vehicles/vehicle-editor/slice';
import vehicleRepairEditor from '@/containers/vehicles/vehicle-repairs/slice';
import vehicleRepairPartEditor from '@/containers/vehicles/vehicle-repair-parts/slice';

export const store = configureStore({
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(rootApi.middleware),
	reducer: {
		auth: auth.reducer,
		equipmentEditor: equipmentEditor.reducer,
		equipmentList: equipmentList.reducer,
		equipmentRepairEditor: equipmentRepairEditor.reducer,
		equipmentRepairPartEditor: equipmentRepairPartEditor.reducer,
		notification: notification,
		structureEditor: structureEditor.reducer,
		structureRepairEditor: structureRepairEditor.reducer,
		structureRepairPartEditor: structureRepairPartEditor.reducer,
		structuresList: structuresList.reducer,
		vehicleEditor: vehicleEditor.reducer,
		vehicleRepairEditor: vehicleRepairEditor.reducer,
		vehicleRepairPartEditor: vehicleRepairPartEditor.reducer,
		[rootApi.reducerPath]: rootApi.reducer,
		vehiclesList: vehiclesList.reducer
	}
});
