import { createSelector } from '@reduxjs/toolkit';
import { rootApi } from '@/state/api/rootApi';
import { selectSearchFilter, selectShowArchived } from '@/containers/vehicles/vehicles-list/slice';
import { selectUserId } from '@/state/features/authSlice';
import { sortItems } from '@/utils/sort';

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

const filteredVehicles = createSelector(
	selectArchivedFilteredVehicles,
	selectSearchFilter,
	(vehicles, searchFilter) => {
		if (!searchFilter) {
			return vehicles;
		}
		const keys = ['name', 'make', 'model', 'vin', 'license_plate'];
		return vehicles.filter((vehicle) =>
			keys.some((key) => vehicle[key]?.toLowerCase().includes(searchFilter.toLowerCase()))
		);
	}
);

export const selectSortedVehicleData = createSelector(
	filteredVehicles,
	(state) => state.vehiclesList.sortedBy,
	(vehicles, sortedBy) => {
		return sortItems(vehicles, sortedBy);
	}
);
