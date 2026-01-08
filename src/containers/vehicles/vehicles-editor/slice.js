import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
    vehicleId: null
};

const slice = createSlice({
    initialState,
    name: 'vehicleEditor',
    reducers: {
        setIsOpen(state, action) {
            state.isOpen = action.payload;
        },
        setVehicleId(state, action) {
            state.vehicleId = action.payload;
        }
    },
    selectors: {
        selectIsOpen: (state) => state.isOpen,
        selectVehicleId: (state) => state.vehicleId
    }
});

export default slice;
export const { setIsOpen, setVehicleId } = slice.actions;
export const { selectIsOpen, selectVehicleId } = slice.selectors;