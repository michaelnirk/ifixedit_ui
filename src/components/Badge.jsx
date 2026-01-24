import React from 'react';
import Badge from '@mui/material/Badge';
import PropTypes from 'prop-types';

const BadgeComponent = ({ content, color = 'error', children }) => {
	return (
		<Badge
			color={color}
			showZero
			sx={
				{
					'& .MuiBadge-badge': {
						fontSize: 9,
						height: 15,
						minWidth: 15,
						padding: '5px 3px'
					}
				}
			}
			badgeContent={content}
			overlap="circular">
			{children}
		</Badge>
	);
};

BadgeComponent.propTypes = {
	children: PropTypes.node.isRequired,
	color: PropTypes.string,
	content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default BadgeComponent;
