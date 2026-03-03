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
import {
	useGetRepairPartQuery,
	useCreateRepairPartMutation,
	useUpdateRepairPartMutation,
	useListCurrenciesQuery,
	useGetRepairQuery
} from '@/state/api/rootApi';
import { useNotes } from '@/useNotes.jsx';
import EditorDialogShell from '@/components/editors/EditorDialogShell';
import RepairPartFields from '@/components/editors/RepairPartFields';
import { REPAIR_PART_EDITOR_CONFIG } from '@/containers/shared/repairEditorConfig';
import { useEditorLifecycle } from '@/containers/shared/useEditorLifecycle';
import { formatDateTimeOrNull } from '@/utils/date';
import { sanitizeNotesForPayload } from '@/utils/notes';

const StructureRepairPartEditor = () => {
	const editorConfig = REPAIR_PART_EDITOR_CONFIG.structure;
	const dispatch = useDispatch();
	const { repairId, partId } = useParams();
	const userId = useSelector(selectUserId);
	const isOpen = useSelector(selectIsOpen);
	const { onBack, onCloseModal } = useEditorLifecycle({ closeEditor, openDependency: repairId, openEditor });
	const { data: repairPart, isError: isRepairPartError, isLoading } = useGetRepairPartQuery(
		partId && userId ? { partId, userId } : skipToken
	);

	const { data: currencies = [], isError: isCurrenciesError } = useListCurrenciesQuery(userId, {
		skip: !userId
	});

	const { data: repairData, isError: isRepairError } = useGetRepairQuery({ repairId, userId }, {
		skip: !userId || !repairId
	});

	const { control, handleSubmit, formState: { errors }, setValue } = useForm({
		defaultValues: {
			brand: '',
			description: '',
			notes: [],
			part_cost: '',
			part_cost_currency: 10049, // Default to USD
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
			const dataToSubmit = {
				...repairPartData,
				notes: sanitizeNotesForPayload(repairPartData.notes),
				purchase_date: formatDateTimeOrNull(repairPartData.purchase_date)
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
			onBack();
		} catch {
			dispatch(showNotification({
				alertVariant: 'filled',
				message: `Failed to ${partId ? 'update' : 'create'} repair part`,
				severity: 'error'
			}));
		}
	};

	const titleText = useMemo(() => {
		const repairName = repairData ? repairData.description : '';
		if (partId) {
			return editorConfig.titleEdit(repairName);
		} else {
			return editorConfig.titleCreate(repairName);
		}
	}, [partId, repairData, editorConfig]);

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
		<EditorDialogShell
			open={isOpen}
			onClose={onCloseModal}
			title={titleText}
			isLoading={isLoading}
			onSubmit={handleSubmit(onSubmit)}
			onCancel={onBack}
			isDisabled={isCreating || isUpdating}
			submitLabel={submitButtonLabel}>
			<RepairPartFields
				control={control}
				errors={errors}
				currencies={currencies} />
			{NotesSection}
		</EditorDialogShell>
	);
};

export default StructureRepairPartEditor;
