import { createSelector } from '@reduxjs/toolkit';
import { rootApi } from '@/state/api/rootApi';
import { selectUserId } from '@/state/features/authSlice';
import { sortItems } from '@/utils/sort';
import { selectSortedBy } from './slice';

// Selector factory that creates a selector for a specific equipment's repairs
export const selectEquipmentRepairsData = (equipmentId) => createSelector(
	[
		(state) => state,
		selectUserId
	],
	(state, userId) => {
		if (!userId || !equipmentId) {
			return [];
		}

		// Use RTK Query's built-in selector to get cached data
		const queryResult = rootApi.endpoints.listRepairs.select({ entityId: equipmentId, userId })(state);
		return queryResult?.data || [];
	}
);

export const selectSortedEquipmentRepairsData = (equipmentId) => createSelector(
	selectEquipmentRepairsData(equipmentId),
	selectSortedBy,
	(repairs, sortedBy) => {
		return sortItems(repairs, sortedBy);
	}
);
