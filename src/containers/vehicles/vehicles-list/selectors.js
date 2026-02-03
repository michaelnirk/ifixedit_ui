import { createSelector } from '@reduxjs/toolkit';
import { rootApi } from '@/state/api/rootApi';
import { selectShowArchived } from '@/containers/vehicles/vehicles-list/slice';
import { selectUserId } from '@/state/features/authSlice';
import { sortItems } from '@/utils/sort';

// const selectVehiclesData = (state) =>
//   rootApi.endpoints.listVehicles.select()(state)?.data || [];

const selectVehiclesData = createSelector(
	[
		(state) => state,
		selectUserId
	],
	(state, userId) => {
		if (!userId) {
			return [];
		}

		// Use RTK Query's built-in selector to get cached data
		const queryResult = rootApi.endpoints.listVehicles.select(userId)(state);
		return queryResult?.data || [];
	}
);

export const selectArchivedFilteredVehicles = createSelector(
	selectVehiclesData,
	selectShowArchived,
	(vehicles = [], showArchived) => {
		if (showArchived) {
			return vehicles;
		}
		return vehicles.filter((vehicle) => !vehicle.archived);
	}
);

export const selectSortedVehicleData = createSelector(
	selectArchivedFilteredVehicles,
	(state) => state.vehiclesList.sortedBy,
	(vehicles, sortedBy) => {
		return sortItems(vehicles, sortedBy);
	}
);
