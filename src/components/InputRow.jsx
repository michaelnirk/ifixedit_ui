import React from 'react';
import PropTypes from 'prop-types';

const InputRow = ({ children, style = {} }) => {
	return (
		<div style={{ alignItems: 'baseline', display: 'flex', gap: '10px', ...style }}>
			{children}
		</div>
	);
};

InputRow.propTypes = {
	children: PropTypes.node.isRequired,
	style: PropTypes.object
};

export default InputRow;
