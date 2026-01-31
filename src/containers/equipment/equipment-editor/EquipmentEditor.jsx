import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query/react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import FormButtonGroup from '@/components/FormButtonGroup.jsx';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import InputRow from '@/components/InputRow';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { selectUserId } from '@/state/features/authSlice';
import { selectIsOpen, setIsOpen } from './slice';
import { showNotification } from '@/state/features/notificationSlice';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import {
	useListCurrenciesQuery,
	useGetEquipmentQuery,
	useCreateEquipmentMutation,
	useUpdateEquipmentMutation
} from '@/state/api/rootApi';
import { useNotes } from '@/useNotes.jsx';

const defaultEquipment = {
	acquisition_date: null,
	archived: false,
	cost: '',
	// Default to USD
	cost_currency: 10049,
	description: '',
	equipment_id: '',
	name: '',
	notes: []
};

const EquipmentEditor = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { equipmentId } = useParams();
	const userId = useSelector(selectUserId);
	const isOpen = useSelector(selectIsOpen);

	// RTK Query to get structure data for editing
	const { data: equipment, isError: isErrorEquipment, isLoading } = useGetEquipmentQuery(
		equipmentId && userId ? { equipmentId, userId } : skipToken
	);

	const { data: currencies = [], isError: isErrorCurrencies } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	useEffect(() => {
		dispatch(setIsOpen(true));
	}, [dispatch, equipmentId]);

	const methods = useForm({
		defaultValues: defaultEquipment
	});

	const [createEquipment, { isLoading: isCreating }] = useCreateEquipmentMutation();
	const [updateEquipment, { isLoading: isUpdating }] = useUpdateEquipmentMutation();
	const { NotesSection } = useNotes({ control: methods.control });

	// Populate form when vehicle data is loaded (edit mode)
	useEffect(() => {
		if (equipment) {
			methods.setValue('equipment_id', equipment.equipment_id || '');
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
			// Format acquisition_date to 'YYYY-MM-DD HH:mm:ss' or null
			const dataToSubmit = {
				...equipmentData,
				acquisition_date: equipmentData.acquisition_date ? dayjs(equipmentData.acquisition_date).format('YYYY-MM-DD HH:mm:ss') : null
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
			navigate('..');
		} catch {
			dispatch(showNotification({
				alertVariant: 'filled',
				message: `Failed to ${equipmentId ? 'update' : 'create'} equipment item`,
				severity: 'error'
			}));
		}
	};

	const onBack = () => {
		navigate('..');
	};

	const onCloseModal = () => {
		dispatch(setIsOpen(false));
		navigate('..');
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
								<InputRow>
									<Controller
										name="name"
										control={methods.control}
										rules={{ required: 'Name is required' }}
										render={
											({ field }) => (
												<TextField
													{...field}
													autoFocus
													style={{ flex: 12 }}
													margin="normal"
													label="Name *"
													fullWidth
													size="small"
													error={!!methods.formState.errors.name}
													helperText={methods.formState.errors.name ? methods.formState.errors.name.message : ''} />
											)
										} />
								</InputRow>
								<InputRow>
									<Controller
										name="description"
										control={methods.control}
										rules={{ required: 'Description is required' }}
										render={
											({ field }) => (
												<TextField
													{...field}
													autoFocus
													style={{ flex: 12 }}
													margin="normal"
													label="Description *"
													fullWidth
													size="small"
													error={!!methods.formState.errors.description}
													helperText={methods.formState.errors.description ? methods.formState.errors.description.message : ''} />
											)
										} />
								</InputRow>
								<InputRow>
									<Controller
										name="acquisition_date"
										control={methods.control}
										render={
											({ field }) => (
												<DatePicker
													{...field}
													format="DD MMMM YYYY"
													label="Acquisition Date"
													sx={{ flex: 4 }}
													slotProps={{ textField: { margin: 'normal', size: 'small' } }} />
											)
										} />
									<Controller
										name="cost"
										control={methods.control}
										render={
											({ field }) => (
												<TextField
													{...field}
													style={{ flex: 4 }}
													margin="normal"
													label="Cost"
													size="small"
													type="number"
													step="0.01" />
											)
										} />
									<Controller
										name="cost_currency"
										control={methods.control}
										render={
											({ field }) => (
												<TextField
													{...field}
													style={{ flex: 4 }}
													margin="normal"
													label="Cost Currency"
													select
													size="small">
													{
														(currencies || []).map((currency) => (
															<MenuItem
																key={currency.currency_id}
																value={currency.currency_id}
																selected={currency.currency_id === methods.getValues('cost_currency')}>
																{currency.currency_symbol}
															</MenuItem>
														))
													}
												</TextField>
											)
										} />
								</InputRow>
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
