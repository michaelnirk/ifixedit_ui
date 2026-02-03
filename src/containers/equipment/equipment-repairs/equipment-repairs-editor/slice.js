import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isOpen: false
};

const slice = createSlice({
	initialState,
	name: 'equipmentRepairEditor',
	reducers: {
		setIsOpen(state, action) {
			state.isOpen = action.payload;
		}
	},
	selectors: {
		selectIsOpen: (state) => state.isOpen
	}
});

export default slice;
export const { setIsOpen } = slice.actions;
export const { selectIsOpen } = slice.selectors;
