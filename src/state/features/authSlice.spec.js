import { describe, expect, it, vi } from 'vitest';
import auth, { checkAuthStatus, clearError, logout, setTokens } from '@/state/features/authSlice';

describe('authSlice reducers', () => {
	it('loads auth state from localStorage during checkAuthStatus', () => {
		localStorage.setItem('auth_token', 'token-1');
		localStorage.setItem('auth_refresh_token', 'refresh-1');
		localStorage.setItem('auth_user', JSON.stringify({ user_id: 'user-1' }));

		const initialState = {
			error: null,
			isAuthenticated: false,
			refreshToken: null,
			token: null,
			user: null
		};

		const nextState = auth.reducer(initialState, checkAuthStatus());

		expect(nextState.isAuthenticated).toBe(true);
		expect(nextState.token).toBe('token-1');
		expect(nextState.refreshToken).toBe('refresh-1');
		expect(nextState.user).toEqual({ user_id: 'user-1' });
	});

	it('clears auth state when localStorage user payload is invalid JSON', () => {
		vi.spyOn(console, 'error').mockImplementation(() => {
		});

		localStorage.setItem('auth_token', 'token-1');
		localStorage.setItem('auth_refresh_token', 'refresh-1');
		localStorage.setItem('auth_user', '{bad json}');

		const initialState = {
			error: null,
			isAuthenticated: false,
			refreshToken: null,
			token: null,
			user: null
		};

		const nextState = auth.reducer(initialState, checkAuthStatus());

		expect(nextState.isAuthenticated).toBe(false);
		expect(nextState.token).toBeNull();
		expect(nextState.refreshToken).toBeNull();
		expect(nextState.user).toBeNull();
		expect(localStorage.getItem('auth_token')).toBeNull();
		expect(localStorage.getItem('auth_refresh_token')).toBeNull();
		expect(localStorage.getItem('auth_user')).toBeNull();
	});

	it('sets authentication true when state already has refresh token and user', () => {
		const initialState = {
			error: null,
			isAuthenticated: false,
			refreshToken: 'refresh-1',
			token: 'token-1',
			user: { user_id: 'user-1' }
		};

		const nextState = auth.reducer(initialState, checkAuthStatus());

		expect(nextState.isAuthenticated).toBe(true);
		expect(nextState.token).toBe('token-1');
		expect(nextState.refreshToken).toBe('refresh-1');
		expect(nextState.user).toEqual({ user_id: 'user-1' });
	});

	it('clears only error via clearError', () => {
		const initialState = {
			error: 'Some auth error',
			isAuthenticated: true,
			refreshToken: 'refresh-1',
			token: 'token-1',
			user: { user_id: 'user-1' }
		};

		const nextState = auth.reducer(initialState, clearError());

		expect(nextState.error).toBeNull();
		expect(nextState.isAuthenticated).toBe(true);
		expect(nextState.token).toBe('token-1');
		expect(nextState.refreshToken).toBe('refresh-1');
	});

	it('stores tokens and computes isAuthenticated from refresh token plus user', () => {
		const initialState = {
			error: null,
			isAuthenticated: false,
			refreshToken: null,
			token: null,
			user: { user_id: 'user-1' }
		};

		const nextState = auth.reducer(
			initialState,
			setTokens({ accessToken: 'token-2', refreshToken: 'refresh-2' })
		);

		expect(nextState.isAuthenticated).toBe(true);
		expect(nextState.token).toBe('token-2');
		expect(nextState.refreshToken).toBe('refresh-2');
		expect(localStorage.getItem('auth_token')).toBe('token-2');
		expect(localStorage.getItem('auth_refresh_token')).toBe('refresh-2');
	});

	it('clears state and storage on logout action', () => {
		localStorage.setItem('auth_token', 'token-1');
		localStorage.setItem('auth_refresh_token', 'refresh-1');
		localStorage.setItem('auth_user', JSON.stringify({ user_id: 'user-1' }));

		const initialState = {
			error: 'Some auth error',
			isAuthenticated: true,
			refreshToken: 'refresh-1',
			token: 'token-1',
			user: { user_id: 'user-1' }
		};

		const nextState = auth.reducer(initialState, logout());

		expect(nextState.error).toBeNull();
		expect(nextState.isAuthenticated).toBe(false);
		expect(nextState.token).toBeNull();
		expect(nextState.refreshToken).toBeNull();
		expect(nextState.user).toBeNull();
		expect(localStorage.getItem('auth_token')).toBeNull();
		expect(localStorage.getItem('auth_refresh_token')).toBeNull();
		expect(localStorage.getItem('auth_user')).toBeNull();
	});
});
