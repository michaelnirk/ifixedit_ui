import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Edit from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import React from 'react';

const RepairPartRow = ({ part, currencies = [], onEdit, onDeleteRepairPart }) => {
	const repairPartPrice = useMemo(() => {
		if (!part.part_cost) {
			return '';
		}
		const currency = currencies.find((c) => c.currency_id === part.part_cost_currency);
		if (!currency) {
			return part.part_cost; // Return raw price if currency not found
		}
		return Intl.NumberFormat(currency.currency_language, { currency: currency.currency_code, style: 'currency' }).format(part.part_cost);
	}, [part.part_cost, part.part_cost_currency, currencies]);

	const localOnDeleteRepairPart = useCallback((e) => {
		e.stopPropagation();
		onDeleteRepairPart(part.part_id);
	}, [onDeleteRepairPart, part.part_id]);

	const onRowClick = useCallback(() => {
		onEdit(part.part_id);
	}, [onEdit, part.part_id]);

	return (
		<TableRow
			hover
			key={part.part_id}
			onClick={onRowClick}
			sx={{ cursor: 'pointer' }}>
			<TableCell>{part.description}</TableCell>
			<TableCell>{part.part_number}</TableCell>
			<TableCell>{part.source}</TableCell>
			<TableCell>{part.brand}</TableCell>
			<TableCell>{repairPartPrice}</TableCell>
			<TableCell>{part.qty}</TableCell>
			<TableCell>{part.purchase_date ? dayjs(part.purchase_date).format('DD MMM YYYY') : ''}</TableCell>
			<TableCell>
				<div style={{ display: 'flex' }}>
					<Tooltip
						arrow
						placement="top"
						title="Edit Repair Part">
						<IconButton
							onClick={() => onEdit(part.part_id)}
							size="small">
							<Edit />
						</IconButton>
					</Tooltip>
					<Tooltip
						arrow
						placement="top"
						title="Delete Repair Part">
						<IconButton
							onClick={localOnDeleteRepairPart}
							size="small">
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</div>
			</TableCell>
		</TableRow>
	);
};

RepairPartRow.propTypes = {
	currencies: PropTypes.array,
	onDeleteRepairPart: PropTypes.func.isRequired,
	onEdit: PropTypes.func.isRequired,
	part: PropTypes.object.isRequired
};

export default RepairPartRow;
