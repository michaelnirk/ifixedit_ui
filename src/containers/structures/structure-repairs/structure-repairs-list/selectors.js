import { createSelector } from '@reduxjs/toolkit';
import { rootApi } from '@/state/api/rootApi';
import { selectUserId } from '@/state/features/authSlice';
import { sortItems } from '@/utils/sort';
import { selectSortedBy } from './slice';

// Selector factory that creates a selector for a specific structure's repairs
export const selectStructureRepairsData = (structureId) => createSelector(
	[
		(state) => state,
		selectUserId
	],
	(state, userId) => {
		if (!userId || !structureId) {
			return [];
		}

		// Use RTK Query's built-in selector to get cached data
		const queryResult = rootApi.endpoints.listRepairs.select({ entityId: structureId, userId })(state);
		return queryResult?.data || [];
	}
);

export const selectSortedStructureRepairsData = (structureId) => createSelector(
	selectStructureRepairsData(structureId),
	selectSortedBy,
	(repairs, sortedBy) => {
		return sortItems(repairs, sortedBy);
	}
);
