import React from 'react';
import Badge from '@mui/material/Badge';

const BadgeComponent = ({ content, color="error", children }) => {
    return (
        <Badge
            color={color}
            showZero
            sx={{
                "& .MuiBadge-badge": {
                fontSize: 9,
                height: 15,
                minWidth: 15,
                padding: '5px 3px'
                }
            }}
            badgeContent={content}
            overlap="circular">
            {children}
        </Badge>
    );
}

export default BadgeComponent;