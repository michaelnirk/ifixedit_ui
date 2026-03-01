import { createEditorDialogSlice } from '@/state/features/createEditorDialogSlice';

const slice = createEditorDialogSlice('equipmentEditor');

export default slice;
export const { closeEditor, openEditor } = slice.actions;
export const { selectIsOpen } = slice.selectors;
