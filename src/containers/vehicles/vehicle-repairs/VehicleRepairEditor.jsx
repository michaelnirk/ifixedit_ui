import React, { useMemo, useEffect } from 'react';
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
import { selectIsOpen, setIsOpen, setRepairId } from './slice';
import { useForm, Controller } from 'react-hook-form';
import { useGetRepairQuery,
	useCreateRepairMutation,
	useUpdateRepairMutation,
	useListCurrenciesQuery,
	useDeleteNoteMutation,
	useGetVehicleQuery
} from '@/state/api/rootApi';

const VehicleRepairEditor = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { vehicleId, repairId } = useParams();
	const userId = useSelector(selectUserId);
	const isOpen = useSelector(selectIsOpen);
	const { data: repair, error, isError, isLoading } = useGetRepairQuery(
		repairId && userId ? { repairId, userId } : skipToken
	);

	const { data: currencies = [], isLoading: isLoadingCurrencies } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const { data: vehicleData } = useGetVehicleQuery({ userId, vehicleId }, {
		skip: !userId || !vehicleId
	});

	useEffect(() => {
		dispatch(setIsOpen(true));
		dispatch(setRepairId(repairId));
	}, [dispatch, repairId]);

	const { control, handleSubmit, getValues, formState: { errors }, setValue } = useForm({
		defaultValues: {
			description: '',
			end_item_id: '',
			km_at_repair: '',
			notes: [],
			repair_cost: '',
			repair_cost_currency: 10049, // Default to USD
			repair_date: null,
			repair_id: '',
			repair_location: ''
		}
	});

	const [createRepair, { isLoading: isCreating }] = useCreateRepairMutation();
	const [updateRepair, { isLoading: isUpdating }] = useUpdateRepairMutation();
	const [deleteNote] = useDeleteNoteMutation();

	// Populate form when repair data is loaded (edit mode)
	useEffect(() => {
		if (repair && repairId) {
			setValue('end_item_id', repair.end_item_id);
			setValue('repair_id', repair.repair_id);
			setValue('description', repair.description);
			setValue('repair_location', repair.repair_location || '');
			setValue('repair_date', repair.repair_date ? dayjs(repair.repair_date) : null);
			setValue('km_at_repair', repair.km_at_repair || '');
			setValue('repair_cost', repair.repair_cost || '');
			setValue('repair_cost_currency', repair.repair_cost_currency || '');
			setValue('notes', repair.notes || []);
		}
	}, [repair, repairId, setValue]);

	const onSubmit = async (repairData) => {
		try {
			// Format repair_date to 'YYYY-MM-DD HH:mm:ss' or null
			const dataToSubmit = {
				...repairData,
				repair_date: repairData.repair_date ? dayjs(repairData.repair_date).format('YYYY-MM-DD HH:mm:ss') : null
			};

			if (repairId) {
				await updateRepair({
					repairData: dataToSubmit,
					repairId,
					userId
				}).unwrap();
			} else {
				await createRepair({
					repairData: dataToSubmit,
					userId
				}).unwrap();
			}
			navigate('..');
		} catch (error) {
			console.error('Failed to save vehicle repair:', error);
		}
	};

	const onBack = () => {
		navigate('..');
	};

	const onCloseModal = () => {
		dispatch(setIsOpen(false));
		dispatch(setRepairId(null));
		navigate('..');
	};

	const onDeleteNote = async (noteId) => {
		if (window.confirm('Are you sure you want to delete this note?')) {
			try {
				await deleteNote({ id: noteId, userId }).unwrap();
				// Remove note from local state
				const updatedNotes = getValues('notes').filter((note) => note.note_id !== noteId);
				setValue('notes', updatedNotes, { shouldDirty: true, shouldValidate: true });
			} catch (error) {
				console.error('Failed to delete note:', error);
			}
		}
	};

	const titleText = useMemo(() => {
		if (repairId) {
			return 'Edit Repair';
		} else {
			return `Create New Repair for ${vehicleData ? vehicleData.name : ''}`;
		}
	}, [repairId, vehicleData]);

	if (!userId) {
		return <Alert severity="warning">Please log in to manage repairs.</Alert>;
	}

	if (isError) {
		return (
			<Alert severity="error">
				Error loading repair: {error.message}
				<Button onClick={onBack} sx={{ ml: 1 }}>
					Back to List
				</Button>
			</Alert>
		);
	}

	return (
		<Dialog
			open={isOpen}
			onClose={onCloseModal}
			maxWidth="lg"
			fullWidth>
			<DialogTitle sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
				{titleText}
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
						<form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column' }}>
							<InputRow>
								<Controller
									name="description"
									control={control}
									rules={{ required: 'Description is required' }}
									render={
										({ field }) => (
											<TextField
												{...field}
												autoFocus
												sx={{ flex: 12 }}
												margin="normal"
												label="Repair Description *"
												fullWidth
												size="small"
												error={!!errors.description}
												helperText={errors.description ? errors.description.message : ''} />
										)
									} />
							</InputRow>
							<InputRow>
								<Controller
									name="repair_location"
									control={control}
									render={
										({ field }) => (
											<TextField
												{...field}
												sx={{ flex: 12 }}
												margin="normal"
												label="Repair Location"
												size="small" />
										)
									} />
							</InputRow>
							<InputRow>
								<Controller
									name="repair_date"
									control={control}
									render={
										({ field }) => (
											<DatePicker
												{...field}
												format="DD MMMM YYYY"
												label="Repair Date"
												sx={{ flex: 3 }}
												slotProps={{ textField: { margin: 'normal', size: 'small' } }}
												error={!!errors.repair_date}
												helperText={errors.repair_date ? errors.repair_date.message : ''} />
										)
									} />
								<Controller
									name="km_at_repair"
									control={control}
									render={
										({ field }) => (
											<TextField
												{...field}
												sx={{ flex: 3 }}
												margin="normal"
												label="Mileage at Repair"
												size="small"
												type="number" />
										)
									} />
								<Controller
									name="repair_cost"
									control={control}
									render={
										({ field }) => (
											<TextField
												{...field}
												sx={{ flex: 3 }}
												margin="normal"
												label="Repair Cost"
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
											name="repair_cost_currency"
											control={control}
											render={
												({ field }) => (
													<TextField
														{...field}
														sx={{ flex: 3 }}
														margin="normal"
														label="Repair Cost Currency"
														select
														size="small">
														{
															currencies.map((currency) => (
																<MenuItem
																	key={currency.currency_id}
																	value={currency.currency_id}
																	selected={currency.currency_id === getValues('repair_cost_currency')}>
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
							<fieldset style={{ border: '1px solid #ccc', borderRadius: '4px', marginTop: '10px', padding: '8px' }}>
								<legend style={{ color: 'rgba(0, 0, 0, 0.6)', fontFamily: ('Roboto', 'Helvetica', 'Arial', 'sans-serif'), fontSize: '12px', fontWeight: '400', paddingLeft: '4px', paddingRight: '4px' }}>Notes</legend>
								{
									getValues('notes').map((note, index) => (
										<div key={index} style={{ position: 'relative' }}>
											<TextareaAutosize
												id={ note.note_id ? `note-${note.note_id}` : null}
												minRows={3}
												style={{ borderColor: 'rgb(204, 204, 204)', borderRadius: '4px', fontFamily: ('Roboto', 'Helvetica', 'Arial', 'sans-serif'), fontSize: '14px', padding: '8px 20px 8px 8px', width: '100%' }}
												value={note.note_text}
												onChange={
													(e) => {
														const newNotes = [...getValues('notes')];
														newNotes[index].note_text = e.target.value;
														setValue('notes', newNotes, { shouldDirty: true, shouldValidate: true });
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
												const newNotes = [...getValues('notes'), { note_id: null, note_text: '' }];
												setValue('notes', newNotes, { shouldDirty: true, shouldValidate: true });
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
									{isCreating || isUpdating ? 'Saving...' : (repairId ? 'Update Repair' : 'Create Repair')}
								</Button>
							</Box>
						</form>
					)
				}
			</DialogContent>
		</Dialog>
	);
};

export default VehicleRepairEditor;
