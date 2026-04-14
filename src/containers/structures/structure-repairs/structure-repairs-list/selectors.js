import { createSelector } from '@reduxjs/toolkit';
import { rootApi } from '@/state/api/rootApi';
import { selectUserId } from '@/state/features/authSlice';
import { sortItems } from '@/utils/sort';
import { selectSearchFilter, selectSortedBy } from './slice';

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

const filteredRepairs = (structureId) => createSelector(
	selectStructureRepairsData(structureId),
	selectSearchFilter,
	(repairs, searchFilter) => {
		if (!searchFilter) {
			return repairs;
		}
		const keys = ['description', 'repair_location'];
		return repairs.filter((repair) =>
			keys.some((key) => repair[key]?.toLowerCase().includes(searchFilter.toLowerCase()))
		);
	}
);

// const filteredRepairs = (vehicleId) => createSelector(
// 	selectVehicleRepairsData(vehicleId),
// 	selectSearchFilter,
// 	(repairs, searchTerm) => {
// 		if (!searchTerm) {
// 			return repairs;
// 		}
// 		const keys = ['description', 'repair_location'];
// 		return repairs.filter((repair) =>
// 			keys.some((key) => repair[key]?.toLowerCase().includes(searchTerm.toLowerCase()))
// 		);
// 	}
// );

export const selectSortedStructureRepairsData = (structureId) => createSelector(
	filteredRepairs(structureId),
	selectSortedBy,
	(repairs, sortedBy) => {
		return sortItems(repairs, sortedBy);
	}
);
