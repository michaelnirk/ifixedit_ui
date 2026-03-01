import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import FormButtonGroup from '@/components/FormButtonGroup.jsx';

const EditorDialogShell = ({
	children,
	isDisabled,
	isLoading,
	onCancel,
	onClose,
	onSubmit,
	open,
	submitLabel,
	title
}) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="lg"
			fullWidth>
			<DialogTitle sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
				{title}
			</DialogTitle>
			<DialogContent>
				{
					isLoading ? (
						<Box
							display="flex"
							justifyContent="center"
							py={4}>
							<CircularProgress />
						</Box>
					) : (
						<form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
							{children}
							<FormButtonGroup
								onCancel={onCancel}
								isDisabled={isDisabled}
								submitLabel={submitLabel} />
						</form>
					)
				}
			</DialogContent>
		</Dialog>
	);
};

EditorDialogShell.propTypes = {
	children: PropTypes.node.isRequired,
	isDisabled: PropTypes.bool,
	isLoading: PropTypes.bool,
	onCancel: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	submitLabel: PropTypes.string,
	title: PropTypes.string.isRequired
};

export default EditorDialogShell;
