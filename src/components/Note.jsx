import TextareaAutosize from '@mui/material/TextareaAutosize';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Note = forwardRef(({ value, onChange, onDeleteNote }, ref) => {
	return (
		<div style={{ position: 'relative' }}>
			<TextareaAutosize
				ref={ref}
				minRows={3}
				style={
					{
						backgroundColor: '#fff',
						borderColor: 'rgb(204, 204, 204)',
						borderRadius: '4px',
						color: 'inherit',
						fontFamily: ('Roboto', 'Helvetica', 'Arial', 'sans-serif'),
						fontSize: '14px',
						padding: '8px 20px 8px 8px',
						width: '100%'
					}
				}
				value={value}
				onChange={onChange} />
			<Tooltip
				arrow
				placement="top"
				title="Delete note">
				<IconButton
					variant="outlined"
					onClick={onDeleteNote}
					sx={
						{
							color: 'rgb(255, 57, 57)',
							position: 'absolute',
							right: 0,
							top: 0
						}
					}>
					<DeleteOutlinedIcon />
				</IconButton>
			</Tooltip>
		</div>
	);
});

Note.displayName = 'Note';

Note.propTypes = {
	onChange: PropTypes.func.isRequired,
	onDeleteNote: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired
};

export default Note;
