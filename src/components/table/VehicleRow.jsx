import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import Edit from '@mui/icons-material/Edit';
import BadgeComponent from '@/components/Badge';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const VehicleRow = ({ vehicle, currencies = [], onEdit, onShowRepairs }) => {
	const vehiclePrice = useMemo(() => {
		if (!vehicle.purchase_price) {
			return '';
		}
		const currency = currencies.find((c) => c.currency_id === vehicle.purchase_currency);
		if (!currency) {
			return vehicle.purchase_price; // Return raw price if currency not found
		}
		return Intl.NumberFormat(currency.currency_language, { currency: currency.currency_code, style: 'currency' }).format(vehicle.purchase_price);
	}, [vehicle.purchase_price, vehicle.purchase_currency, currencies]);

	return (
		<TableRow hover key={vehicle.vehicle_id} >
			<TableCell>{vehicle.name}</TableCell>
			<TableCell>{vehicle.year}</TableCell>
			<TableCell>{vehicle.make}</TableCell>
			<TableCell>{vehicle.model}</TableCell>
			<TableCell>{vehicle.date_purchased ? dayjs(vehicle.date_purchased).format('DD MMM YYYY') : ''}</TableCell>
			<TableCell>{vehicle.km_at_purchase}</TableCell>
			<TableCell>{vehiclePrice}</TableCell>
			<TableCell>{vehicle.vin}</TableCell>
			<TableCell>{vehicle.license_plate}</TableCell>
			<TableCell>{vehicle.key_code}</TableCell>
			<TableCell>
				<div style={{ display: 'flex' }}>
					<Tooltip
						arrow
						placement="top"
						title={`Edit ${vehicle.name}`}>
						<IconButton
							onClick={() => onEdit(vehicle.vehicle_id)}
							size="small">
							<Edit />
						</IconButton>
					</Tooltip>
					<BadgeComponent content={vehicle?.repair_count || 0}>
						<Tooltip
							arrow
							placement="top"
							title={`View Repairs for ${vehicle.name}`}>
							<IconButton
								onClick={() => onShowRepairs(vehicle.vehicle_id)}
								size="small">
								<CarRepairIcon />
							</IconButton>
						</Tooltip>
					</BadgeComponent>
				</div>
			</TableCell>
		</TableRow>
	);
};

VehicleRow.propTypes = {
	currencies: PropTypes.array,
	onEdit: PropTypes.func.isRequired,
	onShowRepairs: PropTypes.func.isRequired,
	vehicle: PropTypes.object.isRequired
};

export default VehicleRow;
