import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DataTable from '@/components/table/DataTable';
import EquipmentItemRow from '@/components/table/EquipmentItemRow';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { showNotification } from '@/state/features/notificationSlice';
import Switch from '@mui/material/Switch';
import { useListCurrenciesQuery, useListEquipmentQuery } from '@/state/api/rootApi';
import { selectUserId } from '@/state/features/authSlice';
import { selectArchivedFilteredEquipment } from '@/containers/equipment/equipment-list/selectors';
import ListHeaderLayout from '@/components/ListHeaderLayout.jsx';
import PageLayout from '@/components/PageLayout.jsx';
import { selectShowArchived, setShowArchived } from './slice';
import React, { useMemo, useCallback } from 'react';

const equipmentListColumns = [
	'Name',
	'Description',
	'Acquisition Date',
	'Cost'
];

const EquipmentList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userId = useSelector(selectUserId);
	const equipment = useSelector(selectArchivedFilteredEquipment);
	const showArchived = useSelector(selectShowArchived);

	// RTK Query hooks
	const { isLoading, isError: isEquipmentError } = useListEquipmentQuery(userId, {
		skip: !userId // Skip if no user ID
	});

	const { data: currencies = [], isError: isCurrenciesError, isLoading: currenciesLoading } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const onEdit = useCallback((equipmentId) => {
		navigate(`${equipmentId}/edit`);
	}, [navigate]);

	const onShowRepairs = useCallback((equipmentId) => {
		navigate(`${equipmentId}/repairs`);
	}, [navigate]);

	const tableRows = useMemo(() => {
		return equipment.map((equipmentItem) => (
			<EquipmentItemRow
				key={equipmentItem.equipment_id}
				equipmentItem={equipmentItem}
				currencies={currencies}
				onEdit={(id) => onEdit(id)}
				onShowRepairs={(id) => onShowRepairs(id)} />
		));
	}, [equipment, currencies, onEdit, onShowRepairs]);

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
					label="Show Archived Equipment" />
			</FormGroup>);
	}, [dispatch, showArchived]);

	if (!userId) {
		return (
			<Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
				<Alert severity="warning">Please log in to view equipment.</Alert>
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

	if (isEquipmentError || isCurrenciesError) {
		dispatch(showNotification({
			alertVariant: 'filled',
			message: `Error loading ${isEquipmentError ? 'equipment' : 'currencies'}`,
			severity: 'error'
		}));
	}

	return (
		!isEquipmentError && !isCurrenciesError && (
			<>
				<Outlet />
				<PageLayout>
					<ListHeaderLayout
						addButtonText="Add Equipment Item"
						addButtonAction={() => navigate('create')}
						additionalContent={showArchivedButton}
						titleText="Equipment" />
					<DataTable columnLabels={equipmentListColumns} rows={tableRows} />
				</PageLayout>
			</>
		)
	);
};

export default EquipmentList;
