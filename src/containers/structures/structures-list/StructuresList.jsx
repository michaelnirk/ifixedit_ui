import { useSelector, useDispatch } from 'react-redux';
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
import StructureRow from '@/components/table/StructureRow';
import Add from '@mui/icons-material/Add';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useListCurrenciesQuery, useListStructuresQuery } from '@/state/api/rootApi';
import { selectUserId } from '@/state/features/authSlice';
import { selectArchivedFilteredStructures } from '@/containers/structures/structures-list/selectors';
import ListHeaderLayout from '@/components/ListHeaderLayout.jsx';
import PageLayout from '@/components/PageLayout.jsx';
import { selectShowArchived, setShowArchived } from './slice';
import React, { useMemo, useCallback } from 'react';

const structureListColumns = [
	'Description',
	'How Acquired',
	'Acquisition Date',
	'Cost'
];

const StructuresList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userId = useSelector(selectUserId);
	const structures = useSelector(selectArchivedFilteredStructures);
	const showArchived = useSelector(selectShowArchived);

	// RTK Query hooks
	const { isLoading, error, isError, refetch } = useListStructuresQuery(userId, {
		skip: !userId // Skip if no user ID
	});

	const { data: currencies = [], isLoading: currenciesLoading } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const onEdit = useCallback((structureId) => {
		navigate(`${structureId}/edit`);
	}, [navigate]);

	const onShowRepairs = useCallback((structureId) => {
		navigate(`${structureId}/repairs`);
	}, [navigate]);

	const tableRows = useMemo(() => {
		return structures.map((structure) => (
			<StructureRow
				key={structure.structure_id}
				structure={structure}
				currencies={currencies}
				onEdit={(id) => onEdit(id)}
				onShowRepairs={(id) => onShowRepairs(id)} />
		));
	}, [structures, currencies, onEdit, onShowRepairs]);

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

	if (isLoading || currenciesLoading) {
		return (
			<Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
				<CircularProgress />
			</Box>
		);
	}

	if (isError) {
		return (
			<Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
				<Alert severity="error">
					Error loading structures: {error.message}
					<Button onClick={refetch} sx={{ ml: 1 }}>
						Retry
					</Button>
				</Alert>
			</Box>
		);
	}

	return (
		<>
			<Outlet />
			<PageLayout>
				<ListHeaderLayout
					addButtonText="Add Structure"
					addButtonAction={() => navigate('create')}
					additionalContent={showArchivedButton}
					titleText="Structures" />
				<DataTable columnLabels={structureListColumns} rows={tableRows} />
			</PageLayout>
		</>
	);
};

export default StructuresList;
