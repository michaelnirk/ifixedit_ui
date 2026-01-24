import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	searchFilter: '',
	showArchived: false
};

const slice = createSlice({
	initialState,
	name: 'structuresList',
	reducers: {
		setSearchFilter(state, action) {
			state.searchFilter = action.payload;
		},
		setShowArchived(state, action) {
			state.showArchived = action.payload;
		}
	},
	selectors: {
		selectSearchFilter: (state) => state.searchFilter,
		selectShowArchived: (state) => state.showArchived
	}
});

export default slice;
export const { setSearchFilter, setShowArchived } = slice.actions;
export const { selectSearchFilter, selectShowArchived } = slice.selectors;
