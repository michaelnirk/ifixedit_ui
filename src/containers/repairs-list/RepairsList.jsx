import { useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import {
  useListQuery,
  useDeleteMutation,
} from '@/state/vehicles/slice';
import { selectUserId } from '@/state/features/authSlice';
import { selectVehiclesData } from '@/state/vehicles/selectors';

const VehiclesList = () => {
  const navigate = useNavigate();
  const userId = useSelector(selectUserId);
  const vehicles = useSelector(selectVehiclesData);

  // RTK Query hooks
  const { isLoading, error, isError, refetch } = useListQuery(userId, { 
    skip: !userId, // Skip if no user ID
  });

  const [deleteVehicle, { isLoading: isDeleting }] = useDeleteMutation();

  const onDelete = async (vehicleId) => {
    console.log('Deleting vehicle with ID:', vehicleId);
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle({ id: vehicleId, userId }).unwrap();
      } catch (error) {
        console.error('Failed to delete vehicle:', error);
      }
    }
  };

  if (!userId) {
    return <Alert severity="warning">Please log in to view vehicles.</Alert>;
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return (
      <Alert severity="error">
        Error loading vehicles: {error.message}
        <Button onClick={refetch} sx={{ ml: 1 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <>
    <Outlet />
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">My Vehicles</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('create')}
        >
          Add Vehicle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Make</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Date Purchased</TableCell>
              <TableCell>Mileage at Purchase</TableCell>
              <TableCell>Purchase Price</TableCell>
              <TableCell>VIN</TableCell>
              <TableCell>License Plate</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.vehicle_id}>
                <TableCell>{vehicle.name}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>{vehicle.make}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.datePurchased}</TableCell>
                <TableCell>{vehicle.mileageAtPurchase}</TableCell>
                <TableCell>{vehicle.purchasePrice}</TableCell>
                <TableCell>{vehicle.vin}</TableCell>
                <TableCell>{vehicle.licensePlate}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => navigate(`${vehicle.vehicle_id}/repairs`)}
                    size="small"
                  >
                    <CarRepairIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => navigate(`${vehicle.vehicle_id}/edit`)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(vehicle.vehicle_id)}
                    disabled={isDeleting}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    </>
  );
};

export default VehiclesList;