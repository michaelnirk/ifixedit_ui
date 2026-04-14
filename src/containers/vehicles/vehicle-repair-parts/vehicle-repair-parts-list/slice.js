import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	searchTerm: '',
	sortedBy: {
		direction: 'asc',
		field: 'part_description'
	}
};

const slice = createSlice({
	initialState,
	name: 'vehicleRepairPartsList',
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
