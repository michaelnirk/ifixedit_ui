import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Add from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DataTable from '@/components/table/DataTable';
import VehicleRepairRow from '@/components/table/VehicleRepairRow';
import { showNotification } from '@/state/features/notificationSlice';
import {
	useListRepairsQuery,
	useDeleteRepairMutation,
	useListCurrenciesQuery,
	useGetVehicleQuery
} from '@/state/api/rootApi';
import ListHeaderLayout from '@/components/ListHeaderLayout.jsx';
import SearchInput from '@/components/SearchInput';
import PageLayout from '@/components/PageLayout.jsx';
import { selectUserId } from '@/state/features/authSlice';
import React, { useMemo, useCallback, useEffect } from 'react';
import { useConfirm } from 'material-ui-confirm';
import { selectSortedVehicleRepairsData } from './selectors';
import { selectSortedBy, setSortedBy, selectSearchTerm, setSearchTerm } from './slice';

const fields = [
	{
		key: 'description',
		label: 'Repair Description',
		sortable: true
	},
	{
		key: 'repair_date',
		label: 'Repair Date',
		sortable: true
	},
	{
		key: 'repair_location',
		label: 'Repair Location',
		sortable: true
	},
	{
		key: 'mileage_at_repair',
		label: 'Mileage at Repair',
		sortable: true
	},
	{
		key: 'repair_cost',
		label: 'Repair Cost',
		sortable: true
	}
];

const zeroStateLabel = 'No repairs available. Please add a repair to get started.';

const VehicleRepairsList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { vehicleId } = useParams();
	const userId = useSelector(selectUserId);

	const selectRepairs = useMemo(() => selectSortedVehicleRepairsData(vehicleId), [vehicleId]);
	const repairsData = useSelector(selectRepairs);
	const sortedBy = useSelector(selectSortedBy);
	const searchTerm = useSelector(selectSearchTerm);
	const confirm = useConfirm();

	useEffect(() => {
		return () => {
			dispatch(setSearchTerm(''));
			dispatch(setSortedBy({ direction: 'desc', field: 'repair_date' }));
		};
	}, [dispatch]);

	// RTK Query hooks
	const { isLoading, isError: isRepairsError } = useListRepairsQuery({ entityId: vehicleId, userId }, {
		skip: !userId || !vehicleId // Skip if no user ID or vehicle ID
	});

	const { data: currencies = [], isLoading: currenciesLoading, isError: isCurrenciesError } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const { data: vehicleData } = useGetVehicleQuery({ userId, vehicleId }, {
		skip: !userId || !vehicleId
	});

	const onSortChange = useCallback((field) => {
		let direction = 'asc';
		if (sortedBy.field === field && sortedBy.direction === 'asc') {
			direction = 'desc';
		}
		dispatch(setSortedBy({ direction, field }));
	}, [dispatch, sortedBy]);

	const [deleteRepair] = useDeleteRepairMutation();
	const onDeleteRepair = useCallback(async (repairId) => {
		const { confirmed } = await confirm({
			cancellationText: 'Cancel',
			confirmationText: 'Delete',
			description: 'Are you sure you want to delete this repair?',
			title: 'Confirm Deletion'
		});

		if (confirmed) {
			try {
				await deleteRepair({ repairId, userId }).unwrap();
			} catch {
				dispatch(showNotification({
					alertVariant: 'filled',
					message: 'Failed to delete repair',
					severity: 'error'
				}));
			}
			dispatch(showNotification({
				alertVariant: 'filled',
				autoCloseDuration: 3000,
				message: 'Repair deleted successfully',
				severity: 'success'
			}));
		}
	}, [confirm, deleteRepair, userId, dispatch]);

	const tableRows = useMemo(() => {
		return repairsData.map((repair) => (
			<VehicleRepairRow
				key={repair.repair_id}
				repair={repair}
				currencies={currencies}
				onEdit={(repairId) => navigate(`${repairId}/edit`)}
				onShowParts={(repairId) => navigate(`${repairId}/parts`)}
				onDeleteRepair={(repairId) => onDeleteRepair(repairId)} />
		));
	}, [repairsData, currencies, navigate, onDeleteRepair]);

	const pageTitle = useMemo(() => {
		return vehicleData ? `Repairs for ${vehicleData.name}` : 'Repairs';
	}, [vehicleData]);

	const headerContent = useMemo(() => (
		<div style={{ alignItems: 'center', display: 'flex', gap: '16px' }}>
			<SearchInput
				placeholderText="Search repairs"
				searchTerm={searchTerm}
				onChange={(e) => dispatch(setSearchTerm(e.target.value))} />
			<Button
				sx={{ borderRadius: '25px' }}
				variant="contained"
				startIcon={<Add />}
				onClick={() => navigate('create')}>
				Add Repair
			</Button>
		</div>
	), [searchTerm, dispatch, navigate]);

	if (!userId || !vehicleId) {
		return <Alert severity="warning">Please log in and select a vehicle to view repairs.</Alert>;
	}

	if (isLoading || currenciesLoading) {
		return (
			<>
				<Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
					<CircularProgress />
				</Box>
			</>
		);
	}

	if (isRepairsError || isCurrenciesError) {
		dispatch(showNotification({
			alertVariant: 'filled',
			message: `Error loading ${isRepairsError ? 'repairs' : 'currencies'}`,
			severity: 'error'
		}));
	}

	return (
		!isRepairsError && !isCurrenciesError && (
			<>
				<Outlet />
				<PageLayout>
					<ListHeaderLayout titleText={pageTitle}>
						{headerContent}
					</ListHeaderLayout>
					<DataTable
						fields={fields}
						onSortChange={onSortChange}
						sortedBy={sortedBy}
						rows={tableRows}
						zeroStateLabel={zeroStateLabel} />
				</PageLayout>
			</>
		)
	);
};

export default VehicleRepairsList;
