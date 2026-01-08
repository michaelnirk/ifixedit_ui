import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import Edit from '@mui/icons-material/Edit';
import Archive from '@mui/icons-material/Archive';
import BadgeComponent from '@/components/Badge';
import { format } from "date-fns";
import { useMemo } from 'react';

const VehicleRow = ({ vehicle, currencies = [], onEdit, onArchive, onShowRepairs }) => {
    const vehiclePrice = useMemo(() => {
        if (!vehicle.purchase_price) {
            return '';
        }
        const currency = currencies.find(c => c.currency_id === vehicle.purchase_currency);
        return Intl.NumberFormat(currency.currency_language, { style: 'currency', currency: currency.currency_code }).format(vehicle.purchase_price)
    }, [vehicle.purchase_price, vehicle.purchase_currency, currencies]);
    
    return (
        <TableRow hover key={vehicle.vehicle_id} >
            <TableCell>{vehicle.name}</TableCell>
            <TableCell>{vehicle.year}</TableCell>
            <TableCell>{vehicle.make}</TableCell>
            <TableCell>{vehicle.model}</TableCell>
            <TableCell>{vehicle.date_purchased ? format(new Date(vehicle.date_purchased), "dd MMM yyyy") : ''}</TableCell>
            <TableCell>{vehicle.km_at_purchase}</TableCell>
            <TableCell>{vehiclePrice}</TableCell>
            <TableCell>{vehicle.vin}</TableCell>
            <TableCell>{vehicle.license_plate}</TableCell>
            <TableCell>{vehicle.key_code}</TableCell>
            <TableCell>
                <div style={{ display: 'flex'}}>
                    <Tooltip arrow placement="top" title="View Repairs">
                        <BadgeComponent content={vehicle?.repair_count || 0}>
                            <IconButton
                                onClick={() => onShowRepairs(vehicle.vehicle_id)}
                                size="small"
                            >
                                <CarRepairIcon />
                            </IconButton>
                        </BadgeComponent>
                    </Tooltip>
                    <Tooltip arrow placement="top" title="Edit Vehicle">
                        <IconButton
                            onClick={() => onEdit(vehicle.vehicle_id)}
                            size="small"
                        >
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip arrow placement="top" title="Archive Vehicle">
                        <IconButton
                            onClick={() => onArchive(vehicle.vehicle_id)}
                            size="small"
                        >
                            <Archive />
                        </IconButton>
                    </Tooltip>
                </div>
            </TableCell>
        </TableRow>
    );
}

export default VehicleRow;