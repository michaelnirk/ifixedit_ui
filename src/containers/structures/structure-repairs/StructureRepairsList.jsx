import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet, useParams } from 'react-router-dom';
import { showNotification } from '@/state/features/notificationSlice';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DataTable from '@/components/table/DataTable';
import StructureRepairRow from '@/components/table/StructureRepairRow';
import {
	useListRepairsQuery,
	useDeleteRepairMutation,
	useListCurrenciesQuery,
	useGetStructureQuery
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

const StructureRepairsList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { structureId } = useParams();
	const userId = useSelector(selectUserId);
	const confirm = useConfirm();

	// RTK Query hooks
	const { data: repairsData = [], isLoading, isError: isRepairsError } = useListRepairsQuery({ entityId: structureId, userId }, {
		skip: !userId || !structureId // Skip if no user ID or structure ID
	});

	const { data: currencies = [], isError: isCurrenciesError, isLoading: currenciesLoading } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const { data: structureData, isError: isStructureError } = useGetStructureQuery({ structureId, userId }, {
		skip: !userId || !structureId
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
			<StructureRepairRow
				key={repair.repair_id}
				repair={repair}
				currencies={currencies}
				onEdit={(repairId) => navigate(`${repairId}/edit`)}
				onShowParts={(repairId) => navigate(`${repairId}/parts`)}
				onDeleteRepair={(repairId) => onDeleteRepair(repairId)} />
		));
	}, [repairsData, currencies, navigate, onDeleteRepair]);

	const pageTitle = useMemo(() => {
		return structureData ? `Repairs for ${structureData.name}` : 'Repairs';
	}, [structureData]);

	if (!userId || !structureId) {
		return <Alert severity="warning">Please log in and select a structure to view repairs.</Alert>;
	}

	if (isLoading || currenciesLoading) {
		return (
			<Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
				<CircularProgress />
			</Box>
		);
	}

	if (isRepairsError || isCurrenciesError || isStructureError) {
		dispatch(showNotification({
			alertVariant: 'filled',
			message: `Error loading ${isRepairsError ? 'repairs' : isCurrenciesError ? 'currencies' : 'structure details'}`,
			severity: 'error'
		}));
	}

	return (
		!isRepairsError && !isCurrenciesError && !isStructureError && (
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

export default StructureRepairsList;
