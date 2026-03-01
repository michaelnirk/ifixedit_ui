import React, { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';

const AppHeader = lazy(() => import('@/components/header/AppHeader'));
const RouterBreadcrumbs = lazy(() => import('@/components/RouterBreadcrumbs.jsx'));
const Notification = lazy(() => import('@/components/Notification.jsx'));

const AppLayout = () => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
			<Suspense fallback={null}>
				<Notification />
			</Suspense>
			<Suspense fallback={null}>
				<AppHeader />
			</Suspense>
			<Suspense fallback={null}>
				<RouterBreadcrumbs />
			</Suspense>
			<Box sx={{ flex: 1 }}>
				<Outlet />
			</Box>
		</Box>
	);
};

export default AppLayout;
