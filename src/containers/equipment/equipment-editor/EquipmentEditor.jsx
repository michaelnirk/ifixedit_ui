import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query/react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
	useGetEquipmentQuery,
	useCreateEquipmentMutation,
	useUpdateEquipmentMutation
} from '@/state/api/rootApi';
import { useNotes } from '@/useNotes.jsx';
import { useEditorLifecycle } from '@/containers/shared/useEditorLifecycle';
import { formatDateTimeOrNull } from '@/utils/date';
import { sanitizeNotesForPayload } from '@/utils/notes';
import SchemaFormSection from '@/components/editors/SchemaFormSection';

const defaultEquipment = {
	acquisition_date: null,
	archived: false,
	cost: '',
	// Default to USD
	cost_currency: 10049,
	description: '',
	name: '',
	notes: []
};

const EQUIPMENT_FORM_ROWS = [
	[
		{ autoFocus: true, flex: 12, fullWidth: true, label: 'Name', name: 'name', required: 'Name is required' }
	],
	[
		{ flex: 12, fullWidth: true, label: 'Description', name: 'description', required: 'Description is required' }
	],
	[
		{ flex: 4, label: 'Acquisition Date', name: 'acquisition_date', type: 'date' },
		{ flex: 4, label: 'Cost', name: 'cost', step: '0.01', type: 'number' },
		{ flex: 4, label: 'Cost Currency', name: 'cost_currency', optionLabel: 'currency_symbol', optionsKey: 'currencies', optionValue: 'currency_id', type: 'select' }
	]
];

const EquipmentEditor = () => {
	const dispatch = useDispatch();
	const { equipmentId } = useParams();
	const userId = useSelector(selectUserId);
	const isOpen = useSelector(selectIsOpen);
	const { onBack, onCloseModal } = useEditorLifecycle({ closeEditor, openDependency: equipmentId, openEditor });

	// RTK Query to get structure data for editing
	const { data: equipment, isError: isErrorEquipment, isLoading } = useGetEquipmentQuery(
		equipmentId && userId ? { equipmentId, userId } : skipToken
	);

	const { data: currencies = [], isError: isErrorCurrencies } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const methods = useForm({
		defaultValues: defaultEquipment
	});

	const [createEquipment, { isLoading: isCreating }] = useCreateEquipmentMutation();
	const [updateEquipment, { isLoading: isUpdating }] = useUpdateEquipmentMutation();
	const { NotesSection } = useNotes({ control: methods.control });

	// Populate form when vehicle data is loaded (edit mode)
	useEffect(() => {
		if (equipment) {
			methods.setValue('description', equipment.description || '');
			methods.setValue('acquisition_date', equipment.acquisition_date ? dayjs(equipment.acquisition_date) : null);
			methods.setValue('name', equipment.name || '');
			methods.setValue('cost', equipment.cost || '');
			methods.setValue('cost_currency', equipment.cost_currency || 10049);
			methods.setValue('archived', equipment.archived || false);
			methods.setValue('notes', equipment.notes || []);
		}
	}, [methods, equipment]);

	const onSubmit = async (equipmentData) => {
		try {
			const dataToSubmit = {
				...equipmentData,
				acquisition_date: formatDateTimeOrNull(equipmentData.acquisition_date),
				notes: sanitizeNotesForPayload(equipmentData.notes)
			};

			if (equipmentId) {
				await updateEquipment({
					equipmentData: dataToSubmit,
					equipmentId,
					userId
				}).unwrap();
			} else {
				await createEquipment({
					equipmentData: dataToSubmit,
					userId
				}).unwrap();
			}
			dispatch(showNotification({
				alertVariant: 'filled',
				autoCloseDuration: 3000,
				message: `Equipment Item ${equipmentId ? 'updated' : 'created'} successfully!`,
				severity: 'success'
			}));
			onBack();
		} catch {
			dispatch(showNotification({
				alertVariant: 'filled',
				message: `Failed to ${equipmentId ? 'update' : 'create'} equipment item`,
				severity: 'error'
			}));
		}
	};

	const submitButtonLabel = useMemo(() => {
		return isCreating || isUpdating ? 'Saving...' : (equipmentId ? 'Update Equipment Item' : 'Create Equipment Item');
	}, [isCreating, isUpdating, equipmentId]);

	if (!userId) {
		return <Alert severity="warning">Please log in to manage equipment items.</Alert>;
	}

	if (isErrorEquipment || isErrorCurrencies) {
		dispatch(showNotification({
			alertVariant: 'filled',
			message: `Error loading ${isErrorEquipment ? 'equipment item' : 'currencies'}`,
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
					{equipmentId ? `Edit ${equipment?.name}` : 'Create New Equipment Item'}
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
									rows={EQUIPMENT_FORM_ROWS}
									selectOptions={{ currencies }} />
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

export default EquipmentEditor;
