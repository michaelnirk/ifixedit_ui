import React, { useMemo } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

const SearchInput = ({ placeholderText, searchTerm, onChange }) => {
	const adornment = useMemo(() => (searchTerm ?
		<IconButton
			sx={{ padding: 0 }}
			onClick={() => onChange({ target: { value: '' } })}
			size="small">
			<CloseIcon />
		</IconButton>
		: <SearchOutlined sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />
	), [searchTerm, onChange]);
	return (
		<TextField
			slotProps={
				{
					input: {
						endAdornment: adornment
					}
				}
			}
			onChange={onChange}
			placeholder={placeholderText}
			size="small"
			value={searchTerm} />
	);
};

SearchInput.propTypes = {
	onChange: PropTypes.func.isRequired,
	placeholderText: PropTypes.string.isRequired,
	searchTerm: PropTypes.string.isRequired
};

export default SearchInput;
