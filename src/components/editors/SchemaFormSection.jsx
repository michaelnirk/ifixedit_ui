import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputRow from '@/components/InputRow';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller } from 'react-hook-form';

const SchemaFormSection = ({ control, errors, rows, selectOptions }) => {
	const [currencyEditing, setCurrencyEditing] = useState({});
	const renderField = (field) => {
		const {
			autoFocus,
			flex = 12,
			fullWidth,
			label,
			min,
			minMessage,
			name,
			optionLabel = 'label',
			optionsKey,
			optionValue = 'value',
			required,
			step,
			type = 'text',
			currency = false
		} = field;

		const fieldLabel = required ? `${label} *` : label;

		// Build validation rules
		const buildRules = () => {
			const rules = {};
			if (required) {
				rules.required = required;
			}
			if (min !== undefined) {
				rules.min = {
					message: minMessage || `Minimum value is ${min}`,
					value: min
				};
			}
			return Object.keys(rules).length > 0 ? rules : undefined;
		};

		if (type === 'date') {
			const dateTextFieldProps = {
				error: !!errors[name],
				helperText: errors[name] ? errors[name].message : '',
				margin: 'normal',
				size: 'small'
			};

			const dateSlotProps = {
				textField: dateTextFieldProps
			};

			return (
				<Controller
					key={name}
					name={name}
					control={control}
					rules={buildRules()}
					render={
						({ field: controllerField }) => (
							<DatePicker
								{...controllerField}
								format="DD MMMM YYYY"
								label={fieldLabel}
								sx={{ flex }}
								slotProps={dateSlotProps} />
						)
					} />
			);
		}

		if (type === 'select') {
			const options = selectOptions[optionsKey] || [];

			return (
				<Controller
					key={name}
					name={name}
					control={control}
					rules={buildRules()}
					render={
						({ field: controllerField }) => (
							<TextField
								{...controllerField}
								style={{ flex }}
								margin="normal"
								label={fieldLabel}
								select
								size="small"
								error={!!errors[name]}
								helperText={errors[name] ? errors[name].message : ''}>
								{
									options.map((option) => (
										<MenuItem
											key={option[optionValue]}
											value={option[optionValue]}>
											{option[optionLabel]}
										</MenuItem>
									))
								}
							</TextField>
						)
					} />
			);
		}

		return (
			<Controller
				key={name}
				name={name}
				control={control}
				rules={buildRules()}
				render={
					({ field: controllerField }) => {
						const isCurrencyField = type === 'number' && currency;
						const currentValue = controllerField.value ?? '';
						const editingValue = currencyEditing[name];
						const rawValue = editingValue !== undefined ? editingValue : currentValue;
						const displayValue = isCurrencyField
							? (editingValue !== undefined ? rawValue : rawValue === '' ? '' : Number(rawValue).toFixed(2))
							: rawValue;

						return (
							<TextField
								{...controllerField}
								value={displayValue}
								autoFocus={autoFocus}
								style={{ flex }}
								margin="normal"
								label={fieldLabel}
								fullWidth={fullWidth}
								size="small"
								type={isCurrencyField ? 'text' : type}
								inputProps={isCurrencyField ? { inputMode: 'decimal' } : undefined}
								step={step}
								onFocus={
									() => {
										if (isCurrencyField) {
											setCurrencyEditing((prev) => ({
												...prev,
												[name]: currentValue === '' ? '' : String(currentValue)
											}));
										}
										controllerField.onFocus?.();
									}
								}
								onBlur={
									() => {
										if (isCurrencyField) {
											setCurrencyEditing((prev) => {
												const next = { ...prev };
												delete next[name];
												return next;
											});
										}
										controllerField.onBlur?.();
									}
								}
								onChange={
									(e) => {
										const value = e.target.value;
										if (isCurrencyField) {
											setCurrencyEditing((prev) => ({ ...prev, [name]: value }));
										}
										controllerField.onChange(type === 'number' && value !== '' ? Number(value) : value);
									}
								}
								error={!!errors[name]}
								helperText={errors[name] ? errors[name].message : ''} />
						);
					}
				} />
		);
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<>
				{
					rows.map((row, rowIndex) => (
						<InputRow key={`row-${rowIndex}`}>
							{row.map(renderField)}
						</InputRow>
					))
				}
			</>
		</LocalizationProvider>
	);
};

SchemaFormSection.propTypes = {
	control: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
		autoFocus: PropTypes.bool,
		currency: PropTypes.bool,
		flex: PropTypes.number,
		fullWidth: PropTypes.bool,
		label: PropTypes.string.isRequired,
		min: PropTypes.number,
		minMessage: PropTypes.string,
		name: PropTypes.string.isRequired,
		optionLabel: PropTypes.string,
		optionsKey: PropTypes.string,
		optionValue: PropTypes.string,
		required: PropTypes.string,
		step: PropTypes.string,
		type: PropTypes.string
	}))).isRequired,
	selectOptions: PropTypes.object
};

SchemaFormSection.defaultProps = {
	selectOptions: {}
};

export default SchemaFormSection;
