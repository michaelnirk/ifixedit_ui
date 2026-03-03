import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
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
import FormGroup from '@mui/material/FormGroup';
import FormButtonGroup from '@/components/FormButtonGroup.jsx';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { selectUserId } from '@/state/features/authSlice';
import { closeEditor, openEditor, selectIsOpen } from './slice';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { useListCurrenciesQuery,
	useGetVehicleQuery,
	useCreateVehicleMutation,
	useUpdateVehicleMutation
} from '@/state/api/rootApi';
import { useNotes } from '@/useNotes.jsx';
import { useEditorLifecycle } from '@/containers/shared/useEditorLifecycle';
import { formatDateTimeOrNull } from '@/utils/date';
import { sanitizeNotesForPayload } from '@/utils/notes';
import SchemaFormSection from '@/components/editors/SchemaFormSection';

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
	vin: '',
	year: ''
};

const VEHICLE_FORM_ROWS = [
	[
		{ autoFocus: true, flex: 12, fullWidth: true, label: 'Name', name: 'name', required: 'Name is required' }
	],
	[
		{ flex: 6, label: 'Make', name: 'make' },
		{ flex: 6, fullWidth: true, label: 'Model', name: 'model' }
	],
	[
		{ flex: 3, label: 'Year', name: 'year', type: 'number' },
		{ flex: 3, label: 'Date Purchased', name: 'date_purchased', type: 'date' },
		{ flex: 3, label: 'Purchase Price', name: 'purchase_price', step: '0.01', type: 'number' },
		{ flex: 3, label: 'Purchase Currency', name: 'purchase_currency', optionLabel: 'currency_symbol', optionsKey: 'currencies', optionValue: 'currency_id', type: 'select' }
	],
	[
		{ flex: 3, label: 'Mileage at Purchase', name: 'km_at_purchase', type: 'number' },
		{ flex: 3, label: 'VIN', name: 'vin' },
		{ flex: 3, label: 'License Plate', name: 'license_plate' },
		{ flex: 3, label: 'Key Code', name: 'key_code' }
	]
];

const VehicleEditor = () => {
	const { vehicleId } = useParams();
	const userId = useSelector(selectUserId);
	const isOpen = useSelector(selectIsOpen);
	const { onBack, onCloseModal } = useEditorLifecycle({ closeEditor, openDependency: vehicleId, openEditor });

	// RTK Query to get vehicle data for editing
	const { data: vehicle, error, isError, isLoading } = useGetVehicleQuery(
		vehicleId && userId ? { userId, vehicleId } : skipToken
	);

	const { data: currencies = [] } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const methods = useForm({
		defaultValues: defaultVehicle
	});

	const { NotesSection } = useNotes({ control: methods.control });
	const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
	const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();

	// Populate form when vehicle data is loaded (edit mode)
	useEffect(() => {
		if (vehicle) {
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

	const submitButtonLabel = useMemo(() => {
		return isCreating || isUpdating ? 'Saving...' : (vehicleId ? 'Update Vehicle' : 'Create Vehicle');
	}, [isCreating, isUpdating, vehicleId]);

	const onSubmit = async (vehicleData) => {
		try {
			const dataToSubmit = {
				...vehicleData,
				date_purchased: formatDateTimeOrNull(vehicleData.date_purchased),
				notes: sanitizeNotesForPayload(vehicleData.notes)
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
			onBack();
		} catch (error) {
			console.error('Failed to save vehicle:', error);
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
								<SchemaFormSection
									control={methods.control}
									errors={methods.formState.errors}
									rows={VEHICLE_FORM_ROWS}
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

export default VehicleEditor;
