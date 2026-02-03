import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	sortedBy: {
		direction: 'desc',
		field: 'repair_date'
	}
};

const slice = createSlice({
	initialState,
	name: 'vehicleRepairsList',
	reducers: {
		setSortedBy(state, action) {
			state.sortedBy = action.payload;
		}
	},
	selectors: {
		selectSortedBy: (state) => state.sortedBy
	}
});

export default slice;
export const { setSortedBy } = slice.actions;
export const { selectSortedBy } = slice.selectors;
