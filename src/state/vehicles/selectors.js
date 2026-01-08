import { createSelector } from '@reduxjs/toolkit';
import { list } from './slice';
import { selectUserId } from '@/state/features/authSlice';

// Selector to get vehicles list from RTK Query cache
export const selectVehiclesData = createSelector(
    [
        (state) => state,
        selectUserId
    ],
    (state, userId) => {
        if (!userId) return [];
        
        // Use RTK Query's built-in selector to get cached data
        const queryResult = list.select(userId)(state);
        return queryResult?.data || [];
    }
);

// Additional helper selectors you might find useful later
export const selectVehiclesLoading = createSelector(
    [
        (state) => state,
        selectUserId
    ],
    (state, userId) => {
        if (!userId) return false;
        
        const queryResult = list.select(userId)(state);
        return queryResult?.isLoading || false;
    }
);

export const selectVehiclesError = createSelector(
    [
        (state) => state,
        selectUserId
    ],
    (state, userId) => {
        if (!userId) return null;
        
        const queryResult = list.select(userId)(state);
        return queryResult?.error || null;
    }
);

// Selector to check if vehicles data exists in cache
export const selectVehiclesCacheExists = createSelector(
    [
        (state) => state,
        selectUserId
    ],
    (state, userId) => {
        if (!userId) return false;
        
        const queryResult = list.select(userId)(state);
        return !!queryResult;
    }
);
