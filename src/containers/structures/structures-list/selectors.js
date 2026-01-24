import { createSelector } from '@reduxjs/toolkit';
import { rootApi } from '@/state/api/rootApi';
import { selectShowArchived } from '@/containers/vehicles/vehicles-list/slice';
import { selectUserId } from '@/state/features/authSlice';

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
