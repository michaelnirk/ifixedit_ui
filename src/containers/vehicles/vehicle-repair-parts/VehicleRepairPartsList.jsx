import { useSelector } from 'react-redux';
import { useNavigate, Outlet, useParams } from 'react-router-dom';
import {
	Box,
	Button,
	Typography,
	CircularProgress,
	Alert,
	Paper
} from '@mui/material';
import DataTable from '@/components/table/DataTable';
import RepairPartRow from '@/components/table/RepairPartRow';
import Add from '@mui/icons-material/Add';
import ListHeaderLayout from '@/components/ListHeaderLayout.jsx';
import PageLayout from '@/components/PageLayout.jsx';
import {
	useListRepairPartsQuery,
	useDeleteRepairPartMutation,
	useListCurrenciesQuery
} from '@/state/api/rootApi';
import { selectUserId } from '@/state/features/authSlice';
import React, { useMemo, useCallback } from 'react';
import { useConfirm } from 'material-ui-confirm';

const repairPartsListColumns = [
	'Part Description',
	'Part Number',
	'Source',
	'Brand',
	'Cost',
	'Quantity',
	'Date Purchased'
];

const VehicleRepairPartsList = () => {
	const confirm = useConfirm();
	// const dispatch = useDispatch();
	const navigate = useNavigate();
	const { repairId } = useParams();
	const userId = useSelector(selectUserId);

	// RTK Query hooks
	const { data: repairPartsData = [], isLoading, error, isError, refetch } = useListRepairPartsQuery({ repairId, userId }, {
		skip: !userId || !repairId // Skip if no user ID or repair ID
	});

	const { data: currencies = [], isLoading: currenciesLoading } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const [deleteRepairPart] = useDeleteRepairPartMutation();
	const onDeleteRepairPart = useCallback(async (partId) => {
		const { confirmed } = await confirm({
			cancellationText: 'Cancel',
			confirmationText: 'Delete',
			description: 'Are you sure you want to delete this repair part?',
			title: 'Confirm Deletion'
		});

		if (confirmed) {
			try {
				await deleteRepairPart({ partId, userId }).unwrap();
			} catch (error) {
				console.error('Failed to delete repair part:', error);
			}
		}
	}, [confirm, deleteRepairPart, userId]);

	const tableRows = useMemo(() => {
		return repairPartsData.map((part) => (
			<RepairPartRow
				key={part.part_id}
				part={part}
				currencies={currencies}
				onEdit={(partId) => navigate(`${partId}/edit`)}
				onShowParts={(partId) => navigate(`${partId}/parts`)}
				onDeleteRepairPart={(partId) => onDeleteRepairPart(partId)} />
		));
	}, [repairPartsData, currencies, navigate, onDeleteRepairPart]);

	if (!userId || !repairId) {
		return <Alert severity="warning">Please log in and select a repair to view parts.</Alert>;
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

	if (isError) {
		return (
			<Alert severity="error">
				Error loading parts: {error.message}
				<Button onClick={refetch} sx={{ ml: 1 }}>
					Retry
				</Button>
			</Alert>
		);
	}

	return (
		<>
			<Outlet />
			<PageLayout>
				<ListHeaderLayout
					addButtonText="Add Repair Part"
					addButtonAction={() => navigate('create')}
					titleText="Repair Parts" />
				<DataTable columnLabels={repairPartsListColumns} rows={tableRows} />
			</PageLayout>
		</>
	);
};

export default VehicleRepairPartsList;
