import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useLoginMutation } from '@/state/api/apiSlice';
import currenciesApi from '@/state/currencies/slice';
import { selectAuth } from '@/state/features/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  
  const [loginMutation, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error } = useSelector(selectAuth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    loginMutation(formData).unwrap().then((result) => {
      if (result.token) {
        // Preload currencies after login
        dispatch(currenciesApi.endpoints.list.initiate(result.user.user_id));
        // Redirect to the intended page or home page after successful login
        const from = location.state?.from?.pathname || '/vehicles'; 
        navigate(from, { replace: true });
      }
    }).catch((error) => {
      // Error is handled by RTK Query and auth slice
      console.error('Login failed:', error);
    });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 400,
          }}
        >
          <LoginIcon sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
          
          <Typography component="h1" variant="h4" gutterBottom>
            Login
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
              variant="outlined"
            />
            
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
              variant="outlined"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;