import React, { useCallback } from 'react';
import AppBar from '@mui/material/AppBar';
import ConstructionIcon from '@mui/icons-material/Construction';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import NavMenu from '@/components/NavMenu.jsx';
import { useDispatch } from 'react-redux';
import { logout } from '@/state/features/authSlice';

const AppHeader = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const onLogout = useCallback(() => {
		// Implement logout logic here
		dispatch(logout());
		navigate('/login');
	}, [dispatch, navigate]);

	return (
		<AppBar position="static" sx={{ backgroundColor: 'rgb(7, 30,60)' }}>
			<Toolbar>
				<Typography
					variant="h6"
					component="div"
					sx={{ cursor: 'pointer', display: 'flex', flexGrow: 1 }}
					onClick={() => navigate('/')} >
					<ConstructionIcon sx={{ fontSize: 28, mr: 1 }} />iFixedIt
				</Typography>
				<NavMenu />
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
					onClick={onLogout}>Logout
				</Button>
			</Toolbar>
		</AppBar>
	);
};

export default AppHeader;
