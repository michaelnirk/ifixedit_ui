import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Edit from '@mui/icons-material/Edit';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import BadgeComponent from '@/components/Badge';
import dayjs from 'dayjs';
import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

const EquipmentItemRow = ({ equipmentItem, currencies = [], onEdit, onShowRepairs }) => {
	const cost = useMemo(() => {
		if (!equipmentItem.cost) {
			return '';
		}
		const currency = currencies.find((c) => c.currency_id === equipmentItem.cost_currency);
		if (!currency) {
			return equipmentItem.cost; // Return raw price if currency not found
		}
		return Intl.NumberFormat(currency.currency_language, { currency: currency.currency_code, style: 'currency' }).format(equipmentItem.cost);
	}, [equipmentItem.cost, equipmentItem.cost_currency, currencies]);

	const localOnShowRepairs = useCallback((e) => {
		e.stopPropagation();
		onShowRepairs(equipmentItem.equipment_id);
	}, [onShowRepairs, equipmentItem.equipment_id]);

	return (
		<TableRow
			hover
			key={equipmentItem.equipment_id}
			onClick={() => onEdit(equipmentItem.equipment_id)}
			sx={{ cursor: 'pointer' }}>
			<TableCell>{equipmentItem.name}</TableCell>
			<TableCell>{equipmentItem.description}</TableCell>
			<TableCell>{equipmentItem.acquisition_date ? dayjs(equipmentItem.acquisition_date).format('DD MMM YYYY') : ''}</TableCell>
			<TableCell>{cost}</TableCell>
			<TableCell>
				<div style={{ display: 'flex' }}>
					<Tooltip
						arrow
						placement="top"
						title={`Edit ${equipmentItem.name}`}>
						<IconButton
							onClick={() => onEdit(equipmentItem.equipment_id)}
							size="small">
							<Edit />
						</IconButton>
					</Tooltip>
					<BadgeComponent content={equipmentItem?.repair_count || 0}>
						<Tooltip
							arrow
							placement="top"
							title={`View Repairs for ${equipmentItem.name}`}>
							<IconButton
								onClick={localOnShowRepairs}
								size="small">
								<ConstructionOutlinedIcon />
							</IconButton>
						</Tooltip>
					</BadgeComponent>
				</div>
			</TableCell>
		</TableRow>
	);
};

EquipmentItemRow.propTypes = {
	currencies: PropTypes.array,
	equipmentItem: PropTypes.object.isRequired,
	onEdit: PropTypes.func.isRequired,
	onShowRepairs: PropTypes.func.isRequired
};

export default EquipmentItemRow;
