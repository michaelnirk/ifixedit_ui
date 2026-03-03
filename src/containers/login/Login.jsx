import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import { Login as LoginIcon } from '@mui/icons-material';
import { rootApi, useLoginMutation } from '@/state/api/rootApi';
import { selectAuth } from '@/state/features/authSlice';
import { validateLoginForm } from '@/containers/login/loginValidation';

const Login = () => {
	const [formData, setFormData] = useState({
		password: '',
		username: ''
	});
	const [errors, setErrors] = useState({});

	const [loginMutation, { isLoading }] = useLoginMutation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { error } = useSelector(selectAuth);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: ''
			}));
		}
	};

	const validateForm = () => {
		const validationErrors = validateLoginForm(formData);

		setErrors(validationErrors);
		return Object.keys(validationErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		loginMutation(formData).unwrap().then((result) => {
			if (result.accessToken) {
				dispatch(rootApi.endpoints.listCurrencies.initiate(result.user.user_id));
				dispatch(rootApi.endpoints.listEndItems.initiate(result.user.user_id));
				const from = location.state?.from?.pathname || '/vehicles';
				navigate(from, { replace: true });
			}
		}).catch((error) => {
			console.error('Login failed:', error);
		});
	};

	return (
		<Container component="main" maxWidth="sm">
			<Box
				sx={
					{
						alignItems: 'center',
						display: 'flex',
						flexDirection: 'column',
						marginTop: 8,
						minHeight: '100vh'
					}
				}>
				<Paper
					elevation={3}
					sx={
						{
							alignItems: 'center',
							display: 'flex',
							flexDirection: 'column',
							maxWidth: 400,
							padding: 4,
							width: '100%'
						}
					}>
					<LoginIcon sx={{ color: 'primary.main', fontSize: 40, mb: 2 }} />

					<Typography
						component="h1"
						variant="h4"
						gutterBottom>
						Login
					</Typography>

					{
						!!error && (
							<Alert severity="error" sx={{ mb: 2, width: '100%' }}>
								{error}
							</Alert>
						)
					}

					<Box
						component="form"
						onSubmit={handleSubmit}
						sx={{ mt: 1, width: '100%' }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="username"
							name="username"
							label="Username"
							type="text"
							autoComplete="username"
							autoFocus
							value={formData.username}
							onChange={handleInputChange}
							error={Boolean(errors.username)}
							helperText={errors.username}
							disabled={isLoading}
							variant="outlined" />

						<TextField
							margin="normal"
							required
							fullWidth
							id="password"
							name="password"
							label="Password"
							type="password"
							autoComplete="current-password"
							value={formData.password}
							onChange={handleInputChange}
							error={Boolean(errors.password)}
							helperText={errors.password}
							disabled={isLoading}
							variant="outlined" />

						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mb: 2, mt: 3, py: 1.5 }}
							disabled={isLoading}
							startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}>
							{isLoading ? 'Logging in...' : 'Login'}
						</Button>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
};

export default Login;
