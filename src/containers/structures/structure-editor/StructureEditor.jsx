import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query/react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
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
	useListAcquisitionMethodsQuery,
	useGetStructureQuery,
	useCreateStructureMutation,
	useUpdateStructureMutation
} from '@/state/api/rootApi';
import { useNotes } from '@/useNotes.jsx';

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

const StructureEditor = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { structureId } = useParams();
	const userId = useSelector(selectUserId);
	const isOpen = useSelector(selectIsOpen);

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

	useEffect(() => {
		dispatch(setIsOpen(true));
	}, [dispatch, structureId]);

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
			// Format date_purchased to 'YYYY-MM-DD HH:mm:ss' or null
			const dataToSubmit = {
				...structureData,
				acquisition_date: structureData.acquisition_date ? dayjs(structureData.acquisition_date).format('YYYY-MM-DD HH:mm:ss') : null
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
			navigate('..');
		} catch {
			dispatch(showNotification({
				alertVariant: 'filled',
				message: `Failed to ${structureId ? 'update' : 'create'} structure`,
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
										render={
											({ field }) => (
												<TextField
													{...field}
													autoFocus
													style={{ flex: 12 }}
													margin="normal"
													label="Description *"
													fullWidth
													size="small" />
											)
										} />
								</InputRow>
								<InputRow>
									<Controller
										name="how_acquired"
										control={methods.control}
										render={
											({ field }) => (
												<TextField
													{...field}
													style={{ flex: 3 }}
													margin="normal"
													label="How Acquired"
													select
													size="small">
													{
														acquisitionMethods.map((acquisitionMethod) => (
															<MenuItem
																key={acquisitionMethod.acquisition_method_id}
																value={acquisitionMethod.acquisition_method_id}
																selected={acquisitionMethod.acquisition_method_id === methods.getValues('how_acquired')}>
																{acquisitionMethod.name}
															</MenuItem>
														))
													}
												</TextField>
											)
										} />
									<Controller
										name="acquisition_date"
										control={methods.control}
										render={
											({ field }) => (
												<DatePicker
													{...field}
													format="DD MMMM YYYY"
													label="Acquisition Date"
													sx={{ flex: 3 }}
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
													style={{ flex: 3 }}
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
													style={{ flex: 3 }}
													margin="normal"
													label="Cost Currency"
													select
													size="small">
													{
														currencies.map((currency) => (
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

export default StructureEditor;
