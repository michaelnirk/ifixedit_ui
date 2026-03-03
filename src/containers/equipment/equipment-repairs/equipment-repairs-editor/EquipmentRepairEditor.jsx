import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query/react';
import dayjs from 'dayjs';
import Alert from '@mui/material/Alert';
import { selectUserId } from '@/state/features/authSlice';
import { closeEditor, openEditor, selectIsOpen } from './slice';
import { showNotification } from '@/state/features/notificationSlice';
import { useForm } from 'react-hook-form';
import { useGetRepairQuery,
	useCreateRepairMutation,
	useUpdateRepairMutation,
	useListCurrenciesQuery,
	useGetEquipmentQuery
} from '@/state/api/rootApi';
import { useNotes } from '@/useNotes.jsx';
import RepairFields from '@/components/editors/RepairFields';
import EditorDialogShell from '@/components/editors/EditorDialogShell';
import { REPAIR_EDITOR_CONFIG } from '@/containers/shared/repairEditorConfig';
import { useEditorLifecycle } from '@/containers/shared/useEditorLifecycle';
import { formatDateTimeOrNull } from '@/utils/date';
import { sanitizeNotesForPayload } from '@/utils/notes';

const EquipmentRepairEditor = () => {
	const editorConfig = REPAIR_EDITOR_CONFIG.equipment;
	const dispatch = useDispatch();
	const { equipmentId, repairId } = useParams();
	const userId = useSelector(selectUserId);
	const isOpen = useSelector(selectIsOpen);
	const { onBack, onCloseModal } = useEditorLifecycle({ closeEditor, openDependency: repairId, openEditor });
	const { data: repair, isError: isRepairError, isLoading } = useGetRepairQuery(
		repairId && userId ? { repairId, userId } : skipToken
	);

	const { data: currencies = [], isError: isCurrenciesError } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const { data: equipmentData, isError: isEquipmentError } = useGetEquipmentQuery({ equipmentId, userId }, {
		skip: !userId || !equipmentId
	});

	const { control, handleSubmit, formState: { errors }, setValue } = useForm({
		defaultValues: {
			description: '',
			end_item_id: '',
			km_at_repair: '',
			notes: [],
			repair_cost: '',
			repair_cost_currency: 10049, // Default to USD
			repair_date: null,
			repair_location: ''
		}
	});

	const [createRepair, { isLoading: isCreating }] = useCreateRepairMutation();
	const [updateRepair, { isLoading: isUpdating }] = useUpdateRepairMutation();
	const { NotesSection } = useNotes({ control, name: 'notes' });

	// Populate form when repair data is loaded (edit mode)
	useEffect(() => {
		if (repair && repairId) {
			setValue('end_item_id', repair.end_item_id);
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
			const dataToSubmit = {
				...repairData,
				end_item_id: equipmentId,
				notes: sanitizeNotesForPayload(repairData.notes),
				repair_date: formatDateTimeOrNull(repairData.repair_date)
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
			dispatch(showNotification({
				alertVariant: 'filled',
				autoCloseDuration: 3000,
				message: `Repair ${repairId ? 'updated' : 'created'} successfully!`,
				severity: 'success'
			}));
			onBack();
		} catch {
			dispatch(showNotification({
				alertVariant: 'filled',
				message: `Failed to ${repairId ? 'update' : 'create'} repair`,
				severity: 'error'
			}));
		}
	};

	const titleText = useMemo(() => {
		if (repairId) {
			return editorConfig.titleEdit;
		} else {
			return editorConfig.titleCreate(equipmentData ? equipmentData.name : '');
		}
	}, [repairId, equipmentData, editorConfig]);

	const submitButtonLabel = useMemo(() => {
		return isCreating || isUpdating ? 'Saving...' : (repairId ? 'Update Repair' : 'Create Repair');
	}, [isCreating, isUpdating, repairId]);

	if (!userId) {
		return <Alert severity="warning">Please log in to manage repairs.</Alert>;
	}

	if (isRepairError || isCurrenciesError || isEquipmentError) {
		dispatch(showNotification({
			alertVariant: 'filled',
			message: `Error loading ${isRepairError ? 'repair' : isCurrenciesError ? 'currencies' : 'equipment details'}`,
			severity: 'error'
		}));
	}

	return (
		<EditorDialogShell
			open={isOpen}
			onClose={onCloseModal}
			title={titleText}
			isLoading={isLoading}
			onSubmit={handleSubmit(onSubmit)}
			onCancel={onBack}
			isDisabled={isCreating || isUpdating}
			submitLabel={submitButtonLabel}>
			<RepairFields
				control={control}
				errors={errors}
				currencies={currencies}
				config={editorConfig} />
			{NotesSection}
		</EditorDialogShell>
	);
};

export default EquipmentRepairEditor;
