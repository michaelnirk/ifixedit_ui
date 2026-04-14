import React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Add from '@mui/icons-material/Add';
import SearchInput from '@/components/SearchInput';

const ListHeaderLayout = ({ additionalContent, buttonText, titleText, searchPlaceholderText, searchFilter, onSearchInput, onButtonClick }) => {
	return (
		<Box sx={{ alignItems: 'center', boxShadow: '0 2px 3px rgba(2, 1, 2, 0.15)', display: 'flex', justifyContent: 'space-between', marginBottom: '5px', px: 2, py: 2 }}>
			<div style={{ alignItems: 'center', display: 'flex', gap: '16px' }}>
				<Typography variant="h4">{titleText}</Typography>
				{additionalContent}
			</div>
			<div style={{ alignItems: 'center', display: 'flex', gap: '16px' }}>
				<SearchInput
					placeholderText={searchPlaceholderText}
					searchTerm={searchFilter}
					onChange={(e) => onSearchInput(e.target.value)} />
				<Button
					sx={{ borderRadius: '25px' }}
					variant="contained"
					startIcon={<Add />}
					onClick={() => onButtonClick()}>
					{buttonText}
				</Button>
			</div>
		</Box>
	);
};

ListHeaderLayout.propTypes = {
	additionalContent: PropTypes.node,
	buttonText: PropTypes.string.isRequired,
	onButtonClick: PropTypes.func.isRequired,
	onSearchInput: PropTypes.func.isRequired,
	searchFilter: PropTypes.string.isRequired,
	searchPlaceholderText: PropTypes.string.isRequired,
	titleText: PropTypes.string.isRequired
};

export default ListHeaderLayout;
