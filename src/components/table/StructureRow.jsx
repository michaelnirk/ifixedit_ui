import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Edit from '@mui/icons-material/Edit';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import BadgeComponent from '@/components/Badge';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const StructureRow = ({ structure, currencies = [], acquisitionMethods, onEdit, onShowRepairs }) => {
	const cost = useMemo(() => {
		if (!structure.cost) {
			return '';
		}
		const currency = currencies.find((c) => c.currency_id === structure.cost_currency);
		if (!currency) {
			return structure.cost; // Return raw price if currency not found
		}
		return Intl.NumberFormat(currency.currency_language, { currency: currency.currency_code, style: 'currency' }).format(structure.cost);
	}, [structure.cost, structure.cost_currency, currencies]);

	const acquisitionTypeValue = useMemo(() => {
		return acquisitionMethods && acquisitionMethods.length > 0 && structure.how_acquired
			? acquisitionMethods.find((acquisitionMethod) => acquisitionMethod.acquisition_method_id === structure.how_acquired)?.name
			: '';
	}, [acquisitionMethods, structure.how_acquired]);

	return (
		<TableRow hover key={structure.structure_id} >
			<TableCell>{structure.name}</TableCell>
			<TableCell>{structure.description}</TableCell>
			<TableCell>{acquisitionTypeValue}</TableCell>
			<TableCell>{structure.acquisition_date ? dayjs(structure.acquisition_date).format('DD MMM YYYY') : ''}</TableCell>
			<TableCell>{cost}</TableCell>
			<TableCell>
				<div style={{ display: 'flex' }}>
					<Tooltip
						arrow
						placement="top"
						title={`Edit ${structure.description}`}>
						<IconButton
							onClick={() => onEdit(structure.structure_id)}
							size="small">
							<Edit />
						</IconButton>
					</Tooltip>
					<BadgeComponent content={structure?.repair_count || 0}>
						<Tooltip
							arrow
							placement="top"
							title={`View Repairs for ${structure.description}`}>
							<IconButton
								onClick={() => onShowRepairs(structure.structure_id)}
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

StructureRow.propTypes = {
	acquisitionMethods: PropTypes.array,
	currencies: PropTypes.array,
	onEdit: PropTypes.func.isRequired,
	onShowRepairs: PropTypes.func.isRequired,
	structure: PropTypes.object.isRequired
};

export default StructureRow;
