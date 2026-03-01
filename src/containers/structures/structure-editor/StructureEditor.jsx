import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query/react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FormButtonGroup from '@/components/FormButtonGroup.jsx';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { selectUserId } from '@/state/features/authSlice';
import { closeEditor, openEditor, selectIsOpen } from './slice';
import { showNotification } from '@/state/features/notificationSlice';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import {
	useListCurrenciesQuery,
	useListAcquisitionMethodsQuery,
	useGetStructureQuery,
	useCreateStructureMutation,
	useUpdateStructureMutation
} from '@/state/api/rootApi';
import { useNotes } from '@/useNotes.jsx';
import { useEditorLifecycle } from '@/containers/shared/useEditorLifecycle';
import { formatDateTimeOrNull } from '@/utils/date';
import SchemaFormSection from '@/components/editors/SchemaFormSection';

const defaultStructure = {
	acquisition_date: null,
	archived: false,
	cost: '',
	cost_currency: 10049,
	description: '',
	how_acquired: '',
	name: '',
	notes: [], // Default to USD
	structure_id: ''
};

const STRUCTURE_FORM_ROWS = [
	[
		{ autoFocus: true, flex: 12, fullWidth: true, label: 'Name', name: 'name', required: 'Name is required' }
	],
	[
		{ flex: 12, fullWidth: true, label: 'Description', name: 'description' }
	],
	[
		{ flex: 3, label: 'How Acquired', name: 'how_acquired', optionLabel: 'name', optionsKey: 'acquisitionMethods', optionValue: 'acquisition_method_id', type: 'select' },
		{ flex: 3, label: 'Acquisition Date', name: 'acquisition_date', type: 'date' },
		{ flex: 3, label: 'Cost', name: 'cost', step: '0.01', type: 'number' },
		{ flex: 3, label: 'Cost Currency', name: 'cost_currency', optionLabel: 'currency_symbol', optionsKey: 'currencies', optionValue: 'currency_id', type: 'select' }
	]
];

const StructureEditor = () => {
	const dispatch = useDispatch();
	const { structureId } = useParams();
	const userId = useSelector(selectUserId);
	const isOpen = useSelector(selectIsOpen);
	const { onBack, onCloseModal } = useEditorLifecycle({ closeEditor, openDependency: structureId, openEditor });

	// RTK Query to get structure data for editing
	const { data: structure, isError: isErrorStructure, isLoading } = useGetStructureQuery(
		structureId && userId ? { structureId, userId } : skipToken
	);

	const { data: currencies = [], isError: isErrorCurrencies } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const { data: acquisitionMethods = [], isError: isErrorAcquisitionMethods } = useListAcquisitionMethodsQuery(userId, {
		skip: !userId
	});

	const methods = useForm({
		defaultValues: defaultStructure
	});

	const [createStructure, { isLoading: isCreating }] = useCreateStructureMutation();
	const [updateStructure, { isLoading: isUpdating }] = useUpdateStructureMutation();
	const { NotesSection } = useNotes({ control: methods.control });

	// Populate form when vehicle data is loaded (edit mode)
	useEffect(() => {
		if (structure) {
			methods.setValue('structure_id', structure.structure_id || '');
			methods.setValue('name', structure.name || '');
			methods.setValue('description', structure.description || '');
			methods.setValue('acquisition_date', structure.acquisition_date ? dayjs(structure.acquisition_date) : null);
			methods.setValue('how_acquired', structure.how_acquired || null);
			methods.setValue('cost', structure.cost || '');
			methods.setValue('cost_currency', structure.cost_currency || 10049);
			methods.setValue('archived', structure.archived || false);
			methods.setValue('notes', structure.notes || []);
		}
	}, [methods, structure]);

	const onSubmit = async (structureData) => {
		try {
			const dataToSubmit = {
				...structureData,
				acquisition_date: formatDateTimeOrNull(structureData.acquisition_date)
			};

			if (structureId) {
				await updateStructure({
					structureData: dataToSubmit,
					structureId,
					userId
				}).unwrap();
			} else {
				await createStructure({
					structureData: dataToSubmit,
					userId
				}).unwrap();
			}
			dispatch(showNotification({
				alertVariant: 'filled',
				autoCloseDuration: 3000,
				message: `Structure ${structureId ? 'updated' : 'created'} successfully!`,
				severity: 'success'
			}));
			onBack();
		} catch {
			dispatch(showNotification({
				alertVariant: 'filled',
				message: `Failed to ${structureId ? 'update' : 'create'} structure`,
				severity: 'error'
			}));
		}
	};

	const submitButtonLabel = useMemo(() => {
		return isCreating || isUpdating ? 'Saving...' : (structureId ? 'Update Structure' : 'Create Structure');
	}, [isCreating, isUpdating, structureId]);

	if (!userId) {
		return <Alert severity="warning">Please log in to manage structures.</Alert>;
	}

	if (isErrorStructure || isErrorCurrencies || isErrorAcquisitionMethods) {
		dispatch(showNotification({
			alertVariant: 'filled',
			message: `Error loading ${isErrorStructure ? 'structure' : isErrorCurrencies ? 'currencies' : 'acquisition methods'}`,
			severity: 'error'
		}));
	}

	return (
		<FormProvider {...methods}>
			<Dialog
				open={isOpen}
				onClose={onCloseModal}
				maxWidth="lg"
				fullWidth>
				<DialogTitle sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
					{structureId ? `Edit ${structure?.name}` : 'Create New Structure'}
					<FormGroup>
						<Controller
							name="archived"
							control={methods.control}
							render={
								({ field }) => (
									<FormControlLabel
										labelPlacement="start"
										control={
											<Switch
												checked={field.value}
												onChange={(e) => field.onChange(e.target.checked)} />
										}
										label="Archived" />
								)
							} />
					</FormGroup>
				</DialogTitle>
				<DialogContent>
					{
						isLoading ? (
							<Box
								display="flex"
								justifyContent="center"
								py={4}>
								<CircularProgress />
							</Box>
						) : (
							<form onSubmit={methods.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column' }}>
								<SchemaFormSection
									control={methods.control}
									errors={methods.formState.errors}
									rows={STRUCTURE_FORM_ROWS}
									selectOptions={{ acquisitionMethods, currencies }} />
								{NotesSection}
								<FormButtonGroup
									onCancel={onBack}
									isDisabled={isCreating || isUpdating}
									submitLabel={submitButtonLabel} />
							</form>
						)
					}
				</DialogContent>
			</Dialog>
		</FormProvider>
	);
};

export default StructureEditor;
