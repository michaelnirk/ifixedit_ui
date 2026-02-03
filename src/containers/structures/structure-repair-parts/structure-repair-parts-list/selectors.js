import { createSelector } from '@reduxjs/toolkit';
import { rootApi } from '@/state/api/rootApi';
import { selectUserId } from '@/state/features/authSlice';
import { sortItems } from '@/utils/sort';
import { selectSortedBy } from './slice';

// Selector factory that creates a selector for a specific structure repair's parts
export const selectStructureRepairPartsData = (repairId) => createSelector(
	[
		(state) => state,
		selectUserId
	],
	(state, userId) => {
		if (!userId || !repairId) {
			return [];
		}

		// Use RTK Query's built-in selector to get cached data
		const queryResult = rootApi.endpoints.listRepairParts.select({ repairId, userId })(state);
		return queryResult?.data || [];
	}
);

export const selectSortedStructureRepairPartsData = (repairId) => createSelector(
	selectStructureRepairPartsData(repairId),
	selectSortedBy,
	(repairs, sortedBy) => {
		return sortItems(repairs, sortedBy);
	}
);
