import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DataTable from '@/components/table/DataTable';
import VehicleRow from '@/components/table/VehicleRow';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { showNotification } from '@/state/features/notificationSlice';
import Switch from '@mui/material/Switch';
import { useListCurrenciesQuery, useListVehiclesQuery } from '@/state/api/rootApi';
import { selectUserId } from '@/state/features/authSlice';
import { selectArchivedFilteredVehicles } from '@/containers/vehicles/vehicles-list/selectors';
import ListHeaderLayout from '@/components/ListHeaderLayout.jsx';
import PageLayout from '@/components/PageLayout.jsx';
import { selectShowArchived, setShowArchived } from './slice';
import React, { useMemo, useCallback } from 'react';

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

const zeroStateLabel = 'No vehicles available. Please add a vehicle to get started.';

const VehiclesList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userId = useSelector(selectUserId);
	const vehicles = useSelector(selectArchivedFilteredVehicles);
	const showArchived = useSelector(selectShowArchived);

	// RTK Query hooks
	const { isLoading, isError: isVehiclesError } = useListVehiclesQuery(userId, {
		skip: !userId // Skip if no user ID
	});

	const { data: currencies = [], isError: isCurrenciesError, isLoading: currenciesLoading } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const onEdit = useCallback((vehicleId) => {
		navigate(`${vehicleId}/edit`);
	}, [navigate]);

	const onShowRepairs = useCallback((vehicleId) => {
		navigate(`${vehicleId}/repairs`);
	}, [navigate]);

	const tableRows = useMemo(() => {
		return vehicles.map((vehicle) => (
			<VehicleRow
				key={vehicle.vehicle_id}
				vehicle={vehicle}
				currencies={currencies}
				onEdit={(id) => onEdit(id)}
				onShowRepairs={(id) => onShowRepairs(id)} />
		));
	}, [vehicles, currencies, onEdit, onShowRepairs]);

	const showArchivedButton = useMemo(() => {
		const onToggleArchived = () => {
			dispatch(setShowArchived(!showArchived));
		};
		return (
			<FormGroup>
				<FormControlLabel
					labelPlacement="start"
					control={
						<Switch
							checked={showArchived}
							onChange={onToggleArchived} />
					}
					label="Show Archived Vehicles" />
			</FormGroup>);
	}, [dispatch, showArchived]);

	if (!userId) {
		return (
			<Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
				<Alert severity="warning">Please log in to view vehicles.</Alert>
			</Box>
		);
	}

	if (isLoading || currenciesLoading) {
		return (
			<Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
				<CircularProgress />
			</Box>
		);
	}

	if (isVehiclesError || isCurrenciesError) {
		dispatch(showNotification({
			alertVariant: 'filled',
			message: `Error loading ${isVehiclesError ? 'vehicles' : 'currencies'}`,
			severity: 'error'
		}));
	}

	return (
		!isVehiclesError && !isCurrenciesError && (
			<>
				<Outlet />
				<PageLayout>
					<ListHeaderLayout
						addButtonText="Add Vehicle"
						addButtonAction={() => navigate('create')}
						additionalContent={showArchivedButton}
						titleText="Vehicles" />
					<DataTable
						columnLabels={vehicleListColumns}
						rows={tableRows}
						zeroStateLabel={zeroStateLabel} />
				</PageLayout>
			</>
		)
	);
};

export default VehiclesList;
