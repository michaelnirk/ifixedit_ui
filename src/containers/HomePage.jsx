import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
	const navigate = useNavigate();
	const items = [
		{
			icon: <DriveEtaIcon sx={{ color: 'rgb(196, 51, 51)', fontSize: 40 }} />,
			label: 'Vehicles',
			route: '/vehicles'
		},
		{
			icon: <WarehouseOutlinedIcon sx={{ color: 'rgb(16, 145, 232)', fontSize: 40 }} />,
			label: 'Structures',
			route: '/structures'
		},
		{
			icon: <PrecisionManufacturingOutlinedIcon sx={{ color: 'rgb(242, 193, 0)', fontSize: 40 }} />,
			label: 'Equipment',
			route: '/equipment'
		}
	];

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', margin: 4 }}>
			<Typography variant="h4">Let&apos;s fix some shit!</Typography>
			<Typography variant="h6">Select what need&apos;s fixing</Typography>
			<Box sx={{ alignItems: 'center', display: 'flex', gap: '16px', marginTop: 4 }}>
				{
					items.map((item) => (
						<Card key={item.route} sx={{ boxShadow: '0 2px 12px rgba(0,0,0,0.25)', color: '#1b2437', flex: 4, height: '20vh' }}>
							<CardActionArea
								onClick={() => navigate(item.route)}
								sx={
									{
										'&:hover': {
											backgroundColor: 'action.selectedHover'
										},
										height: '100%'
									}
								}>
								<CardContent sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }} component="div">
									{item.icon}
									<Typography
										variant="h5"
										component="div"
										sx={{ alignItems: 'center', display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
										{item.label}
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>
					))
				}
			</Box>
		</Box>
	);
};

export default HomePage;
