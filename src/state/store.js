import { configureStore } from '@reduxjs/toolkit';
import auth from './features/authSlice';
import notification from './features/notificationSlice';
import { rootApi } from './api/rootApi';
import equipmentEditor from '@/containers/equipment/equipment-editor/slice';
import equipmentList from '@/containers/equipment/equipment-list/slice';
import equipmentRepairEditor from '@/containers/equipment/equipment-repairs/equipment-repairs-editor/slice';
import equipmentRepairsList from '@/containers/equipment/equipment-repairs/equipment-repairs-list/slice';
import equipmentRepairPartEditor from '@/containers/equipment/equipment-repair-parts/slice';
import equipmentRepairPartsList from '@/containers/equipment/equipment-repair-parts/equipment-repair-parts-list/slice';
import structuresList from '@/containers/structures/structures-list/slice';
import structureEditor from '@/containers/structures/structure-editor/slice';
import structureRepairEditor from '@/containers/structures/structure-repairs/slice';
import structureRepairsList from '@/containers/structures/structure-repairs/structure-repairs-list/slice';
import structureRepairPartEditor from '@/containers/structures/structure-repair-parts/slice';
import structureRepairPartsList from '@/containers/structures/structure-repair-parts/structure-repair-parts-list/slice';
import vehiclesList from '@/containers/vehicles/vehicles-list/slice';
import vehicleEditor from '@/containers/vehicles/vehicle-editor/slice';
import vehicleRepairEditor from '@/containers/vehicles/vehicle-repairs/vehicle-repairs-editor/slice';
import vehicleRepairsList from '@/containers/vehicles/vehicle-repairs/vehicle-repairs-list/slice';
import vehicleRepairPartEditor from '@/containers/vehicles/vehicle-repair-parts/vehicle-repair-parts-editor/slice';
import vehicleRepairPartsList from '@/containers/vehicles/vehicle-repair-parts/vehicle-repair-parts-list/slice';

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
		equipmentRepairPartsList: equipmentRepairPartsList.reducer,
		equipmentRepairsList: equipmentRepairsList.reducer,
		notification: notification,
		structureEditor: structureEditor.reducer,
		structureRepairEditor: structureRepairEditor.reducer,
		structureRepairPartEditor: structureRepairPartEditor.reducer,
		structureRepairPartsList: structureRepairPartsList.reducer,
		structureRepairsList: structureRepairsList.reducer,
		structuresList: structuresList.reducer,
		vehicleEditor: vehicleEditor.reducer,
		vehicleRepairEditor: vehicleRepairEditor.reducer,
		vehicleRepairPartEditor: vehicleRepairPartEditor.reducer,
		vehicleRepairPartsList: vehicleRepairPartsList.reducer,
		vehicleRepairsList: vehicleRepairsList.reducer,
		[rootApi.reducerPath]: rootApi.reducer,
		vehiclesList: vehiclesList.reducer
	}
});
