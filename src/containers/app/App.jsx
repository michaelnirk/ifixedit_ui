import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from '@/components/app-layout/AppLayout.jsx';
import Login from "@/containers/Login.jsx";
import VehiclesList from "@/containers/vehicles/vehicles-list/VehiclesList.jsx";
import VehicleEditor from "@/containers/vehicles/vehicles-editor/VehicleEditor.jsx";
import StructuresList from "@/containers/StructuresList.jsx";
import EquipmentList from "@/containers/EquipmentList.jsx";
// import RepairsList from "@/containers/RepairsList.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import NotFoundPage from "@/containers/NotFoundPage.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
        {
            path: "/vehicles",
            element: <VehiclesList />,
            children: [
                {
                    path: "create",
                    element: <VehicleEditor />
                },
                {
                    path: ":id/edit",
                    element: <VehicleEditor />
                }
            ]
        },
        {
            path: "/structures",
            element: <StructuresList />
        },
        {
            path: "/equipment",
            element: <EquipmentList />
        },
        {
            path: "*", 
            element: (
            <ProtectedRoute>
                <NotFoundPage />
            </ProtectedRoute>
            )
        }
    ]
  }  
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;
