import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';

const AppLayout = lazy(() => import('@/components/app-layout/AppLayout.jsx'));
const Login = lazy(() => import('@/containers/login/Login.jsx'));
const HomePage = lazy(() => import('@/containers/HomePage.jsx'));
const VehiclesList = lazy(() => import('@/containers/vehicles/vehicles-list/VehiclesList.jsx'));
const VehicleEditor = lazy(() => import('@/containers/vehicles/vehicle-editor/VehicleEditor.jsx'));
const VehicleRepairsList = lazy(() => import('@/containers/vehicles/vehicle-repairs/vehicle-repairs-list/VehicleRepairsList.jsx'));
const VehicleRepairEditor = lazy(() => import('@/containers/vehicles/vehicle-repairs/vehicle-repairs-editor/VehicleRepairEditor.jsx'));
const VehicleRepairPartsList = lazy(() => import('@/containers/vehicles/vehicle-repair-parts/vehicle-repair-parts-list/VehicleRepairPartsList.jsx'));
const VehicleRepairPartEditor = lazy(() => import('@/containers/vehicles/vehicle-repair-parts/vehicle-repair-parts-editor/VehicleRepairPartEditor.jsx'));
const StructuresList = lazy(() => import('@/containers/structures/structures-list/StructuresList.jsx'));
const StructureEditor = lazy(() => import('@/containers/structures/structure-editor/StructureEditor.jsx'));
const StructureRepairsList = lazy(() => import('@/containers/structures/structure-repairs/structure-repairs-list/StructureRepairsList.jsx'));
const StructureRepairEditor = lazy(() => import('@/containers/structures/structure-repairs/StructureRepairEditor.jsx'));
const StructureRepairPartsList = lazy(() => import('@/containers/structures/structure-repair-parts/structure-repair-parts-list/StructureRepairPartsList.jsx'));
const StructureRepairPartEditor = lazy(() => import('@/containers/structures/structure-repair-parts/StructureRepairPartEditor.jsx'));
const EquipmentList = lazy(() => import('@/containers/equipment/equipment-list/EquipmentList.jsx'));
const EquipmentEditor = lazy(() => import('@/containers/equipment/equipment-editor/EquipmentEditor.jsx'));
const EquipmentRepairsList = lazy(() => import('@/containers/equipment/equipment-repairs/equipment-repairs-list/EquipmentRepairsList.jsx'));
const EquipmentRepairEditor = lazy(() => import('@/containers/equipment/equipment-repairs/equipment-repairs-editor/EquipmentRepairEditor.jsx'));
const EquipmentRepairPartsList = lazy(() => import('@/containers/equipment/equipment-repair-parts/equipment-repair-parts-list/EquipmentRepairPartsList.jsx'));
const EquipmentRepairPartEditor = lazy(() => import('@/containers/equipment/equipment-repair-parts/EquipmentRepairPartEditor.jsx'));
const NotFoundPage = lazy(() => import('@/containers/NotFoundPage.jsx'));

const RouteLoader = () => (
	<Box
		sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: '40vh' }}>
		<CircularProgress />
	</Box>
);

const withSuspense = (element) => (
	<Suspense fallback={<RouteLoader />}>
		{element}
	</Suspense>
);

const router = createBrowserRouter([
	{
		element: withSuspense(<Login />),
		path: '/login'
	},
	{
		children: [
			{
				element: withSuspense(<HomePage />),
				index: true
			},
			{
				children: [
					{
						element: withSuspense(<VehicleEditor />),
						path: 'create'
					},
					{
						element: withSuspense(<VehicleEditor />),
						path: ':vehicleId/edit'
					},
					{
						children: [
							{
								element: withSuspense(<VehicleRepairEditor />),
								path: 'create'
							},
							{
								element: withSuspense(<VehicleRepairEditor />),
								path: ':repairId/edit'
							},
							{
								children: [
									{
										element: withSuspense(<VehicleRepairPartEditor />),
										path: 'create'
									},
									{
										element: withSuspense(<VehicleRepairPartEditor />),
										path: ':partId/edit'
									}
								],
								element: withSuspense(<VehicleRepairPartsList />),
								path: ':repairId/parts'
							}
						],
						element: withSuspense(<VehicleRepairsList />),
						path: ':vehicleId/repairs'
					}
				],
				element: withSuspense(<VehiclesList />),
				path: '/vehicles'
			},
			{
				children: [
					{
						element: withSuspense(<StructureEditor />),
						path: 'create'
					},
					{
						element: withSuspense(<StructureEditor />),
						path: ':structureId/edit'
					},
					{
						children: [
							{
								element: withSuspense(<StructureRepairEditor />),
								path: 'create'
							},
							{
								element: withSuspense(<StructureRepairEditor />),
								path: ':repairId/edit'
							},
							{
								children: [
									{
										element: withSuspense(<StructureRepairPartEditor />),
										path: 'create'
									},
									{
										element: withSuspense(<StructureRepairPartEditor />),
										path: ':partId/edit'
									}
								],
								element: withSuspense(<StructureRepairPartsList />),
								path: ':repairId/parts'
							}
						],
						element: withSuspense(<StructureRepairsList />),
						path: ':structureId/repairs'
					}
				],
				element: withSuspense(<StructuresList />),
				path: '/structures'
			},
			{
				children: [
					{
						element: withSuspense(<EquipmentEditor />),
						path: 'create'
					},
					{
						element: withSuspense(<EquipmentEditor />),
						path: ':equipmentId/edit'
					},
					{
						children: [
							{
								element: withSuspense(<EquipmentRepairEditor />),
								path: 'create'
							},
							{
								element: withSuspense(<EquipmentRepairEditor />),
								path: ':repairId/edit'
							},
							{
								children: [
									{
										element: withSuspense(<EquipmentRepairPartEditor />),
										path: 'create'
									},
									{
										element: withSuspense(<EquipmentRepairPartEditor />),
										path: ':partId/edit'
									}
								],
								element: withSuspense(<EquipmentRepairPartsList />),
								path: ':repairId/parts'
							}
						],
						element: withSuspense(<EquipmentRepairsList />),
						path: ':equipmentId/repairs'
					}
				],
				element: withSuspense(<EquipmentList />),
				path: '/equipment'
			},
			{
				element: (
					<ProtectedRoute>
						{withSuspense(<NotFoundPage />)}
					</ProtectedRoute>
				),
				path: '*'
			}
		],
		element: (
			<ProtectedRoute>
				{withSuspense(<AppLayout />)}
			</ProtectedRoute>
		),
		path: '/'
	}
]);

export default router;
