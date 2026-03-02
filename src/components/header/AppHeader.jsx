import React, { lazy, Suspense, useCallback, useMemo } from 'react';
import AppBar from '@mui/material/AppBar';
import ConstructionIcon from '@mui/icons-material/Construction';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '@/state/api/rootApi';
import { logout, selectRefreshToken } from '@/state/features/authSlice';

const NavMenu = lazy(() => import('@/components/NavMenu.jsx'));

const AppHeader = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const refreshToken = useSelector(selectRefreshToken);
	const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
	const onLogout = useCallback(async () => {
		try {
			if (refreshToken) {
				await logoutMutation(refreshToken).unwrap();
			}
		} catch (error) {
			console.error('Logout failed:', error);
		} finally {
			dispatch(logout());
			navigate('/login');
		}
	}, [dispatch, logoutMutation, navigate, refreshToken]);

	const sectionName = useMemo(() => {
		const path = location.pathname;
		if (path.startsWith('/vehicles')) {
			return 'Vehicles';
		}
		if (path.startsWith('/structures')) {
			return 'Structures';
		}
		if (path.startsWith('/equipment')) {
			return 'Equipment';
		}
		return '';
	}, [location.pathname]);

	return (
		<AppBar position="static" sx={{ backgroundColor: 'rgb(7, 30,60)' }}>
			<Toolbar>
				<Typography
					variant="h5"
					component="div"
					sx={{ cursor: 'pointer', display: 'flex', flexGrow: 1 }}
					onClick={() => navigate('/')} >
					<ConstructionIcon sx={{ fontSize: 28, mr: 1 }} />iFixedIt
				</Typography>
				<Typography
					variant="h6"
					component="div"
					sx={{ flexGrow: 1 }}>
					{sectionName}
				</Typography>
				<Suspense fallback={null}>
					<NavMenu />
				</Suspense>
				<Button
					sx={
						{ '&:focus': {
							outline: 'none'
						},
						'&:hover': { color: '#ffffff' },
						color: 'rgb(206, 212, 218)' }
					}
					onClick={() => navigate('/')}>Home
				</Button>
				<Button
					sx={
						{ '&:focus': {
							outline: 'none'
						},
						'&:hover': { color: '#ffffff' },
						color: 'rgb(206, 212, 218)' }
					}
					disabled={isLoggingOut}
					onClick={onLogout}>Logout
				</Button>
			</Toolbar>
		</AppBar>
	);
};

export default AppHeader;
