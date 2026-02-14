import React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Add from '@mui/icons-material/Add';

const ListHeaderLayout = ({ additionalContent, titleText, children }) => {
	return (
		<Box
			sx={{ alignItems: 'center', boxShadow: '0 2px 3px rgba(2, 1, 2, 0.15)', display: 'flex', justifyContent: 'space-between', marginBottom: '5px', px: 2, py: 2 }}>
			<div style={{ alignItems: 'center', display: 'flex', gap: '16px' }}>
				<Typography variant="h4">{titleText}</Typography>
				{additionalContent}
			</div>
			{children}
		</Box>
	);
};

ListHeaderLayout.propTypes = {
	additionalContent: PropTypes.node,
	children: PropTypes.node,
	titleText: PropTypes.string.isRequired
};

export default ListHeaderLayout;
