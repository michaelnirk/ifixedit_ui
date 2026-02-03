import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	searchFilter: '',
	showArchived: false,
	sortedBy: {
		direction: 'asc',
		field: 'name'
	}
};

const slice = createSlice({
	initialState,
	name: 'vehiclesList',
	reducers: {
		setSearchFilter(state, action) {
			state.searchFilter = action.payload;
		},
		setShowArchived(state, action) {
			state.showArchived = action.payload;
		},
		setSortedBy(state, action) {
			state.sortedBy = action.payload;
		}
	},
	selectors: {
		selectSearchFilter: (state) => state.searchFilter,
		selectShowArchived: (state) => state.showArchived,
		selectSortedBy: (state) => state.sortedBy
	}
});

export default slice;
export const { setSearchFilter, setShowArchived, setSortedBy } = slice.actions;
export const { selectSearchFilter, selectShowArchived, selectSortedBy } = slice.selectors;
