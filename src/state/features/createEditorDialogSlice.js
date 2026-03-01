import { createSlice } from '@reduxjs/toolkit';

export const createEditorDialogSlice = (name) => {
	return createSlice({
		initialState: {
			isOpen: false
		},
		name,
		reducers: {
			closeEditor(state) {
				state.isOpen = false;
			},
			openEditor(state) {
				state.isOpen = true;
			}
		},
		selectors: {
			selectIsOpen: (state) => state.isOpen
		}
	});
};
