import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React from 'react';
import PropTypes from 'prop-types';

const DataTable = ({ columnLabels, rows, zeroStateLabel }) => {
	return (
		<TableContainer
			component={Paper}
			sx={
				{
					maxHeight: 'calc(100vh - 190px)', // Subtracts AppBar (64px) + title section (~76px) + Breadcrumbs (~50px)
					overflow: 'auto'
				}
			}>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						{
							columnLabels.map((label) => (
								<TableCell key={label} sx={{ fontWeight: 'bold' }}>
									{label}
								</TableCell>
							))
						}
						<TableCell />
					</TableRow>
				</TableHead>
				<TableBody>
					{
						rows.length === 0 ? (
							<TableRow>
								<TableCell colSpan={columnLabels.length + 1} align="center">
									{zeroStateLabel}
								</TableCell>
							</TableRow>
						) : (
							rows
						)
					}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

DataTable.propTypes = {
	columnLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
	rows: PropTypes.arrayOf(PropTypes.element).isRequired,
	zeroStateLabel: PropTypes.string.isRequired
};

export default DataTable;
