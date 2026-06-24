import React from 'react';
import PropTypes from 'prop-types';
import SchemaFormSection from '@/components/editors/SchemaFormSection';

const RepairPartFields = ({ control, currencies, errors }) => {
	const rows = [
		[
			{
				autoFocus: true,
				label: 'Part Description',
				name: 'description',
				required: 'Part Description is required'
			}
		],
		[
			{ flex: 4, label: 'Part Number', name: 'part_number' },
			{ flex: 4, label: 'Brand', name: 'brand' },
			{ flex: 4, label: 'Source', name: 'source' }
		],
		[
			{ flex: 3, label: 'Quantity', min: 1, minMessage: 'Quantity must be a positive number', name: 'qty', required: 'Quantity is required', type: 'number' },
			{ flex: 3, label: 'Purchase Date', name: 'purchase_date', type: 'date' },
			{ currency: true, flex: 3, label: 'Part Cost', name: 'part_cost', step: '0.01', type: 'number' },
			{
				flex: 3,
				label: 'Part Cost Currency',
				name: 'part_cost_currency',
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

RepairPartFields.propTypes = {
	control: PropTypes.object.isRequired,
	currencies: PropTypes.arrayOf(
		PropTypes.shape({
			currency_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
			currency_symbol: PropTypes.string
		})
	).isRequired,
	errors: PropTypes.object.isRequired
};

export default RepairPartFields;
