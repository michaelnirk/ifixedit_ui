import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isOpen: false,
	repairId: null
};

const slice = createSlice({
	initialState,
	name: 'vehicleRepairEditor',
	reducers: {
		setIsOpen(state, action) {
			state.isOpen = action.payload;
		},
		setRepairId(state, action) {
			state.repairId = action.payload;
		}
	},
	selectors: {
		selectIsOpen: (state) => state.isOpen,
		selectRepairId: (state) => state.repairId
	}
});

export default slice;
export const { setIsOpen, setRepairId } = slice.actions;
export const { selectIsOpen, selectRepairId } = slice.selectors;
