import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Add from '@mui/icons-material/Add';
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
import { selectSortedVehicleData } from '@/containers/vehicles/vehicles-list/selectors';
import ListHeaderLayout from '@/components/ListHeaderLayout.jsx';
import PageLayout from '@/components/PageLayout.jsx';
import { selectShowArchived, setShowArchived, selectSortedBy, setSortedBy } from './slice';
import React, { useMemo, useCallback } from 'react';

const fields = [
	{
		key: 'name',
		label: 'Name',
		sortable: true
	},
	{
		key: 'year',
		label: 'Year',
		sortable: true
	},
	{
		key: 'make',
		label: 'Make',
		sortable: true
	},
	{
		key: 'model',
		label: 'Model',
		sortable: true
	},
	{
		key: 'date_purchased',
		label: 'Date Purchased',
		sortable: true
	},
	{
		key: 'mileage_at_purchase',
		label: 'Mileage at Purchase',
		sortable: true
	},
	{
		key: 'purchase_price',
		label: 'Purchase Price',
		sortable: true
	},
	{
		key: 'vin',
		label: 'VIN',
		sortable: false
	},
	{
		key: 'license_plate',
		label: 'License Plate',
		sortable: false
	},
	{
		key: 'key_code',
		label: 'Key Code',
		sortable: false
	}
];

const zeroStateLabel = 'No vehicles available. Please add a vehicle to get started.';

const VehiclesList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userId = useSelector(selectUserId);
	const vehicleData = useSelector(selectSortedVehicleData);
	const showArchived = useSelector(selectShowArchived);
	const sortedBy = useSelector(selectSortedBy);

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

	const onSortChange = useCallback((field) => {
		let direction = 'asc';
		if (sortedBy.field === field && sortedBy.direction === 'asc') {
			direction = 'desc';
		}
		dispatch(setSortedBy({ direction, field }));
	}, [dispatch, sortedBy]);

	const headerContent = useMemo(() => (
		<Button
			sx={{ borderRadius: '25px' }}
			variant="contained"
			startIcon={<Add />}
			onClick={() => navigate('create')}>
			Add Structure
		</Button>
	), [navigate]);

	const tableRows = useMemo(() => {
		return vehicleData.map((vehicle) => (
			<VehicleRow
				key={vehicle.vehicle_id}
				vehicle={vehicle}
				currencies={currencies}
				onEdit={(id) => onEdit(id)}
				onShowRepairs={(id) => onShowRepairs(id)} />
		));
	}, [vehicleData, currencies, onEdit, onShowRepairs]);

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
						additionalContent={showArchivedButton}
						titleText="Vehicles">
						{headerContent}
					</ListHeaderLayout>
					<DataTable
						fields={fields}
						onSortChange={onSortChange}
						rows={tableRows}
						sortedBy={sortedBy}
						zeroStateLabel={zeroStateLabel} />
				</PageLayout>
			</>
		)
	);
};

export default VehiclesList;
