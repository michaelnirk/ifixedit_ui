import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import NavMenu from '@/components/NavMenu.jsx';

const AppHeader = () => {
	const navigate = useNavigate();
	return (
		<AppBar position="static" sx={{ backgroundColor: 'rgb(7, 30,60)' }}>
			<Toolbar>
				<Typography
					variant="h6"
					component="div"
					sx={{ flexGrow: 1 }}>
					iFixedIt
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
					onClick={() => navigate('/about')}>About
				</Button>
			</Toolbar>
		</AppBar>
	);
};

export default AppHeader;
