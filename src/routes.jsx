import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '@/components/app-layout/AppLayout.jsx';
import Login from '@/containers/Login.jsx';
import HomePage from '@/containers/HomePage.jsx';
import VehiclesList from '@/containers/vehicles/vehicles-list/VehiclesList.jsx';
import VehicleEditor from '@/containers/vehicles/vehicles-editor/VehicleEditor.jsx';
// import StructuresList from "@/containers/StructuresList.jsx";
// import EquipmentList from "@/containers/EquipmentList.jsx";
import VehicleRepairsList from '@/containers/vehicles/vehicle-repairs/VehicleRepairsList.jsx';
import VehicleRepairEditor from '@/containers/vehicles/vehicle-repairs/VehicleRepairEditor.jsx';
import VehicleRepairPartsList from '@/containers/vehicles/vehicle-repair-parts/VehicleRepairPartsList.jsx';
import VehicleRepairPartEditor from '@/containers/vehicles/vehicle-repair-parts/VehicleRepairPartEditor.jsx';
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
			// {
			//     path: "/structures",
			//     element: <StructuresList />,
			//     children: [
			//         {
			//             path: "create",
			//             element: <StructureEditor />
			//         },
			//         {
			//             path: ":structureId/edit",
			//             element: <StructureEditor />
			//         },
			//         {
			//           path: ":structureId/repairs",
			//           element: <StructureRepairsList />
			//         },
			//         {
			//           path: ":structureId/repairs/create",
			//           element: <StructureRepairEditor />
			//         },
			//         {
			//           path: ":structureId/repairs/:repairId/edit",
			//           element: <StructureRepairEditor />
			//         },
			//         {
			//           path: ":structureId/repairs/:repairId/parts",
			//           element: <StructureRepairPartsList />
			//         },
			//         {
			//           path: ":structureId/repairs/:repairId/parts/create",
			//           element: <StructureRepairPartEditor />
			//         },
			//         {
			//           path: ":structureId/repairs/:repairId/parts/:partId/edit",
			//           element: <StructureRepairPartEditor />
			//         }
			//     ]
			// },
			// {
			//     path: "/equipment",
			//     element: <EquipmentList />,
			//     children: [
			//         {
			//             path: "create",
			//             element: <EquipmentEditor />
			//         },
			//         {
			//             path: ":equipmentId/edit",
			//             element: <EquipmentEditor />
			//         },
			//         {
			//           path: ":equipmentId/repairs",
			//           element: <EquipmentRepairsList />
			//         },
			//         {
			//           path: ":equipmentId/repairs/create",
			//           element: <EquipmentRepairEditor />
			//         },
			//         {
			//           path: ":equipmentId/repairs/:repairId/edit",
			//           element: <EquipmentRepairEditor />
			//         },
			//         {
			//           path: ":equipmentId/repairs/:repairId/parts",
			//           element: <EquipmentRepairPartsList />
			//         },
			//         {
			//           path: ":equipmentId/repairs/:repairId/parts/create",
			//           element: <EquipmentRepairPartEditor />
			//         },
			//         {
			//           path: ":equipmentId/repairs/:repairId/parts/:partId/edit",
			//           element: <EquipmentRepairPartEditor />
			//         }
			//     ]
			// },
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
