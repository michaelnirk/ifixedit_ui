import { createSelector } from '@reduxjs/toolkit';
import { rootApi } from '@/state/api/rootApi';
import { selectUserId } from '@/state/features/authSlice';
import { sortItems } from '@/utils/sort';
import { selectSearchFilter, selectSortedBy } from './slice';

// Selector factory that creates a selector for a specific vehicle's repairs
export const selectVehicleRepairsData = (vehicleId) => createSelector(
	[
		(state) => state,
		selectUserId
	],
	(state, userId) => {
		if (!userId || !vehicleId) {
			return [];
		}
		// Use RTK Query's built-in selector to get cached data
		const queryResult = rootApi.endpoints.listRepairs.select({ entityId: vehicleId, userId })(state);
		return queryResult?.data || [];
	}
);

const filteredRepairs = (vehicleId) => createSelector(
	selectVehicleRepairsData(vehicleId),
	selectSearchFilter,
	(repairs, searchTerm) => {
		if (!searchTerm) {
			return repairs;
		}
		const keys = ['description', 'repair_location'];
		return repairs.filter((repair) =>
			keys.some((key) => repair[key]?.toLowerCase().includes(searchTerm.toLowerCase()))
		);
	}
);

export const selectSortedVehicleRepairsData = (vehicleId) => createSelector(
	filteredRepairs(vehicleId),
	selectSortedBy,
	(repairs, sortedBy) => {
		return sortItems(repairs, sortedBy);
	}
);
