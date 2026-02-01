import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
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
import PageLayout from '@/components/PageLayout.jsx';
import { selectUserId } from '@/state/features/authSlice';
import React, { useMemo, useCallback } from 'react';
import { useConfirm } from 'material-ui-confirm';

const repairsListColumns = [
	'Repair Description',
	'Repair Date',
	'Repair Location',
	'Mileage at Repair',
	'Repair Cost'
];

const zeroStateLabel = 'No repairs available. Please add a repair to get started.';

const VehicleRepairsList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { vehicleId } = useParams();
	const userId = useSelector(selectUserId);
	const confirm = useConfirm();

	// RTK Query hooks
	const { data: repairsData = [], isLoading, isError: isRepairsError } = useListRepairsQuery({ entityId: vehicleId, userId }, {
		skip: !userId || !vehicleId // Skip if no user ID or vehicle ID
	});

	const { data: currencies = [], isLoading: currenciesLoading, isError: isCurrenciesError } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const { data: vehicleData } = useGetVehicleQuery({ userId, vehicleId }, {
		skip: !userId || !vehicleId
	});

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
					<ListHeaderLayout
						addButtonText="Add Repair"
						addButtonAction={() => navigate('create')}
						titleText={pageTitle} />
					<DataTable
						columnLabels={repairsListColumns}
						rows={tableRows}
						zeroStateLabel={zeroStateLabel} />
				</PageLayout>
			</>
		)
	);
};

export default VehicleRepairsList;
