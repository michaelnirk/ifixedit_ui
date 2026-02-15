import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DataTable from '@/components/table/DataTable';
import StructureRow from '@/components/table/StructureRow';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useListAcquisitionMethodsQuery, useListCurrenciesQuery, useListStructuresQuery } from '@/state/api/rootApi';
import { selectUserId } from '@/state/features/authSlice';
import { selectSortedStructureData } from '@/containers/structures/structures-list/selectors';
import ListHeaderLayout from '@/components/ListHeaderLayout.jsx';
import PageLayout from '@/components/PageLayout.jsx';
import { selectShowArchived, setShowArchived, selectSortedBy, setSortedBy } from './slice';
import { showNotification } from '@/state/features/notificationSlice';
import React, { useMemo, useCallback } from 'react';

const fields = [
	{
		key: 'name',
		label: 'Name',
		sortable: true
	},
	{
		key: 'description',
		label: 'Description',
		sortable: true
	},
	{
		key: 'how_acquired',
		label: 'How Acquired',
		sortable: true
	},
	{
		key: 'acquisition_date',
		label: 'Acquisition Date',
		sortable: true
	},
	{
		key: 'cost',
		label: 'Cost',
		sortable: true
	}
];

const zeroStateLabel = 'No structures available. Please add a structure to get started.';

const StructuresList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userId = useSelector(selectUserId);
	const structures = useSelector(selectSortedStructureData);
	const showArchived = useSelector(selectShowArchived);
	const sortedBy = useSelector(selectSortedBy);

	// RTK Query hooks
	const { isLoading, isError: isStructuresError } = useListStructuresQuery(userId, {
		skip: !userId // Skip if no user ID
	});

	const { data: currencies = [], isError: isCurrenciesError, isLoading: currenciesLoading } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const { data: acquisitionMethods = [], isError: isAcquisitionMethodsError, isLoading: acquisitionMethodsLoading } = useListAcquisitionMethodsQuery(userId, {
		skip: !userId
	});

	const onEdit = useCallback((structureId) => {
		navigate(`${structureId}/edit`);
	}, [navigate]);

	const onShowRepairs = useCallback((structureId) => {
		navigate(`${structureId}/repairs`);
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
		return structures.map((structure) => (
			<StructureRow
				key={structure.structure_id}
				structure={structure}
				currencies={currencies}
				acquisitionMethods={acquisitionMethods}
				onEdit={(id) => onEdit(id)}
				onShowRepairs={(id) => onShowRepairs(id)} />
		));
	}, [structures, currencies, acquisitionMethods, onEdit, onShowRepairs]);

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
					label="Show Archived Structures" />
			</FormGroup>);
	}, [dispatch, showArchived]);

	if (!userId) {
		return (
			<Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
				<Alert severity="warning">Please log in to view structures.</Alert>
			</Box>
		);
	}

	if (isLoading || currenciesLoading || acquisitionMethodsLoading) {
		return (
			<Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
				<CircularProgress />
			</Box>
		);
	}

	if (isStructuresError || isCurrenciesError || isAcquisitionMethodsError) {
		dispatch(showNotification({
			alertVariant: 'filled',
			message: `Error loading ${isStructuresError ? 'structures' : isCurrenciesError ? 'currencies' : 'acquisition methods'}`,
			severity: 'error'
		}));
	}

	return (
		!isStructuresError && !isCurrenciesError && !isAcquisitionMethodsError && (
			<>
				<Outlet />
				<PageLayout>
					<ListHeaderLayout
						additionalContent={showArchivedButton}
						titleText="Structures">
						{headerContent}
					</ListHeaderLayout>
					<DataTable
						fields={fields}
						rows={tableRows}
						zeroStateLabel={zeroStateLabel}
						sortedBy={sortedBy}
						onSortChange={onSortChange} />
				</PageLayout>
			</>
		)
	);
};

export default StructuresList;
