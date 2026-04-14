import { createSelector } from '@reduxjs/toolkit';
import { rootApi } from '@/state/api/rootApi';
import { selectUserId } from '@/state/features/authSlice';
import { sortItems } from '@/utils/sort';
import { selectSearchFilter, selectSortedBy } from './slice';

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

const filteredRepairParts = (repairId) => createSelector(
	selectStructureRepairPartsData(repairId),
	selectSearchFilter,
	(repairs, searchFilter) => {
		if (!searchFilter) {
			return repairs;
		}
		const keys = ['description', 'part_number', 'source', 'brand'];
		return repairs.filter((repair) =>
			keys.some((key) => repair[key]?.toLowerCase().includes(searchFilter.toLowerCase()))
		);
	}
);

export const selectSortedStructureRepairPartsData = (repairId) => createSelector(
	filteredRepairParts(repairId),
	selectSortedBy,
	(repairParts, sortedBy) => {
		return sortItems(repairParts, sortedBy);
	}
);
