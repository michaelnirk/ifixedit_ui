import { useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import DataTable from '@/components/table/DataTable';
import VehicleRow from '@/components/table/VehicleRow';
import Add from '@mui/icons-material/Add';
import {
  useListQuery,
  useDeleteMutation,
} from '@/state/vehicles/slice';
import { useListQuery as useCurrenciesQuery } from '@/state/currencies/slice';
import { selectUserId } from '@/state/features/authSlice';
import { selectArchivedFilteredVehicles } from '@/containers/vehicles/vehicles-list/selectors';
import { useMemo, useCallback } from 'react';

const vehicleListColumns = [
    'Name',
    'Year',
    'Make',
    'Model',
    'Date Purchased',
    'Mileage at Purchase',
    'Purchase Price',
    'VIN',
    'License Plate',
    'Key Code'
];

const VehiclesList = () => {
  const navigate = useNavigate();
  const userId = useSelector(selectUserId);
  const vehicles = useSelector(selectArchivedFilteredVehicles);

  // RTK Query hooks
  const { isLoading, error, isError, refetch } = useListQuery(userId, { 
    skip: !userId, // Skip if no user ID
  });

  const { data: currencies = [] } = useCurrenciesQuery(userId, {
    skip: !userId
  });

  const [deleteVehicle] = useDeleteMutation();

  const onDelete = useCallback(async (vehicleId) => {
    console.log('Deleting vehicle with ID:', vehicleId);
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle({ id: vehicleId, userId }).unwrap();
      } catch (error) {
        console.error('Failed to delete vehicle:', error);
      }
    }
  }, [deleteVehicle, userId]);

  const tableRows = useMemo(() => {
    return vehicles.map((vehicle) => (
      <VehicleRow
        key={vehicle.vehicle_id}
        vehicle={vehicle}
        currencies={currencies}
        onEdit={(id) => navigate(`${id}/edit`)}
        onArchive={(id) => onDelete(id)}
        onShowRepairs={(id) => navigate(`${id}/repairs`)}
      />
    ));
  }, [vehicles, currencies, navigate, onDelete]);


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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" py={2} px={2}>
        <Typography variant="h4">Vehicles</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('create')}
        >
          Add Vehicle
        </Button>
      </Box>
      <Box sx={{ flex: 1, pb: 3 }}>
        <DataTable columnLabels={vehicleListColumns} rows={tableRows} />
      </Box>
    </Box>
    </>
  );
};

export default VehiclesList;