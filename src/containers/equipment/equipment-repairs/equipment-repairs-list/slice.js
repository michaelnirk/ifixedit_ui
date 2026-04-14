import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	searchFilter: '',
	sortedBy: {
		direction: 'desc',
		field: 'repair_date'
	}
};

const slice = createSlice({
	initialState,
	name: 'equipmentRepairsList',
	reducers: {
		setSearchFilter(state, action) {
			state.searchFilter = action.payload;
		},
		setSortedBy(state, action) {
			state.sortedBy = action.payload;
		}
	},
	selectors: {
		selectSearchFilter: (state) => state.searchFilter,
		selectSortedBy: (state) => state.sortedBy
	}
});

export default slice;
export const { setSortedBy, setSearchFilter } = slice.actions;
export const { selectSortedBy, selectSearchFilter } = slice.selectors;
