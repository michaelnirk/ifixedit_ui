export const validateLoginForm = (formData) => {
	const validationErrors = {};
	const username = formData?.username || '';
	const password = formData?.password || '';

	if (!username) {
		validationErrors.username = 'Username is required';
	} else if (username.length < 3) {
		validationErrors.username = 'Username must be at least 3 characters';
	}

	if (!password) {
		validationErrors.password = 'Password is required';
	} else if (password.length < 6) {
		validationErrors.password = 'Password must be at least 6 characters';
	}

	return validationErrors;
};
