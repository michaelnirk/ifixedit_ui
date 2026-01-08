import { createBrowserRouter } from "react-router-dom";
import Login from "@/containers/Login.jsx";
import VehiclesList from "@/containers/vehicles/vehicles-list/VehiclesList.jsx";
import VehicleEditor from "@/containers/vehicles/vehicles-editor/VehicleEditor.jsx";
import StructuresList from "@/containers/StructuresList.jsx";
import EquipmentList from "@/containers/EquipmentList.jsx";
// import RepairsList from "@/containers/RepairsList.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import NotFoundPage from "@/containers/NotFoundPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/vehicles",
    element: (
      <ProtectedRoute>
        <VehiclesList />
      </ProtectedRoute>
    ),
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
    element: (
      <ProtectedRoute>
        <StructuresList />
      </ProtectedRoute>
    )
  },
  {
    path: "/equipment",
    element: (
      <ProtectedRoute>
        <EquipmentList />
      </ProtectedRoute>
    )
  },
  {
    path: ":vehicleId/repairs",
    element: (
      <ProtectedRoute>
        {/* <RepairsList /> */}
      </ProtectedRoute>
    )
  },
  {
    path: "*", 
    element: (
      <ProtectedRoute>
        <NotFoundPage />
      </ProtectedRoute>
    )
  },
]);