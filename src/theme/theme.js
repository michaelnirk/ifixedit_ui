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
		}
	}
});

export default customTheme;
