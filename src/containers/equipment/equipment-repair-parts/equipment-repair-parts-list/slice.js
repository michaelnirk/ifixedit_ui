import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	searchFilter: '',
	sortedBy: {
		direction: 'asc',
		field: 'part_description'
	}
};

const slice = createSlice({
	initialState,
	name: 'equipmentRepairPartsList',
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
export const { setSearchFilter, setSortedBy } = slice.actions;
export const { selectSearchFilter, selectSortedBy } = slice.selectors;
