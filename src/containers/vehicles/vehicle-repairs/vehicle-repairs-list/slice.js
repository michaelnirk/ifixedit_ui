import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	searchTerm: '',
	sortedBy: {
		direction: 'desc',
		field: 'repair_date'
	}
};

const slice = createSlice({
	initialState,
	name: 'vehicleRepairsList',
	reducers: {
		setSearchFilter(state, action) {
			state.searchTerm = action.payload;
		},
		setSortedBy(state, action) {
			state.sortedBy = action.payload;
		}
	},
	selectors: {
		selectSearchFilter: (state) => state.searchTerm,
		selectSortedBy: (state) => state.sortedBy
	}
});

export default slice;
export const { setSortedBy, setSearchFilter } = slice.actions;
export const { selectSortedBy, selectSearchFilter } = slice.selectors;
