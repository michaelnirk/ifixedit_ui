import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from '@/components/header/AppHeader';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import RouterBreadcrumbs from '@/components/RouterBreadcrumbs.jsx';

const AppLayout = () => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
			<AppHeader />
			<RouterBreadcrumbs />
			<Box sx={{ flex: 1 }}>
				<Outlet />
			</Box>
		</Box>
	);
};

export default AppLayout;
