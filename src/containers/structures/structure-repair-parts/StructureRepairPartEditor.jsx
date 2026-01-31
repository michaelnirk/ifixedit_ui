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
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import FormButtonGroup from '@/components/FormButtonGroup.jsx';
import MenuItem from '@mui/material/MenuItem';
import InputRow from '@/components/InputRow';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { selectUserId } from '@/state/features/authSlice';
import { selectIsOpen, setIsOpen } from './slice';
import { showNotification } from '@/state/features/notificationSlice';
import { useForm, Controller } from 'react-hook-form';
import {
	useGetRepairPartQuery,
	useCreateRepairPartMutation,
	useUpdateRepairPartMutation,
	useListCurrenciesQuery,
	useGetRepairQuery
} from '@/state/api/rootApi';
import { useNotes } from '@/useNotes.jsx';

const StructureRepairPartEditor = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { repairId, partId } = useParams();
	const userId = useSelector(selectUserId);
	const isOpen = useSelector(selectIsOpen);
	const { data: repairPart, isError: isRepairPartError, isLoading } = useGetRepairPartQuery(
		partId && userId ? { partId, userId } : skipToken
	);

	const { data: currencies = [], isError: isCurrenciesError } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const { data: repairData, isError: isRepairError } = useGetRepairQuery({ repairId, userId }, {
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
	const { NotesSection } = useNotes({ control });

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
			dispatch(showNotification({
				alertVariant: 'filled',
				autoCloseDuration: 3000,
				message: `Repair part ${partId ? 'updated' : 'created'} successfully!`,
				severity: 'success'
			}));
			navigate('..');
		} catch {
			dispatch(showNotification({
				alertVariant: 'filled',
				message: `Failed to ${partId ? 'update' : 'create'} repair part`,
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

	const titleText = useMemo(() => {
		const repairName = repairData ? repairData.description : '';
		if (partId) {
			return `Edit Repair Part for ${repairName}`;
		} else {
			return `Add New Repair Part for ${repairName}`;
		}
	}, [partId, repairData]);

	const submitButtonLabel = useMemo(() => {
		return isCreating || isUpdating ? 'Saving...' : (partId ? 'Update Repair Part' : 'Create Repair Part');
	}, [isCreating, isUpdating, partId]);

	if (!userId) {
		return <Alert severity="warning">Please log in to manage repairs.</Alert>;
	}

	if (isRepairPartError || isCurrenciesError || isRepairError) {
		dispatch(showNotification({
			alertVariant: 'filled',
			message: `Error loading ${isRepairPartError ? 'repair part' : isRepairError ? 'repair data' : 'currencies'}`,
			severity: 'error'
		}));
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
	);
};

export default StructureRepairPartEditor;
