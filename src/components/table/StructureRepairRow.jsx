import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import Edit from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BadgeComponent from '@/components/Badge';
import dayjs from 'dayjs';
import React, { useCallback, useMemo } from 'react';
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

	const localOnShowParts = useCallback((e) => {
		e.stopPropagation();
		onShowParts(repair.repair_id);
	}, [onShowParts, repair.repair_id]);

	const localOnDeleteRepair = useCallback((e) => {
		e.stopPropagation();
		onDeleteRepair(repair.repair_id);
	}, [onDeleteRepair, repair.repair_id]);

	const onRowClick = useCallback(() => {
		onEdit(repair.repair_id);
	}, [onEdit, repair.repair_id]);

	return (
		<TableRow
			hover
			key={repair.repair_id}
			onClick={onRowClick}
			sx={{ cursor: 'pointer' }}>
			<TableCell>{repair.description}</TableCell>
			<TableCell>{repair.repair_date ? dayjs(repair.repair_date).format('DD MMM YYYY') : ''}</TableCell>
			<TableCell>{repair.repair_location}</TableCell>
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
								onClick={localOnShowParts}
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
							onClick={localOnDeleteRepair}
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
