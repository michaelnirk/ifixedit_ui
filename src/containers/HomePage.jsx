import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
	const navigate = useNavigate();
	const items = [
		{
			icon: <DriveEtaIcon sx={{ fontSize: 40 }} />,
			label: 'Vehicles',
			route: '/vehicles'
		},
		{
			icon: <DriveEtaIcon sx={{ fontSize: 40 }} />,
			label: 'Structures',
			route: '/structures'
		},
		{
			icon: <DriveEtaIcon sx={{ fontSize: 40 }} />,
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
						<Card key={item.route} sx={{ border: '1px solid  grey', flex: 4, height: '20vh' }}>
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
