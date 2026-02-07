import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
	components: {
		// Name of the component
		MuiIconButton: {
			styleOverrides: {
				root: {
					'&:focus': {
						outline: 'none'
					}
				}
			}
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					'&.MuiTableCell-body': {
						padding: '8px 16px'
					}
				}
			}
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					// Target the input wrapper
					'& input[type=number]': {
						MozAppearance: 'textfield' // Firefox
					},
					'& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
						// Hide default in Chrome/Safari
						display: 'none'
					}
				}
			}
		}
	}
});

export default customTheme;
