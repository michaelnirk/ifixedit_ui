// src/components/RouterBreadcrumbs.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams, Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import { selectUserId } from '@/state/features/authSlice';
import { useGetVehicleQuery } from '@/state/api/rootApi';

const RouterBreadcrumbs = () => {
	const location = useLocation();
	const userId = useSelector(selectUserId);
	const { vehicleId } = useParams();
	const pathnames = location.pathname.split('/').filter((x) => x);

	const { data: vehicleData } = useGetVehicleQuery({ userId, vehicleId }, {
		skip: !userId || !vehicleId
	});

	return (
		<Breadcrumbs aria-label="breadcrumb" sx={{ backgroundColor: 'rgb(127, 174, 219)', pb: 1, pl: 2, pt: 1 }}>
			{/* Home link is always the first one */}
			<MuiLink
				component={RouterLink}
				to="/"
				color="inherit"
				sx={{ alignItems: 'center', display: 'flex' }}>
				Home
			</MuiLink>

			{/* Map through the rest of the pathnames */}
			{
				pathnames.map((name, index) => {
					const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
					let token;
					if (pathnames[index - 1] === 'vehicles') {
						token = vehicleData ? vehicleData.name : 'Vehicle';
					} else {
						token = name;
					}
					// Check if it's the last item
					const isLastItem = index === pathnames.length - 1;
					const crumbName = token.charAt(0).toUpperCase() + token.slice(1); // Capitalize for display

					return isLastItem || Number.isFinite(Number(name)) ? (
					// The last item (current page) should be Typography, not a link
						<Typography color="text.primary" key={routeTo}>
							{crumbName}
						</Typography>
					) : (
					// Use MuiLink with component prop for navigation
						<MuiLink
							component={RouterLink}
							to={routeTo}
							key={routeTo}
							color="inherit">
							{crumbName}
						</MuiLink>
					);
				})
			}
		</Breadcrumbs>
	);
};

export default RouterBreadcrumbs;
