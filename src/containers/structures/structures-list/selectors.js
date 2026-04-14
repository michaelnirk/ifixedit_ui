import { createSelector } from '@reduxjs/toolkit';
import { rootApi } from '@/state/api/rootApi';
import { selectSearchFilter, selectShowArchived, selectSortedBy } from '@/containers/structures/structures-list/slice';
import { selectUserId } from '@/state/features/authSlice';
import { sortItems } from '@/utils/sort';

const selectStructuresData = createSelector(
	[
		(state) => state,
		selectUserId
	],
	(state, userId) => {
		if (!userId) {
			return [];
		}

		// Use RTK Query's built-in selector to get cached data
		const queryResult = rootApi.endpoints.listStructures.select(userId)(state);
		return queryResult?.data || [];
	}
);

export const selectArchivedFilteredStructures = createSelector(
	selectStructuresData,
	selectShowArchived,
	(structures = [], showArchived) => {
		if (showArchived) {
			return structures;
		}
		return structures.filter((structure) => !structure.archived);
	}
);

const filteredStructures = createSelector(
	selectArchivedFilteredStructures,
	selectSearchFilter,
	(structures = [], searchFilter) => {
		if (!searchFilter) {
			return structures;
		}
		const keys = ['name', 'description'];
		return structures.filter((structure) =>
			keys.some((key) => structure[key]?.toLowerCase().includes(searchFilter.toLowerCase()))
		);
	}
);

export const selectSortedStructureData = createSelector(
	filteredStructures,
	selectSortedBy,
	(structures, sortedBy) => {
		return sortItems(structures, sortedBy);
	}
);
