import { createSelector } from '@reduxjs/toolkit';
import { rootApi } from '@/state/api/rootApi';
import { selectShowArchived, selectSortedBy } from '@/containers/equipment/equipment-list/slice';
import { selectUserId } from '@/state/features/authSlice';
import { sortItems } from '@/utils/sort';

const selectEquipmentData = createSelector(
	[
		(state) => state,
		selectUserId
	],
	(state, userId) => {
		if (!userId) {
			return [];
		}

		// Use RTK Query's built-in selector to get cached data
		const queryResult = rootApi.endpoints.listEquipment.select(userId)(state);
		return queryResult?.data || [];
	}
);

export const selectArchivedFilteredEquipment = createSelector(
	selectEquipmentData,
	selectShowArchived,
	(equipment = [], showArchived) => {
		if (showArchived) {
			return equipment;
		}
		return equipment.filter((item) => !item.archived);
	}
);

export const selectSortedEquipmentData = createSelector(
	selectArchivedFilteredEquipment,
	selectSortedBy,
	(equipment, sortedBy) => {
		return sortItems(equipment, sortedBy);
	}
);
