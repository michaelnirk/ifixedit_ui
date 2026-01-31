import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSelector, useDispatch } from 'react-redux';
import { hideNotification } from '@/state/features/notificationSlice';

const Notification = () => {
	const dispatch = useDispatch();
	const { autoCloseDuration, open, message, severity, alertVariant } = useSelector((state) => state.notification);

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		dispatch(hideNotification());
	};

	return (
		<Snackbar
			anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
			open={open}
			autoHideDuration={autoCloseDuration}
			onClose={handleClose}>
			<Alert
				onClose={handleClose}
				severity={severity}
				variant={alertVariant}>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default Notification;
