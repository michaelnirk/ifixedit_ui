export const REPAIR_EDITOR_CONFIG = {
	equipment: {
		repairLocationFullRow: false,
		repairLocationLabel: 'Repair Performed By',
		showMileageField: false,
		titleCreate: (parentName) => `Create New Repair for ${parentName || ''}`,
		titleEdit: 'Edit Repair'
	},
	structure: {
		repairLocationFullRow: false,
		repairLocationLabel: 'Repair Performed By',
		showMileageField: false,
		titleCreate: (parentName) => `Create New Repair for ${parentName || ''}`,
		titleEdit: 'Edit Repair'
	},
	vehicle: {
		repairLocationFullRow: true,
		repairLocationLabel: 'Repair Location',
		showMileageField: true,
		titleCreate: (parentName) => `Create New Repair for ${parentName || ''}`,
		titleEdit: 'Edit Repair'
	}
};

export const REPAIR_PART_EDITOR_CONFIG = {
	equipment: {
		titleCreate: (repairName) => `Add New Repair Part for ${repairName || ''}`,
		titleEdit: (repairName) => `Edit Repair Part for ${repairName || ''}`
	},
	structure: {
		titleCreate: (repairName) => `Add New Repair Part for ${repairName || ''}`,
		titleEdit: (repairName) => `Edit Repair Part for ${repairName || ''}`
	},
	vehicle: {
		titleCreate: (repairName) => `Add New Repair Part for ${repairName || ''}`,
		titleEdit: (repairName) => `Edit Repair Part for ${repairName || ''}`
	}
};
