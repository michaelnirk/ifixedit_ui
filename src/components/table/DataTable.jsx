import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React from 'react';
import PropTypes from 'prop-types';
import TableSortLabel from '@mui/material/TableSortLabel';

const DataTable = ({ fields, rows, zeroStateLabel, sortedBy, onSortChange }) => {
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
							fields.map((field) => (
								<TableCell key={field.key} sx={{ fontWeight: 'bold' }}>
									{
										field.sortable ?
											<TableSortLabel
												active={field.key === sortedBy.field}
												direction={field.key === sortedBy.field ? sortedBy.direction : 'asc'}
												onClick={() => onSortChange(field.key)}>{field.label}
											</TableSortLabel> : field.label
									}
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
								<TableCell colSpan={fields.length + 1} align="center">
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
	fields: PropTypes.arrayOf(PropTypes.object).isRequired,
	onSortChange: PropTypes.func,
	rows: PropTypes.arrayOf(PropTypes.element).isRequired,
	sortedBy: PropTypes.shape({
		direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
		field: PropTypes.string.isRequired
	}).isRequired,
	zeroStateLabel: PropTypes.string.isRequired
};

export default DataTable;
