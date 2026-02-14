import { createSelector } from '@reduxjs/toolkit';
import { rootApi } from '@/state/api/rootApi';
import { selectUserId } from '@/state/features/authSlice';
import { sortItems } from '@/utils/sort';
import { selectSearchTerm, selectSortedBy } from './slice';

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
	selectSearchTerm,
	(repairs, searchTerm) => {
		if (!searchTerm) {
			return repairs;
		}
		return repairs.filter((repair) =>
			repair.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			repair.repair_location?.toLowerCase().includes(searchTerm.toLowerCase())
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
