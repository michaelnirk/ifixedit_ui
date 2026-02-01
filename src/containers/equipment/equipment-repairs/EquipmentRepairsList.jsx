import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet, useParams } from 'react-router-dom';
import { showNotification } from '@/state/features/notificationSlice';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DataTable from '@/components/table/DataTable';
import VehicleRepairRow from '@/components/table/VehicleRepairRow';
import {
	useListRepairsQuery,
	useDeleteRepairMutation,
	useListCurrenciesQuery,
	useGetEquipmentQuery
} from '@/state/api/rootApi';
import ListHeaderLayout from '@/components/ListHeaderLayout.jsx';
import PageLayout from '@/components/PageLayout.jsx';
import { selectUserId } from '@/state/features/authSlice';
import React, { useMemo, useCallback } from 'react';
import { useConfirm } from 'material-ui-confirm';

const repairsListColumns = [
	'Repair Description',
	'Repair Date',
	'Repair Performed By',
	'Repair Cost'
];

const zeroStateLabel = 'No repairs available. Please add a repair to get started.';

const EquipmentRepairsList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { equipmentId } = useParams();
	const userId = useSelector(selectUserId);
	const confirm = useConfirm();

	// RTK Query hooks
	const { data: repairsData = [], isLoading, isError: isRepairsError } = useListRepairsQuery({ entityId: equipmentId, userId }, {
		skip: !userId || !equipmentId // Skip if no user ID or equipment ID
	});

	const { data: currencies = [], isError: isCurrenciesError, isLoading: currenciesLoading } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const { data: equipmentData, isError: isEquipmentError } = useGetEquipmentQuery({ equipmentId, userId }, {
		skip: !userId || !equipmentId
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
				dispatch(showNotification({
					alertVariant: 'filled',
					autoCloseDuration: 3000,
					message: 'Repair deleted successfully',
					severity: 'success'
				}));
			} catch {
				dispatch(showNotification({
					alertVariant: 'filled',
					message: 'Failed to delete repair',
					severity: 'error'
				}));
			}
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
		return equipmentData ? `Repairs for ${equipmentData.name}` : 'Repairs';
	}, [equipmentData]);

	if (!userId || !equipmentId) {
		return <Alert severity="warning">Please log in and select an equipment item to view repairs.</Alert>;
	}

	if (isLoading || currenciesLoading) {
		return (
			<Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
				<CircularProgress />
			</Box>
		);
	}

	if (isRepairsError || isCurrenciesError || isEquipmentError) {
		dispatch(showNotification({
			alertVariant: 'filled',
			message: `Error loading ${isRepairsError ? 'repairs' : isCurrenciesError ? 'currencies' : 'equipment details'}`,
			severity: 'error'
		}));
	}

	return (
		!isRepairsError && !isCurrenciesError && !isEquipmentError && (
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

export default EquipmentRepairsList;
