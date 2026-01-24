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
import Note from '@/components/Note.jsx';
import InputRow from '@/components/InputRow';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ArrowBack } from '@mui/icons-material';
import { selectUserId } from '@/state/features/authSlice';
import { selectIsOpen, setIsOpen } from './slice';
import { useForm, Controller } from 'react-hook-form';
import { useGetRepairPartQuery, useCreateRepairPartMutation, useUpdateRepairPartMutation, useListCurrenciesQuery, useDeleteNoteMutation, useGetRepairQuery } from '@/state/api/rootApi';

const VehicleRepairPartEditor = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { repairId, partId } = useParams();
	const userId = useSelector(selectUserId);
	const isOpen = useSelector(selectIsOpen);
	const { data: repairPart, error, isError, isLoading } = useGetRepairPartQuery(
		partId && userId ? { partId, userId } : skipToken
	);

	const { data: currencies = [], isLoading: isLoadingCurrencies } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const { data: repairData } = useGetRepairQuery({ repairId, userId }, {
		skip: !userId || !repairId
	});

	useEffect(() => {
		dispatch(setIsOpen(true));
	}, [dispatch, repairId]);

	const { control, handleSubmit, getValues, formState: { errors }, setValue } = useForm({
		defaultValues: {
			brand: '',
			description: '',
			notes: [],
			part_cost: '',
			part_cost_currency: 10049, // Default to USD
			part_id: null,
			part_number: '',
			purchase_date: null,
			qty: '',
			repair_id: repairId,
			source: ''
		}
	});

	const [createRepairPart, { isLoading: isCreating }] = useCreateRepairPartMutation();
	const [updateRepairPart, { isLoading: isUpdating }] = useUpdateRepairPartMutation();
	const [deleteNote] = useDeleteNoteMutation();

	// Populate form when repair data is loaded (edit mode)
	useEffect(() => {
		if (repairPart && partId) {
			setValue('part_id', repairPart.part_id || null);
			setValue('repair_id', repairId);
			setValue('brand', repairPart.brand || '');
			setValue('description', repairPart.description || '');
			setValue('notes', repairPart.notes || []);
			setValue('part_cost', repairPart.part_cost || '');
			setValue('part_cost_currency', repairPart.part_cost_currency || '');
			setValue('part_number', repairPart.part_number || '');
			setValue('purchase_date', repairPart.purchase_date ? dayjs(repairPart.purchase_date) : null);
			setValue('qty', repairPart.qty || '');
			setValue('source', repairPart.source || '');
		}
	}, [repairPart, partId, setValue, repairId]);

	const onSubmit = async (repairPartData) => {
		try {
			// Format purchase_date to 'YYYY-MM-DD HH:mm:ss' or null
			const dataToSubmit = {
				...repairPartData,
				purchase_date: repairPartData.purchase_date ? dayjs(repairPartData.purchase_date).format('YYYY-MM-DD HH:mm:ss') : null
			};

			if (partId) {
				await updateRepairPart({
					partId,
					repairPartData: dataToSubmit,
					userId
				}).unwrap();
			} else {
				await createRepairPart({
					repairPartData: dataToSubmit,
					userId
				}).unwrap();
			}
			navigate('..');
		} catch (error) {
			console.error('Failed to save vehicle repair part:', error);
		}
	};

	const onBack = () => {
		navigate('..');
	};

	const onCloseModal = () => {
		dispatch(setIsOpen(false));
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
		const repairName = repairData ? repairData.description : '';
		if (partId) {
			return `Edit Repair Part for ${repairName}`;
		} else {
			return `Add New Repair Part for ${repairName}`;
		}
	}, [partId, repairData]);

	if (!userId) {
		return <Alert severity="warning">Please log in to manage repairs.</Alert>;
	}

	if (isError) {
		return (
			<Alert severity="error">
				Error loading repair part: {error.message}
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
									rules={{ required: 'Part Description is required' }}
									render={
										({ field }) => (
											<TextField
												{...field}
												sx={{ flex: 12 }}
												margin="normal"
												label="Part Description *"
												size="small"
												error={!!errors.description}
												helperText={errors.description ? errors.description.message : ''} />
										)
									} />
							</InputRow>
							<InputRow>
								<Controller
									name="part_number"
									control={control}
									render={
										({ field }) => (
											<TextField
												{...field}
												sx={{ flex: 4 }}
												margin="normal"
												label="Part Number"
												size="small" />
										)
									} />
								<Controller
									name="brand"
									control={control}
									render={
										({ field }) => (
											<TextField
												{...field}
												sx={{ flex: 4 }}
												margin="normal"
												label="Brand"
												size="small" />
										)
									} />
								<Controller
									name="source"
									control={control}
									render={
										({ field }) => (
											<TextField
												{...field}
												sx={{ flex: 4 }}
												margin="normal"
												label="Source"
												size="small" />
										)
									} />
							</InputRow>
							<InputRow>
								<Controller
									name="qty"
									control={control}
									rules={{ required: 'Quantity is required' }}
									render={
										({ field }) => (
											<TextField
												{...field}
												sx={{ flex: 3 }}
												margin="normal"
												label="Quantity *"
												size="small"
												type="number"
												error={!!errors.qty}
												helperText={errors.qty ? errors.qty.message : ''} />
										)
									} />
								<Controller
									name="purchase_date"
									control={control}
									render={
										({ field }) => (
											<DatePicker
												{...field}
												format="DD MMMM YYYY"
												label="Purchase Date"
												sx={{ flex: 3 }}
												slotProps={{ textField: { margin: 'normal', size: 'small' } }} />
										)
									} />
								<Controller
									name="part_cost"
									control={control}
									render={
										({ field }) => (
											<TextField
												{...field}
												sx={{ flex: 3 }}
												margin="normal"
												label="Part Cost"
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
											name="part_cost_currency"
											control={control}
											render={
												({ field }) => (
													<TextField
														{...field}
														sx={{ flex: 3 }}
														margin="normal"
														label="Part Cost Currency"
														select
														size="small">
														{
															currencies.map((currency) => (
																<MenuItem
																	key={currency.currency_id}
																	value={currency.currency_id}
																	selected={currency.currency_id === getValues('part_cost_currency')}>
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
									{isCreating || isUpdating ? 'Saving...' : (partId ? 'Update Repair Part' : 'Create Repair Part')}
								</Button>
							</Box>
						</form>
					)
				}
			</DialogContent>
		</Dialog>
	);
};

export default VehicleRepairPartEditor;
