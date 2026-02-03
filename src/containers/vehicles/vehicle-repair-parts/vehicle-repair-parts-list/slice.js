import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	sortedBy: {
		direction: 'asc',
		field: 'part_description'
	}
};

const slice = createSlice({
	initialState,
	name: 'vehicleRepairPartsList',
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
