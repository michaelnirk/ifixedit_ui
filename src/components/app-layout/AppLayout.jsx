import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from '@/components/header/AppHeader';
import Box from '@mui/material/Box';
import RouterBreadcrumbs from '@/components/RouterBreadcrumbs.jsx';
import Notification from '@/components/Notification.jsx';

const AppLayout = () => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
			<Notification />
			<AppHeader />
			<RouterBreadcrumbs />
			<Box sx={{ flex: 1 }}>
				<Outlet />
			</Box>
		</Box>
	);
};

export default AppLayout;
