import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

const NotesFieldset = ({ children, onAddNote }) => {
	return (
		<fieldset style={{ border: '1px solid #ccc', borderRadius: '4px', marginTop: '10px', padding: '8px' }}>
			<legend style={{ color: 'rgba(0, 0, 0, 0.6)', fontFamily: ('Roboto', 'Helvetica', 'Arial', 'sans-serif'), fontSize: '12px', fontWeight: '400', paddingLeft: '4px', paddingRight: '4px' }}>
				Notes
			</legend>
			{children}
			<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
				<Tooltip
					arrow
					placement="top"
					title="Add Note">
					<IconButton
						size="small"
						color="primary"
						sx={
							{ paddingRight: 0 }
						}
						onClick={onAddNote}>
						<AddCircleOutlineOutlinedIcon />
					</IconButton>
				</Tooltip>
			</div>
		</fieldset>
	);
};

NotesFieldset.propTypes = {
	children: PropTypes.node.isRequired,
	onAddNote: PropTypes.func.isRequired
};

export default NotesFieldset;
