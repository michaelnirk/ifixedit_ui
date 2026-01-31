import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	alertVariant: 'standard',
	autoCloseDuration: null,
	message: '',
	open: false,
	severity: 'info'
};

const notificationSlice = createSlice({
	initialState,
	name: 'notification',
	reducers: {
		hideNotification: () => {
			return { ...initialState };
		},
		showNotification: (state, action) => {
			state.open = true;
			state.message = action.payload.message;
			state.severity = action.payload.severity || 'info';
			state.alertVariant = action.payload.alertVariant || 'standard';
			state.autoCloseDuration = action.payload.autoCloseDuration || null;
		}
	}
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
