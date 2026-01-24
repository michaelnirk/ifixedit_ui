import { createSlice } from '@reduxjs/toolkit';
import { rootApi } from '@/state/api/rootApi';

// Storage keys
const TOKEN_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

// Check if user is authenticated based on token in state
const isTokenValid = (token) => {
	if (!token) {
		return false;
	}

	try {
		// Basic JWT expiration check
		const payload = JSON.parse(atob(token.split('.')[1]));
		const currentTime = Date.now() / 1000;
		return payload.exp > currentTime;
	} catch (error) {
		console.error('Error parsing token:', error);
		return false;
	}
};

// Load initial state from localStorage
const loadInitialAuthState = () => {
	try {
		const token = localStorage.getItem(TOKEN_STORAGE_KEY);
		const user = localStorage.getItem(USER_STORAGE_KEY);

		if (token && user && isTokenValid(token)) {
			return {
				error: null,
				isAuthenticated: true,
				token: token,
				user: JSON.parse(user)
			};
		} else {
			// Clear invalid data
			localStorage.removeItem(TOKEN_STORAGE_KEY);
			localStorage.removeItem(USER_STORAGE_KEY);
		}
	} catch (error) {
		console.error('Error loading auth state from localStorage:', error);
		localStorage.removeItem(TOKEN_STORAGE_KEY);
		localStorage.removeItem(USER_STORAGE_KEY);
	}

	return {
		error: null,
		isAuthenticated: false,
		token: null,
		user: null
	};
};

const initialState = loadInitialAuthState();

const authSlice = createSlice({
	extraReducers: (builder) => {
		builder
		// Login cases
			.addMatcher(
				rootApi.endpoints.login.matchPending,
				(state) => {
					state.error = null;
				}
			)
			.addMatcher(
				rootApi.endpoints.login.matchFulfilled,
				(state, action) => {
					state.user = action.payload.user;
					state.token = action.payload.token;
					state.isAuthenticated = isTokenValid(action.payload.token);
					state.error = null;

					// Persist to localStorage
					try {
						localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.token);
						localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload.user));
					} catch (error) {
						console.error('Error saving auth to localStorage:', error);
					}
				}
			)
			.addMatcher(
				rootApi.endpoints.login.matchRejected,
				(state, action) => {
					state.user = null;
					state.token = null;
					state.isAuthenticated = false;
					state.error = action.error?.message || 'Login failed';
					// Clear localStorage on failed login
					localStorage.removeItem(TOKEN_STORAGE_KEY);
					localStorage.removeItem(USER_STORAGE_KEY);
				}
			)
		// Logout cases
			.addMatcher(
				rootApi.endpoints.logout.matchFulfilled,
				(state) => {
					state.user = null;
					state.token = null;
					state.isAuthenticated = false;
					state.error = null;
					// Clear localStorage
					localStorage.removeItem(TOKEN_STORAGE_KEY);
					localStorage.removeItem(USER_STORAGE_KEY);
				}
			)
			.addMatcher(
				rootApi.endpoints.logout.matchRejected,
				(state) => {
					// Even if logout API fails, we clear the state
					state.user = null;
					state.token = null;
					state.isAuthenticated = false;
					// Clear localStorage
					localStorage.removeItem(TOKEN_STORAGE_KEY);
					localStorage.removeItem(USER_STORAGE_KEY);
				}
			);
	},
	initialState,
	name: 'auth',
	reducers: {
		checkAuthStatus: (state) => {
			// Try to load from localStorage if not in state
			if (!state.token) {
				try {
					const token = localStorage.getItem(TOKEN_STORAGE_KEY);
					const user = localStorage.getItem(USER_STORAGE_KEY);

					if (token && user && isTokenValid(token)) {
						state.token = token;
						state.user = JSON.parse(user);
						state.isAuthenticated = true;
						return;
					}
				} catch (error) {
					console.error('Error loading auth from localStorage:', error);
				}
			}

			if (state.token && isTokenValid(state.token)) {
				state.isAuthenticated = true;
			} else {
				state.token = null;
				state.user = null;
				state.isAuthenticated = false;
				// Clear localStorage
				localStorage.removeItem(TOKEN_STORAGE_KEY);
				localStorage.removeItem(USER_STORAGE_KEY);
			}
		},
		clearError: (state) => {
			state.error = null;
		},
		logout: (state) => {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
			state.error = null;
			// Clear localStorage
			localStorage.removeItem(TOKEN_STORAGE_KEY);
			localStorage.removeItem(USER_STORAGE_KEY);
		}
	}
});

export const { clearError, checkAuthStatus, logout } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectUserId = (state) => state.auth.user?.user_id;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice;
