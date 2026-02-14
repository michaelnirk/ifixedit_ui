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
	name: 'structureRepairsList',
	reducers: {
		setSearchTerm(state, action) {
			state.searchTerm = action.payload;
		},
		setSortedBy(state, action) {
			state.sortedBy = action.payload;
		}
	},
	selectors: {
		selectSearchTerm: (state) => state.searchTerm,
		selectSortedBy: (state) => state.sortedBy
	}
});

export default slice;
export const { setSortedBy, setSearchTerm } = slice.actions;
export const { selectSortedBy, selectSearchTerm } = slice.selectors;
