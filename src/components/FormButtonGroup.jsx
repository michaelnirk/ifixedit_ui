import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const FormButtonGroup = ({ onCancel, isDisabled, submitLabel = 'Submit', cancelLabel = 'Cancel' }) => {
	return (
		<Box
			display="flex"
			justifyContent="flex-end"
			gap={2}
			mt={3}>
			<Button
				sx={{ borderRadius: 25 }}
				type="button"
				variant="outlined"
				onClick={onCancel}>
				{cancelLabel}
			</Button>
			<Button
				sx={{ borderRadius: 25 }}
				type="submit"
				variant="contained"
				disabled={isDisabled}>
				{submitLabel}
			</Button>
		</Box>
	);
};

FormButtonGroup.propTypes = {
	cancelLabel: PropTypes.string,
	isDisabled: PropTypes.bool,
	onCancel: PropTypes.func.isRequired,
	submitLabel: PropTypes.string
};

export default FormButtonGroup;
