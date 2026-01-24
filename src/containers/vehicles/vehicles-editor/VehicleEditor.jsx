import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query/react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import InputRow from '@/components/InputRow';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ArrowBack } from '@mui/icons-material';
import { selectUserId } from '@/state/features/authSlice';
import { selectIsOpen, setIsOpen, setVehicleId } from './slice';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { useListCurrenciesQuery,
	useDeleteNoteMutation,
	useGetVehicleQuery,
	useCreateVehicleMutation,
	useUpdateVehicleMutation
} from '@/state/api/rootApi';

const defaultVehicle = {
	archived: false,
	date_purchased: null,
	key_code: '',
	km_at_purchase: '',
	license_plate: '',
	make: '',
	model: '',
	name: '',
	notes: [],
	purchase_currency: 10049, // Default to USD
	purchase_price: '',
	vehicle_id: '',
	vin: '',
	year: ''
};

const VehicleEditor = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { vehicleId } = useParams();
	const userId = useSelector(selectUserId);
	const isOpen = useSelector(selectIsOpen);

	// RTK Query to get vehicle data for editing
	const { data: vehicle, error, isError, isLoading } = useGetVehicleQuery(
		vehicleId && userId ? { userId, vehicleId } : skipToken
	);

	const { data: currencies = [], isLoading: isLoadingCurrencies } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	useEffect(() => {
		dispatch(setIsOpen(true));
		dispatch(setVehicleId(vehicleId));
	}, [dispatch, vehicleId]);

	const methods = useForm({
		defaultValues: defaultVehicle
	});

	const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
	const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
	const [deleteNote] = useDeleteNoteMutation();

	// Populate form when vehicle data is loaded (edit mode)
	useEffect(() => {
		if (vehicle) {
			methods.setValue('vehicle_id', vehicle.vehicle_id || '');
			methods.setValue('name', vehicle.name || '');
			methods.setValue('year', vehicle.year || '');
			methods.setValue('make', vehicle.make || '');
			methods.setValue('model', vehicle.model || '');
			methods.setValue('date_purchased', vehicle.date_purchased ? dayjs(vehicle.date_purchased) : null);
			methods.setValue('km_at_purchase', vehicle.km_at_purchase || '');
			methods.setValue('purchase_price', vehicle.purchase_price || '');
			methods.setValue('purchase_currency', vehicle.purchase_currency || '');
			methods.setValue('vin', vehicle.vin || '');
			methods.setValue('license_plate', vehicle.license_plate || '');
			methods.setValue('key_code', vehicle.key_code || '');
			methods.setValue('archived', vehicle.archived || false);
			methods.setValue('notes', vehicle.notes || []);
		}
	}, [methods, vehicle]);

	const onSubmit = async (vehicleData) => {
		try {
			// Format date_purchased to 'YYYY-MM-DD HH:mm:ss' or null
			const dataToSubmit = {
				...vehicleData,
				date_purchased: vehicleData.date_purchased ? dayjs(vehicleData.date_purchased).format('YYYY-MM-DD HH:mm:ss') : null
			};

			if (vehicleId) {
				await updateVehicle({
					userId,
					vehicleData: dataToSubmit,
					vehicleId
				}).unwrap();
			} else {
				await createVehicle({
					userId,
					vehicleData: dataToSubmit
				}).unwrap();
			}
			navigate('..');
		} catch (error) {
			console.error('Failed to save vehicle:', error);
		}
	};

	const onBack = () => {
		navigate('..');
	};

	const onCloseModal = () => {
		dispatch(setIsOpen(false));
		dispatch(setVehicleId(null));
		navigate('..');
	};

	const onDeleteNote = async (noteId) => {
		if (window.confirm('Are you sure you want to delete this note?')) {
			try {
				await deleteNote({ id: noteId, userId }).unwrap();
				// Remove note from local state
				const updatedNotes = methods.getValues('notes').filter((note) => note.note_id !== noteId);
				methods.setValue('notes', updatedNotes, { shouldDirty: true, shouldValidate: true });
			} catch (error) {
				console.error('Failed to delete note:', error);
			}
		}
	};

	if (!userId) {
		return <Alert severity="warning">Please log in to manage vehicles.</Alert>;
	}

	if (isError) {
		return (
			<Alert severity="error">
				Error loading vehicle: {error.message}
				<Button onClick={onBack} sx={{ ml: 1 }}>
					Back to List
				</Button>
			</Alert>
		);
	}

	return (
		<FormProvider {...methods}>
			<Dialog
				open={isOpen}
				onClose={onCloseModal}
				maxWidth="lg"
				fullWidth>
				<DialogTitle sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
					{vehicleId ? `Edit ${vehicle?.name}` : 'Create New Vehicle'}
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
										name="make"
										control={methods.control}
										render={
											({ field }) => (
												<TextField
													{...field}
													style={{ flex: 6 }}
													margin="normal"
													label="Make"
													size="small" />
											)
										} />
									<Controller
										name="model"
										control={methods.control}
										render={
											({ field }) => (
												<TextField
													{...field}
													style={{ flex: 6 }}
													margin="normal"
													label="Model"
													fullWidth
													size="small" />
											)
										} />
								</InputRow>
								<InputRow>
									<Controller
										name="year"
										control={methods.control}
										render={
											({ field }) => (
												<TextField
													{...field}
													style={{ flex: 3 }}
													margin="normal"
													label="Year"
													size="small"
													type="number" />
											)
										} />
									<Controller
										name="date_purchased"
										control={methods.control}
										render={
											({ field }) => (
												<DatePicker
													{...field}
													format="DD MMMM YYYY"
													label="Date Purchased"
													sx={{ flex: 3 }}
													slotProps={{ textField: { margin: 'normal', size: 'small' } }} />
											)
										} />
									<Controller
										name="purchase_price"
										control={methods.control}
										render={
											({ field }) => (
												<TextField
													{...field}
													style={{ flex: 3 }}
													margin="normal"
													label="Purchase Price"
													size="small"
													type="number"
													step="0.01" />
											)
										} />
									{
										isLoadingCurrencies ? (
											<Box
												display="flex"
												alignItems="center"
												justifyContent="center"
												style={{ flex: 3, marginTop: '16px' }}>
												<CircularProgress size={24} />
											</Box>
										) : (
											<Controller
												name="purchase_currency"
												control={methods.control}
												render={
													({ field }) => (
														<TextField
															{...field}
															style={{ flex: 3 }}
															margin="normal"
															label="Purchase Currency"
															select
															size="small">
															{
																currencies.map((currency) => (
																	<MenuItem
																		key={currency.currency_id}
																		value={currency.currency_id}
																		selected={currency.currency_id === methods.getValues('purchase_currency')}>
																		{currency.currency_symbol}
																	</MenuItem>
																))
															}
														</TextField>
													)
												} />
										)
									}
								</InputRow>
								<InputRow>
									<Controller
										name="km_at_purchase"
										control={methods.control}
										render={
											({ field }) => (
												<TextField
													{...field}
													style={{ flex: 3 }}
													margin="normal"
													label="Mileage at Purchase"
													size="small"
													type="number" />
											)
										} />
									<Controller
										name="vin"
										control={methods.control}
										render={
											({ field }) => (
												<TextField
													{...field}
													style={{ flex: 3 }}
													margin="normal"
													label="VIN"
													size="small" />
											)
										} />
									<Controller
										name="license_plate"
										control={methods.control}
										render={
											({ field }) => (
												<TextField
													{...field}
													style={{ flex: 3 }}
													margin="normal"
													label="License Plate"
													size="small" />
											)
										} />
									<Controller
										name="key_code"
										control={methods.control}
										render={
											({ field }) => (
												<TextField
													{...field}
													style={{ flex: 3 }}
													margin="normal"
													label="Key Code"
													size="small" />
											)
										} />
								</InputRow>

								<fieldset style={{ border: '1px solid #ccc', borderRadius: '4px', marginTop: '10px', padding: '8px' }}>
									<legend style={{ color: 'rgba(0, 0, 0, 0.6)', fontFamily: ('Roboto', 'Helvetica', 'Arial', 'sans-serif'), fontSize: '12px', fontWeight: '400', paddingLeft: '4px', paddingRight: '4px' }}>Notes</legend>
									{
										methods.getValues('notes').map((note, index) => (
											<div key={index} style={{ position: 'relative' }}>
												<TextareaAutosize
													id={ note.note_id ? `note-${note.note_id}` : null}
													minRows={3}
													style={{ borderColor: 'rgb(204, 204, 204)', borderRadius: '4px', fontFamily: ('Roboto', 'Helvetica', 'Arial', 'sans-serif'), fontSize: '14px', padding: '8px 20px 8px 8px', width: '100%' }}
													value={note.note_text}
													onChange={
														(e) => {
															const newNotes = [...methods.getValues('notes')];
															newNotes[index].note_text = e.target.value;
															methods.setValue('notes', newNotes, { shouldDirty: true, shouldValidate: true });
														}
													} />
												<Tooltip
													arrow
													placement="top"
													title="Delete note">
													<IconButton
														onClick={() => onDeleteNote(note.note_id)}
														sx={
															{
																color: (theme) => theme.palette.grey[500],
																position: 'absolute',
																right: 0,
																top: 0
															}
														}>
														<DeleteIcon />
													</IconButton>
												</Tooltip>
											</div>
										))
									}
									<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
										<Button
											size="small"
											variant="contained"
											onClick={
												() => {
													const newNotes = [...methods.getValues('notes'), { note_id: null, note_text: '' }];
													methods.setValue('notes', newNotes, { shouldDirty: true, shouldValidate: true });
												}
											}>
											Add Note
										</Button>
									</div>
								</fieldset>

								<Box
									display="flex"
									justifyContent="flex-end"
									gap={2}
									mt={3}>
									<Button
										type="button"
										variant="outlined"
										onClick={onBack}>
										Cancel
									</Button>
									<Button
										type="submit"
										variant="contained"
										disabled={isCreating || isUpdating}>
										{isCreating || isUpdating ? 'Saving...' : (vehicleId ? 'Update Vehicle' : 'Create Vehicle')}
									</Button>
								</Box>
							</form>
						)
					}
				</DialogContent>
			</Dialog>
		</FormProvider>
	);
};

export default VehicleEditor;
