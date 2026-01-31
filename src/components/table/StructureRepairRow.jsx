import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import Edit from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BadgeComponent from '@/components/Badge';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const StructureRepairRow = ({ repair, currencies = [], onEdit, onDeleteRepair, onShowParts }) => {
	const repairPrice = useMemo(() => {
		if (!repair.repair_cost) {
			return '';
		}
		const currency = currencies.find((c) => c.currency_id === repair.repair_cost_currency);
		if (!currency) {
			return repair.repair_cost; // Return raw price if currency not found
		}
		return Intl.NumberFormat(currency.currency_language, { currency: currency.currency_code, style: 'currency' }).format(repair.repair_cost);
	}, [repair.repair_cost, repair.repair_cost_currency, currencies]);

	return (
		<TableRow hover key={repair.repair_id} >
			<TableCell>{repair.description}</TableCell>
			<TableCell>{repair.repair_date ? dayjs(repair.repair_date).format('DD MMM YYYY') : ''}</TableCell>
			<TableCell>{repair.performed_by}</TableCell>
			<TableCell>{repairPrice}</TableCell>
			<TableCell>
				<div style={{ display: 'flex' }}>
					<Tooltip
						arrow
						placement="top"
						title="Edit Repair">
						<IconButton
							onClick={() => onEdit(repair.repair_id)}
							size="small">
							<Edit />
						</IconButton>
					</Tooltip>
					<BadgeComponent content={repair?.parts_count || 0}>
						<Tooltip
							arrow
							placement="top"
							title="View Repair Parts">
							<IconButton
								onClick={() => onShowParts(repair.repair_id)}
								size="small">
								<MiscellaneousServicesOutlinedIcon />
							</IconButton>
						</Tooltip>
					</BadgeComponent>
					<Tooltip
						arrow
						placement="top"
						title="Delete Repair">
						<IconButton
							onClick={() => onDeleteRepair(repair.repair_id)}
							size="small">
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</div>
			</TableCell>
		</TableRow>
	);
};

StructureRepairRow.propTypes = {
	currencies: PropTypes.array,
	onDeleteRepair: PropTypes.func.isRequired,
	onEdit: PropTypes.func.isRequired,
	onShowParts: PropTypes.func.isRequired,
	repair: PropTypes.object.isRequired
};

export default StructureRepairRow;
