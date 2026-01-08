import React from 'react';

const InputRow = ({ children, style={} }) => {
    return (
        <div style={{ display: 'flex', gap: '10px', ...style }}>
            {children}
        </div>
    );
};

export default InputRow;