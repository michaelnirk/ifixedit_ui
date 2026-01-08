import { createSelector } from '@reduxjs/toolkit';
import { selectVehiclesData } from '@/state/vehicles/selectors';
import { selectShowArchived } from '@/containers/vehicles/vehicles-list/slice';

export const vehicleListColumns = [
    'Name',
    'Year',
    'Make',
    'Model',
    'Date Purchased',
    'Mileage at Purchase',
    'Purchase Price',
    'VIN',
    'License Plate',
    'Key Code'
];

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
