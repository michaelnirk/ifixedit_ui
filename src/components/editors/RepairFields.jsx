import React from 'react';
import PropTypes from 'prop-types';
import SchemaFormSection from '@/components/editors/SchemaFormSection';

const RepairFields = ({ control, currencies, errors, config }) => {
	const rows = [
		[
			{
				autoFocus: true,
				fullWidth: true,
				label: 'Repair Description',
				name: 'description',
				required: 'Description is required'
			}
		],
		...(
			config.repairLocationFullRow
				? [[{ label: config.repairLocationLabel, name: 'repair_location' }]]
				: []
		),
		[
			...(
				config.repairLocationFullRow
					? []
					: [{ flex: 3, label: config.repairLocationLabel, name: 'repair_location' }]
			),
			{
				flex: 3,
				label: 'Repair Date',
				name: 'repair_date',
				required: 'Repair date is required',
				type: 'date'
			},
			...(
				config.showMileageField
					? [{ flex: 3, label: 'Mileage at Repair', name: 'km_at_repair', type: 'number' }]
					: []
			),
			{ currency: true, flex: 3, label: 'Repair Cost', name: 'repair_cost', step: '0.01', type: 'number' },
			{
				flex: 3,
				label: 'Repair Cost Currency',
				name: 'repair_cost_currency',
				optionLabel: 'currency_symbol',
				optionsKey: 'currencies',
				optionValue: 'currency_id',
				type: 'select'
			}
		]
	];

	return (
		<SchemaFormSection
			control={control}
			errors={errors}
			rows={rows}
			selectOptions={{ currencies }} />
	);
};

RepairFields.propTypes = {
	config: PropTypes.shape({
		repairLocationFullRow: PropTypes.bool.isRequired,
		repairLocationLabel: PropTypes.string.isRequired,
		showMileageField: PropTypes.bool.isRequired
	}).isRequired,
	control: PropTypes.object.isRequired,
	currencies: PropTypes.arrayOf(
		PropTypes.shape({
			currency_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
			currency_symbol: PropTypes.string
		})
	).isRequired,
	errors: PropTypes.object.isRequired
};

export default RepairFields;
