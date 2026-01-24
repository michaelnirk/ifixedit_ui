import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus, selectUserId, selectIsAuthenticated } from '@/state/features/authSlice';
import rootApi from '@/state/api/rootApi';

const AuthProvider = ({ children }) => {
	const dispatch = useDispatch();
	const userId = useSelector(selectUserId);
	const isAuthenticated = useSelector(selectIsAuthenticated);

	useEffect(() => {
		// Check authentication status when the app loads
		dispatch(checkAuthStatus());
	}, [dispatch]);

	useEffect(() => {
		// Prefetch currencies and end items when user is authenticated
		if (userId && isAuthenticated) {
			dispatch(rootApi.endpoints.listCurrencies.initiate(userId));
			dispatch(rootApi.endpoints.listEndItems.initiate(userId));
		}
	}, [dispatch, userId, isAuthenticated]);

	return children;
};

export default AuthProvider;
