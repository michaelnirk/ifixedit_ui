export const sortItems = (items, sortedBy) => {
	const { field, direction } = sortedBy;
	return [...items].sort((a, b) => {
		return a[field] < b[field] ? (direction === 'asc' ? -1 : 1) : a[field] > b[field] ? (direction === 'asc' ? 1 : -1) : 0;
	});
};
