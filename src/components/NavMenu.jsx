import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import { useNavigate, Outlet } from 'react-router-dom';

const NavMenu = () => {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const onButtonClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const onMenuClose = () => {
		setAnchorEl(null);
	};
	const onMenuItemClick = (route) => {
		navigate(route);
		setAnchorEl(null);
	};
	return (
		<div>
			<Button
				sx={
					{ '&:focus': {
						outline: 'none'
					},
					'&:hover': { color: '#ffffff' },
					color: 'rgb(206, 212, 218)' }
				}
				variant="text"
				onClick={onButtonClick}>
				Stuff to fix
			</Button>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={onMenuClose}>
				<MenuItem onClick={() => onMenuItemClick('/vehicles')}>
					<ListItemIcon>
						<DriveEtaIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText>Vehicles</ListItemText>
				</MenuItem>
				<MenuItem onClick={() => onMenuItemClick('/structures')}>
					<ListItemIcon>
						<WarehouseOutlinedIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText>Structures</ListItemText>
				</MenuItem>
				<MenuItem onClick={() => onMenuItemClick('/equipment')}>
					<ListItemIcon>
						<PrecisionManufacturingOutlinedIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText>Equipment</ListItemText>
				</MenuItem>
			</Menu>
		</div>
	);
};

export default NavMenu;
