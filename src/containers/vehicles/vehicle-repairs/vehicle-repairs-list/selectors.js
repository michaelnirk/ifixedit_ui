import { createSelector } from '@reduxjs/toolkit';
import { rootApi } from '@/state/api/rootApi';
import { selectUserId } from '@/state/features/authSlice';
import { sortItems } from '@/utils/sort';
import { selectSortedBy } from './slice';

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

export const selectSortedVehicleRepairsData = (vehicleId) => createSelector(
	selectVehicleRepairsData(vehicleId),
	selectSortedBy,
	(repairs, sortedBy) => {
		return sortItems(repairs, sortedBy);
	}
);
