import { createSlice } from '@reduxjs/toolkit';
import { rootApi } from '@/state/api/rootApi';

// Storage keys
const TOKEN_STORAGE_KEY = 'auth_token';
const REFRESH_TOKEN_STORAGE_KEY = 'auth_refresh_token';
const USER_STORAGE_KEY = 'auth_user';

// Load initial state from localStorage
const loadInitialAuthState = () => {
	try {
		const token = localStorage.getItem(TOKEN_STORAGE_KEY);
		const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
		const user = localStorage.getItem(USER_STORAGE_KEY);

		if (refreshToken && user) {
			return {
				error: null,
				isAuthenticated: true,
				refreshToken: refreshToken,
				token: token,
				user: JSON.parse(user)
			};
		} else {
			// Clear invalid data
			localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
			localStorage.removeItem(TOKEN_STORAGE_KEY);
			localStorage.removeItem(USER_STORAGE_KEY);
		}
	} catch (error) {
		console.error('Error loading auth state from localStorage:', error);
		localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
		localStorage.removeItem(TOKEN_STORAGE_KEY);
		localStorage.removeItem(USER_STORAGE_KEY);
	}

	return {
		error: null,
		isAuthenticated: false,
		refreshToken: null,
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
					state.token = action.payload.accessToken;
					state.refreshToken = action.payload.refreshToken;
					state.isAuthenticated = Boolean(action.payload.refreshToken && action.payload.user);
					state.error = null;

					// Persist to localStorage
					try {
						localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.accessToken);
						localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, action.payload.refreshToken);
						localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload.user));
					} catch (error) {
						console.error('Error saving auth to localStorage:', error);
					}
				}
			)
			.addMatcher(
				rootApi.endpoints.login.matchRejected,
				(state, action) => {
					const status = action.payload?.status;
					const errorMessage = status === 429
						? 'Too many login attempts, try again later'
						: (action.payload?.data?.message || action.error?.message || 'Login failed');

					state.user = null;
					state.refreshToken = null;
					state.token = null;
					state.isAuthenticated = false;
					state.error = errorMessage;
					// Clear localStorage on failed login
					localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
					localStorage.removeItem(TOKEN_STORAGE_KEY);
					localStorage.removeItem(USER_STORAGE_KEY);
				}
			)
		// Logout cases
			.addMatcher(
				rootApi.endpoints.logout.matchFulfilled,
				(state) => {
					state.user = null;
					state.refreshToken = null;
					state.token = null;
					state.isAuthenticated = false;
					state.error = null;
					// Clear localStorage
					localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
					localStorage.removeItem(TOKEN_STORAGE_KEY);
					localStorage.removeItem(USER_STORAGE_KEY);
				}
			)
			.addMatcher(
				rootApi.endpoints.logout.matchRejected,
				(state) => {
					// Even if logout API fails, we clear the state
					state.user = null;
					state.refreshToken = null;
					state.token = null;
					state.isAuthenticated = false;
					// Clear localStorage
					localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
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
			if (!state.refreshToken) {
				try {
					const token = localStorage.getItem(TOKEN_STORAGE_KEY);
					const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
					const user = localStorage.getItem(USER_STORAGE_KEY);

					if (refreshToken && user) {
						state.token = token;
						state.refreshToken = refreshToken;
						state.user = JSON.parse(user);
						state.isAuthenticated = true;
						return;
					}
				} catch (error) {
					console.error('Error loading auth from localStorage:', error);
				}
			}

			if (state.refreshToken && state.user) {
				state.isAuthenticated = true;
			} else {
				state.token = null;
				state.refreshToken = null;
				state.user = null;
				state.isAuthenticated = false;
				// Clear localStorage
				localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
				localStorage.removeItem(TOKEN_STORAGE_KEY);
				localStorage.removeItem(USER_STORAGE_KEY);
			}
		},
		clearError: (state) => {
			state.error = null;
		},
		logout: (state) => {
			state.user = null;
			state.refreshToken = null;
			state.token = null;
			state.isAuthenticated = false;
			state.error = null;
			// Clear localStorage
			localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
			localStorage.removeItem(TOKEN_STORAGE_KEY);
			localStorage.removeItem(USER_STORAGE_KEY);
		},
		setTokens: (state, action) => {
			state.token = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			state.isAuthenticated = Boolean(action.payload.refreshToken && state.user);

			localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.accessToken);
			localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, action.payload.refreshToken);
		}
	}
});

export const { clearError, checkAuthStatus, logout, setTokens } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export const selectRefreshToken = (state) => state.auth.refreshToken;
export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectUserId = (state) => state.auth.user?.user_id;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice;
