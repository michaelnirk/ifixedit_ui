import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import { Provider } from 'react-redux';
import { store } from '@/state/store.js';
import AuthProvider from '@/components/AuthProvider.jsx';
import App from '@/containers/app/App.jsx';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ConfirmProvider } from 'material-ui-confirm';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider store={store}>
			<ConfirmProvider>
				<AuthProvider>
					<CssBaseline />
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<App />
					</LocalizationProvider>
				</AuthProvider>
			</ConfirmProvider>
		</Provider>
	</StrictMode>
);
