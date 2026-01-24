import TextareaAutosize from '@mui/material/TextareaAutosize';
import React from 'react';
import PropTypes from 'prop-types';

const Note = ({ note, onChange }) => {
	return (
		<TextareaAutosize
			minRows={3}
			style={{ borderColor: 'rgb(204, 204, 204)', borderRadius: '4px', fontFamily: ('Roboto', 'Helvetica', 'Arial', 'sans-serif'), fontSize: '14px', padding: '8px 20px 8px 8px', width: '100%' }}
			value={note.note_text}
			onChange={onChange} />
	);
};

Note.propTypes = {
	note: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired
};

export default Note;
