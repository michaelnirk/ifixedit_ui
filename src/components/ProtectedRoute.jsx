import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated } from '@/state/features/authSlice';
import React from 'react';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const location = useLocation();

	if (!isAuthenticated) {
		// Save the attempted location for redirecting after login
		return (<Navigate
			to={redirectTo}
			state={{ from: location }}
			replace />);
	}

	return children;
};

ProtectedRoute.propTypes = {
	children: PropTypes.node.isRequired,
	redirectTo: PropTypes.string
};

export default ProtectedRoute;
