import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '@/components/app-layout/AppLayout.jsx';
import Login from '@/containers/Login.jsx';
import HomePage from '@/containers/HomePage.jsx';
import VehiclesList from '@/containers/vehicles/vehicles-list/VehiclesList.jsx';
import VehicleEditor from '@/containers/vehicles/vehicle-editor/VehicleEditor.jsx';
import StructuresList from '@/containers/structures/structures-list/StructuresList.jsx';
import StructureEditor from '@/containers/structures/structure-editor/StructureEditor.jsx';
import StructureRepairsList from '@/containers/structures/structure-repairs/structure-repairs-list/StructureRepairsList.jsx';
import StructureRepairEditor from '@/containers/structures/structure-repairs/StructureRepairEditor.jsx';
import StructureRepairPartsList from '@/containers/structures/structure-repair-parts/structure-repair-parts-list/StructureRepairPartsList.jsx';
import StructureRepairPartEditor from '@/containers/structures/structure-repair-parts/StructureRepairPartEditor.jsx';
import EquipmentEditor from '@/containers/equipment/equipment-editor/EquipmentEditor.jsx';
import EquipmentList from '@/containers/equipment/equipment-list/EquipmentList.jsx';
import EquipmentRepairsList from '@/containers/equipment/equipment-repairs/equipment-repairs-list/EquipmentRepairsList.jsx';
import EquipmentRepairEditor from '@/containers/equipment/equipment-repairs/equipment-repairs-editor/EquipmentRepairEditor.jsx';
import EquipmentRepairPartsList from '@/containers/equipment/equipment-repair-parts/equipment-repair-parts-list/EquipmentRepairPartsList.jsx';
import EquipmentRepairPartEditor from '@/containers/equipment/equipment-repair-parts/EquipmentRepairPartEditor.jsx';
import VehicleRepairsList from '@/containers/vehicles/vehicle-repairs/vehicle-repairs-list/VehicleRepairsList.jsx';
import VehicleRepairEditor from '@/containers/vehicles/vehicle-repairs/vehicle-repairs-editor/VehicleRepairEditor.jsx';
import VehicleRepairPartsList from '@/containers/vehicles/vehicle-repair-parts/vehicle-repair-parts-list/VehicleRepairPartsList.jsx';
import VehicleRepairPartEditor from '@/containers/vehicles/vehicle-repair-parts/vehicle-repair-parts-editor/VehicleRepairPartEditor.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import NotFoundPage from '@/containers/NotFoundPage.jsx';
import React from 'react';

const router = createBrowserRouter([
	{
		element: <Login />,
		path: '/login'
	},
	{
		children: [
			{
				element: <HomePage />,
				index: true
			},
			{
				children: [
					{
						element: <VehicleEditor />,
						path: 'create'
					},
					{
						element: <VehicleEditor />,
						path: ':vehicleId/edit'
					},
					{
						children: [
							{
								element: <VehicleRepairEditor />,
								path: 'create'
							},
							{
								element: <VehicleRepairEditor />,
								path: ':repairId/edit'
							},
							{
								children: [
									{
										element: <VehicleRepairPartEditor />,
										path: 'create'
									},
									{
										element: <VehicleRepairPartEditor />,
										path: ':partId/edit'
									}
								],
								element: <VehicleRepairPartsList />,
								path: ':repairId/parts'
							}
						],
						element: <VehicleRepairsList />,
						path: ':vehicleId/repairs'
					}
				],
				element: <VehiclesList />,
				path: '/vehicles'
			},
			{
				children: [
					{
						element: <StructureEditor />,
						path: 'create'
					},
					{
						element: <StructureEditor />,
						path: ':structureId/edit'
					},
					{
						children: [
							{
								element: <StructureRepairEditor />,
								path: 'create'
							},
							{
								element: <StructureRepairEditor />,
								path: ':repairId/edit'
							},
							{
								children: [
									{
										element: <StructureRepairPartEditor />,
										path: 'create'
									},
									{
										element: <StructureRepairPartEditor />,
										path: ':partId/edit'
									}
								],
								element: <StructureRepairPartsList />,
								path: ':repairId/parts'
							}
						],
						element: <StructureRepairsList />,
						path: ':structureId/repairs'
					}
				],
				element: <StructuresList />,
				path: '/structures'
			},
			{
				children: [
					{
						element: <EquipmentEditor />,
						path: 'create'
					},
					{
						element: <EquipmentEditor />,
						path: ':equipmentId/edit'
					},
					{
						children: [
							{
								element: <EquipmentRepairEditor />,
								path: 'create'
							},
							{
								element: <EquipmentRepairEditor />,
								path: ':repairId/edit'
							},
							{
								children: [
									{
										element: <EquipmentRepairPartEditor />,
										path: 'create'
									},
									{
										element: <EquipmentRepairPartEditor />,
										path: ':partId/edit'
									}
								],
								element: <EquipmentRepairPartsList />,
								path: ':repairId/parts'
							}
						],
						element: <EquipmentRepairsList />,
						path: ':equipmentId/repairs'
					}
				],
				element: <EquipmentList />,
				path: '/equipment'
			},
			{
				element: (
					<ProtectedRoute>
						<NotFoundPage />
					</ProtectedRoute>
				),
				path: '*'
			}
		],
		element: (
			<ProtectedRoute>
				<AppLayout />
			</ProtectedRoute>
		),
		path: '/'
	}
]);

export default router;
