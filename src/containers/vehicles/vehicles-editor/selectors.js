import { createSelector } from '@reduxjs/toolkit';
import { read } from '@/state/vehicles/slice';
import { selectVehicleId } from '@/containers/vehicles/vehicles-editor/slice';

const defaultVehicle = {
    'vehicle_id': '',
    'name': '',
    "make": '',
    "model": '',
    "date_purchased": '',
    "km_at_purchase": '',
    "purchase_price": '',
    "purchase_currency": '',
    "key_code": '',
    "year": '',
    "vin": '',
    "license_plate": '',
};

// Selector to get individual vehicle from RTK Query cache
const selectVehicleState = createSelector(
    [
        (state) => state,
        selectVehicleId
    ],
    (state, vehicleId) => read.select(vehicleId)(state)
);

export const selectVehicleData = createSelector(
    selectVehicleState,
    selectVehicleId,
    (vehicleResult, vehicleId) => vehicleId ? vehicleResult?.data : defaultVehicle
);