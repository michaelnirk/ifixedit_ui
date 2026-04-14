import { createSelector } from '@reduxjs/toolkit';
import { rootApi } from '@/state/api/rootApi';
import { selectUserId } from '@/state/features/authSlice';
import { sortItems } from '@/utils/sort';
import { selectSortedBy, selectSearchFilter } from './slice';

// Selector factory that creates a selector for a specific vehicle's repairs
export const selectVehicleRepairPartsData = (repairId) => createSelector(
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
	selectVehicleRepairPartsData(repairId),
	selectSearchFilter,
	(repairs, searchTerm) => {
		if (!searchTerm) {
			return repairs;
		}
		const keys = ['description', 'part_number', 'source', 'brand'];
		return repairs.filter((repair) =>
			keys.some((key) => repair[key]?.toLowerCase().includes(searchTerm.toLowerCase()))
		);
	}
);

export const selectSortedVehicleRepairPartsData = (repairId) => createSelector(
	filteredRepairParts(repairId),
	selectSortedBy,
	(repairs, sortedBy) => {
		return sortItems(repairs, sortedBy);
	}
);
