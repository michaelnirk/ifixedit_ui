import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showNotification } from '@/state/features/notificationSlice';
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
import MenuItem from '@mui/material/MenuItem';
import InputRow from '@/components/InputRow';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { selectUserId } from '@/state/features/authSlice';
import { selectIsOpen, setIsOpen } from './slice';
import { useForm, Controller } from 'react-hook-form';
import { useGetRepairQuery,
	useCreateRepairMutation,
	useUpdateRepairMutation,
	useListCurrenciesQuery,
	useGetVehicleQuery
} from '@/state/api/rootApi';
import { useNotes } from '@/useNotes.jsx';

const VehicleRepairEditor = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { vehicleId, repairId } = useParams();
	const userId = useSelector(selectUserId);
	const isOpen = useSelector(selectIsOpen);
	const { data: repair, isError: isRepairError, isLoading } = useGetRepairQuery(
		repairId && userId ? { repairId, userId } : skipToken
	);

	const { data: currencies = [], isError: isCurrenciesError } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const { data: vehicleData, isError: isVehicleError } = useGetVehicleQuery({ userId, vehicleId }, {
		skip: !userId || !vehicleId
	});

	useEffect(() => {
		dispatch(setIsOpen(true));
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
	const { NotesSection } = useNotes({ control });

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
				end_item_id: vehicleId,
				repair_date: repairData.repair_date ? dayjs(repairData.repair_date).format('YYYY-MM-DD HH:mm:ss') : null
			};

			if (repairId) {
				await updateRepair({
					repairData: dataToSubmit,
					repairId,
					userId
				}).unwrap();
				dispatch(showNotification({
					alertVariant: 'filled',
					autoCloseDuration: 3000,
					message: 'Repair updated successfully!',
					severity: 'success'
				}));
			} else {
				await createRepair({
					repairData: dataToSubmit,
					userId
				}).unwrap();
				dispatch(showNotification({
					alertVariant: 'filled',
					autoCloseDuration: 3000,
					message: 'Repair created successfully!',
					severity: 'success'
				}));
			}
			navigate('..');
		} catch {
			dispatch(showNotification({
				alertVariant: 'filled',
				message: `Failed to ${repairId ? 'update' : 'create'} repair`,
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
		if (repairId) {
			return 'Edit Repair';
		} else {
			return `Create New Repair for ${vehicleData ? vehicleData.name : ''}`;
		}
	}, [repairId, vehicleData]);

	const submitButtonLabel = useMemo(() => {
		return isCreating || isUpdating ? 'Saving...' : (repairId ? 'Update Repair' : 'Create Repair');
	}, [isCreating, isUpdating, repairId]);

	if (!userId) {
		return <Alert severity="warning">Please log in to manage repairs.</Alert>;
	}

	if (isCurrenciesError || isVehicleError || isRepairError) {
		dispatch(showNotification({
			alertVariant: 'filled',
			message: `Error loading ${isCurrenciesError ? 'currencies' : isVehicleError ? 'vehicle data' : 'repair data'}`,
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
									rules={{ required: 'Repair date is required' }}
									render={
										({ field }) => (
											<DatePicker
												{...field}
												format="DD MMMM YYYY"
												label="Repair Date *"
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

export default VehicleRepairEditor;
