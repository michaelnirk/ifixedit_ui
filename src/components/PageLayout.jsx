import React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

const PageLayout = ({ children }) => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			{children}
		</Box>
	);
};

PageLayout.propTypes = {
	children: PropTypes.node.isRequired
};

export default PageLayout;
